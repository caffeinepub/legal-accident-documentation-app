import type { ExternalBlob } from "../backend";

export interface VehicleContext {
  make?: string;
  model?: string;
  colour?: string;
  licencePlate?: string;
  year?: string;
}

export interface PhotoAnalysisResult {
  description: string;
  evidenceGaps: Array<{
    description: string;
    confidenceLevel: bigint;
    evidenceType: string;
  }>;
}

function buildVehicleContextString(vehicle?: VehicleContext): string {
  if (!vehicle) return "";
  const parts: string[] = [];
  if (vehicle.year) parts.push(vehicle.year);
  if (vehicle.colour) parts.push(vehicle.colour);
  if (vehicle.make) parts.push(vehicle.make);
  if (vehicle.model) parts.push(vehicle.model);
  if (vehicle.licencePlate) parts.push(`(${vehicle.licencePlate})`);
  return parts.length > 0 ? parts.join(" ") : "";
}

async function blobToBase64(blob: ExternalBlob): Promise<string> {
  const bytes = await blob.getBytes();
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function analyzePhotos(
  photos: ExternalBlob[],
  vehicleContext?: VehicleContext,
): Promise<PhotoAnalysisResult> {
  const vehicleLabel = buildVehicleContextString(vehicleContext);

  const vehicleContextText = vehicleLabel
    ? `Vehicle details: ${vehicleLabel}.`
    : "Vehicle details: Not provided.";

  const prompt = `You are a UK road traffic incident analyst with expertise in insurance claims and legal documentation. Analyse the attached accident scene photo(s) and provide a comprehensive formal assessment.

Please provide:
1) A formal insurance/legal description covering: visible damage to vehicles (type, severity, location on vehicle), road surface conditions, vehicle positions and angles relative to the road, any traffic signs or signals visible, skid marks or debris, weather indicators from the scene, and any visible injury indicators.
2) A JSON list of evidence gaps — specific recommendations for additional photos, videos, witness statements, or GPS data that would strengthen the legal and insurance claim.

${vehicleContextText}

IMPORTANT: Format your entire response as valid JSON with this exact structure:
{
  "description": "Your formal insurance/legal description here as a single paragraph",
  "evidenceGaps": [
    {
      "description": "Specific recommendation for additional evidence",
      "evidenceType": "photo|video|witness_statement|gps_data|description|third_party_info|traffic_signal|conditions",
      "confidenceLevel": 75
    }
  ]
}

Use formal UK insurance/legal language in the description. The confidenceLevel should be an integer from 0 to 100 indicating how strongly this evidence gap would improve the claim.`;

  // Convert all photos to base64
  const base64Images = await Promise.all(photos.map(blobToBase64));

  // Build content array: text prompt + all images
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [{ type: "text", text: prompt }];

  for (const b64 of base64Images) {
    content.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${b64}` },
    });
  }

  try {
    const response = await fetch("/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const rawContent: string = data?.choices?.[0]?.message?.content ?? "";

    // Attempt to parse the JSON response
    try {
      // Strip markdown code fences if present
      const cleaned = rawContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned) as {
        description?: string;
        evidenceGaps?: Array<{
          description: string;
          evidenceType: string;
          confidenceLevel: number;
        }>;
      };

      const description =
        parsed.description?.trim() ||
        "Photo analysis completed. No formal description could be extracted.";

      const evidenceGaps = (parsed.evidenceGaps ?? []).map((gap) => ({
        description: gap.description,
        evidenceType: gap.evidenceType,
        confidenceLevel: BigInt(
          Math.min(100, Math.max(0, Math.round(gap.confidenceLevel ?? 50))),
        ),
      }));

      return { description, evidenceGaps };
    } catch {
      // JSON parse failed — use raw content as description
      return {
        description: rawContent.trim() || "Photo analysis completed.",
        evidenceGaps: [],
      };
    }
  } catch {
    // Network or API failure — return a graceful fallback
    const photoCount = photos.length;
    return {
      description: `Photo analysis could not be completed at this time (${photoCount} image${photoCount !== 1 ? "s" : ""} submitted). Please ensure you have a stable connection and retry the analysis.`,
      evidenceGaps: [
        {
          description:
            "AI photo analysis was unavailable. Manual review of submitted images is recommended.",
          evidenceType: "photo",
          confidenceLevel: BigInt(80),
        },
      ],
    };
  }
}

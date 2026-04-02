import type { AccidentNarrative, AccidentReport, EvidenceGap } from "@/backend";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AIGeneratedNarrative {
  narrativeText: string;
  evidenceGaps: Array<{
    description: string;
    evidenceType: string;
    confidenceLevel: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildReportContext(report: AccidentReport): string {
  const dateObj = report.timestamp ? new Date(Number(report.timestamp)) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString("en-GB", { dateStyle: "long" })
    : "an unspecified date";
  const timeStr = dateObj
    ? dateObj.toLocaleTimeString("en-GB", { timeStyle: "short" })
    : "an unspecified time";

  const vehicle =
    [report.vehicleInfo?.make, report.vehicleInfo?.model]
      .filter(Boolean)
      .join(" ") || "the subject vehicle";
  const plate =
    report.vehicleInfo?.licencePlate ||
    report.vehicleInfo?.registration ||
    "unknown registration";
  const speed = report.vehicleSpeed
    ? `${Number(report.vehicleSpeed)} mph`
    : "an unrecorded speed";
  const weather = report.surroundings?.weather || "unspecified weather";
  const road = report.surroundings?.roadCondition || "unspecified road";
  const visibility =
    report.surroundings?.visibility || "unspecified visibility";
  const location =
    report.stopLocation || report.accidentMarker || "an unspecified location";

  const lines: string[] = [
    `Date/Time: ${dateStr} at ${timeStr}`,
    `Location: ${location}`,
    `Insured Vehicle: ${vehicle}, registration ${plate}`,
    `Speed at time of incident: ${speed}`,
    `Weather: ${weather}`,
    `Road Condition: ${road}`,
    `Visibility: ${visibility}`,
  ];

  if (report.damageDescription) {
    lines.push(`Damage Description: ${report.damageDescription}`);
  }
  if (report.isAtFault !== undefined) {
    lines.push(
      `Liability (insured): ${report.isAtFault ? "At fault" : "Not at fault"}`,
    );
  }
  if (report.faultReasoning) {
    lines.push(`Fault Reasoning: ${report.faultReasoning}`);
  }
  if (report.otherVehicle) {
    const ov = report.otherVehicle;
    const ovDesc =
      [ov.make, ov.model, ov.colour].filter(Boolean).join(" ") ||
      "third-party vehicle";
    lines.push(
      `Third-Party Vehicle: ${ovDesc}, registration ${ov.licencePlate || ov.registration || "unknown"}`,
    );
    if (ov.ownerName) lines.push(`Third-Party Driver: ${ov.ownerName}`);
    if (ov.insurer) lines.push(`Third-Party Insurer: ${ov.insurer}`);
  }
  if (report.violations && report.violations.length > 0) {
    lines.push(
      `Traffic Violations: ${report.violations.map((v) => v.description).join("; ")}`,
    );
  }
  if (report.witnessStatement) {
    lines.push(`Witness Statement: "${report.witnessStatement}"`);
  }
  if (report.witnesses && report.witnesses.length > 0) {
    lines.push(
      `Witnesses: ${report.witnesses
        .map((w) => w.name)
        .filter(Boolean)
        .join(", ")}`,
    );
  }
  if (report.trafficSignalState) {
    lines.push(
      `Traffic Signal: colour ${report.trafficSignalState.color}, position ${report.trafficSignalState.position}`,
    );
  }

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// AI-powered generation
// ─────────────────────────────────────────────────────────────────────────────

async function generateWithAI(
  reportContext: string,
  photoAnalysis?: string,
  dashCamAnalysis?: string,
): Promise<AIGeneratedNarrative | null> {
  const sections = [
    "1. INCIDENT OVERVIEW",
    "2. PREVAILING CONDITIONS",
    "3. DAMAGE DESCRIPTION",
    "4. THIRD PARTY DETAILS",
    "5. TRAFFIC VIOLATIONS",
    "6. DASH CAM EVIDENCE",
    "7. PHOTO EVIDENCE SUMMARY",
    "8. LIABILITY ASSESSMENT",
    "9. WITNESS ACCOUNT",
  ];

  const sourceMaterial: string[] = [`=== INCIDENT DATA ===\n${reportContext}`];

  if (photoAnalysis) {
    sourceMaterial.push(
      `=== AI PHOTO ANALYSIS (use as primary evidence source) ===\n${photoAnalysis}`,
    );
  }
  if (dashCamAnalysis) {
    sourceMaterial.push(
      `=== DASH CAM ANALYSIS (use as supporting evidence) ===\n${dashCamAnalysis}`,
    );
  }

  const prompt = `You are a senior UK road traffic claims handler and legal document specialist. Using the incident data and AI evidence analysis provided below, generate a formal insurance/legal narrative statement.

${sourceMaterial.join("\n\n")}

REQUIREMENTS:
- Write in formal UK insurance/legal language (third person, past tense where appropriate)
- Include ALL of the following numbered sections in order: ${sections.join(", ")}
- For sections where information is not available, include the section heading but note "No information available" — do NOT omit any section
- Cross-reference the photo analysis and dash cam analysis throughout the narrative as primary evidence sources
- The narrative must be suitable for submission to a UK insurer or court

Also identify evidence gaps: specific items of evidence that are missing but would materially strengthen this claim (photos, videos, witness statements, GPS data, etc.).

IMPORTANT: Return your entire response as valid JSON with this exact structure:
{
  "narrativeText": "The full formal narrative with all 9 sections, separated by blank lines",
  "evidenceGaps": [
    {
      "description": "Specific recommendation",
      "evidenceType": "photo|video|witness_statement|gps_data|description|third_party_info|traffic_signal|conditions",
      "confidenceLevel": 80
    }
  ]
}`;

  const response = await fetch("/api/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "anthropic/bedrock/claude-sonnet-4-6",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const rawContent: string = data?.choices?.[0]?.message?.content ?? "";

  try {
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned) as Partial<AIGeneratedNarrative>;
    if (!parsed.narrativeText) return null;
    return {
      narrativeText: parsed.narrativeText,
      evidenceGaps: parsed.evidenceGaps ?? [],
    };
  } catch {
    // Return raw content as narrative text if JSON parse fails
    if (rawContent.trim()) {
      return {
        narrativeText: rawContent.trim(),
        evidenceGaps: [],
      };
    }
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule-based fallback (original synchronous logic)
// ─────────────────────────────────────────────────────────────────────────────

function generateFallbackNarrative(report: AccidentReport): AccidentNarrative {
  const dateObj = report.timestamp ? new Date(Number(report.timestamp)) : null;

  const dateStr = dateObj
    ? dateObj.toLocaleDateString("en-GB", { dateStyle: "long" })
    : "an unspecified date";

  const timeStr = dateObj
    ? dateObj.toLocaleTimeString("en-GB", { timeStyle: "short" })
    : "an unspecified time";

  const vehicle =
    [report.vehicleInfo?.make, report.vehicleInfo?.model]
      .filter(Boolean)
      .join(" ") || "the subject vehicle";

  const plate =
    report.vehicleInfo?.licencePlate ||
    report.vehicleInfo?.registration ||
    "unknown registration";
  const speed = report.vehicleSpeed
    ? `${Number(report.vehicleSpeed)} mph`
    : "an unrecorded speed";
  const weather = report.surroundings?.weather || "unspecified weather";
  const road = report.surroundings?.roadCondition || "unspecified road";
  const visibility =
    report.surroundings?.visibility || "unspecified visibility";
  const location =
    report.stopLocation || report.accidentMarker || "an unspecified location";

  const hasDashCam = report.dashCamFootage && report.dashCamFootage.length > 0;
  const dashCamAnalysis = report.dashCamAnalysis;
  const hasOtherVehicle = !!report.otherVehicle;
  const hasViolations = report.violations && report.violations.length > 0;

  // Build structured narrative sections
  const sections: string[] = [];

  // 1. Incident overview
  sections.push(
    `INCIDENT OVERVIEW:\n1. At approximately ${timeStr} on ${dateStr}, a road traffic incident occurred at ${location} involving the insured vehicle, a ${vehicle} bearing registration ${plate}, travelling at approximately ${speed}.`,
  );

  // 2. Prevailing conditions
  sections.push(
    `PREVAILING CONDITIONS:\n2. At the time of the incident, weather conditions were recorded as ${weather.toLowerCase()} with ${road.toLowerCase()} road surfaces and ${visibility.toLowerCase()} visibility.`,
  );

  // 3. Damage description
  if (report.damageDescription) {
    sections.push(
      `DAMAGE DESCRIPTION:\n3. The claimant reports the following damage sustained to the insured vehicle: ${report.damageDescription}.`,
    );
  } else {
    sections.push(
      "DAMAGE DESCRIPTION:\n3. No damage description was provided at the time of this report.",
    );
  }

  // 4. Third-party details
  if (hasOtherVehicle && report.otherVehicle) {
    const ov = report.otherVehicle;
    const ovDesc =
      [ov.make, ov.model, ov.colour].filter(Boolean).join(" ") ||
      "a third-party vehicle";
    const plateRef = ov.licencePlate ? `, registration ${ov.licencePlate}` : "";
    const keeperRef = ov.ownerName ? `, registered keeper ${ov.ownerName}` : "";
    sections.push(
      `THIRD PARTY DETAILS:\n4. A third-party vehicle was involved in this incident: ${ovDesc}${plateRef}${keeperRef}.`,
    );
  } else {
    sections.push(
      "THIRD PARTY DETAILS:\n4. No third-party vehicle details were recorded at the time of this report.",
    );
  }

  // 5. Traffic violations
  if (hasViolations) {
    const vTypes = report.violations.map((v) => v.description).join("; ");
    sections.push(
      `TRAFFIC VIOLATIONS:\n5. The following contraventions were identified: ${vTypes}.`,
    );
  } else {
    sections.push(
      "TRAFFIC VIOLATIONS:\n5. No traffic violations were recorded in connection with this incident.",
    );
  }

  // 6. Dash cam evidence
  if (hasDashCam && dashCamAnalysis) {
    const collisionText = dashCamAnalysis.collisionDetected
      ? "Dash cam footage confirms a collision event was recorded."
      : "Dash cam footage was reviewed; no definitive collision event was automatically detected from the available recording.";
    sections.push(
      `DASH CAM EVIDENCE:\n6. ${collisionText} Road conditions recorded by the dash cam: ${dashCamAnalysis.roadConditions}. Fault indicators noted from footage: ${dashCamAnalysis.faultIndicators}.`,
    );
  } else if (!hasDashCam) {
    sections.push(
      "DASH CAM EVIDENCE:\n6. No dash cam footage was submitted in respect of this incident. The foregoing account is based solely on information reported by the insured party.",
    );
  } else {
    sections.push(
      "DASH CAM EVIDENCE:\n6. Dash cam footage has been submitted but has not yet been analysed.",
    );
  }

  // 7. Photo evidence summary
  const photoCount = report.imageData?.length ?? 0;
  if (photoCount > 0) {
    sections.push(
      `PHOTO EVIDENCE SUMMARY:\n7. ${photoCount} photograph${photoCount !== 1 ? "s" : ""} ${photoCount !== 1 ? "have" : "has"} been submitted in support of this claim. The images have not yet been subject to formal AI analysis.`,
    );
  } else {
    sections.push(
      "PHOTO EVIDENCE SUMMARY:\n7. No photographic evidence has been submitted at this time. The claimant is strongly advised to provide photographs of all damaged panels and the incident scene.",
    );
  }

  // 8. Liability assessment
  if (report.isAtFault) {
    sections.push(
      `LIABILITY ASSESSMENT:\n8. Based on the available evidence, the insured party is assessed as bearing primary liability in respect of this incident. ${report.faultReasoning ? `Basis of determination: ${report.faultReasoning}.` : ""}`,
    );
  } else {
    sections.push(
      `LIABILITY ASSESSMENT:\n8. Based on the available evidence, the insured party is assessed as not at fault in respect of this incident. ${report.faultReasoning ? `Basis of determination: ${report.faultReasoning}.` : ""}`,
    );
  }

  // 9. Witness account
  if (report.witnessStatement) {
    sections.push(
      `WITNESS ACCOUNT:\n9. An independent witness provided the following account: "${report.witnessStatement}"`,
    );
  } else {
    sections.push(
      "WITNESS ACCOUNT:\n9. No independent witness account has been recorded in connection with this incident.",
    );
  }

  const narrativeText = sections.join("\n\n");

  // Build evidence gaps as formal recommendations
  const evidenceGaps: EvidenceGap[] = [];

  if (!hasDashCam) {
    evidenceGaps.push({
      description:
        "It is recommended that front and rear dash cam footage be submitted. Objective video evidence of the collision sequence would materially strengthen the evidential basis of this report.",
      evidenceType: "video",
      confidenceLevel: BigInt(95),
    });
  } else if (report.dashCamFootage && report.dashCamFootage.length < 2) {
    evidenceGaps.push({
      description:
        "The claimant is advised to provide a rear-facing or side-angle recording in addition to the clip already submitted. A supplementary clip would assist in clarifying lane position and the approach of the third-party vehicle.",
      evidenceType: "video",
      confidenceLevel: BigInt(70),
    });
  }

  if (!report.imageData || report.imageData.length === 0) {
    evidenceGaps.push({
      description:
        "It is recommended that photographic evidence of vehicle damage (front, rear, left and right panels) and the incident scene be uploaded. Such photographs are essential for insurance assessment purposes.",
      evidenceType: "photo",
      confidenceLevel: BigInt(90),
    });
  } else if (report.imageData.length < 4) {
    evidenceGaps.push({
      description: `The claimant is advised to submit additional photographs. Only ${report.imageData.length} image(s) have been provided; further images covering all damaged panels and the wider scene would strengthen the claim.`,
      evidenceType: "photo",
      confidenceLevel: BigInt(65),
    });
  }

  if (
    !report.damageDescription ||
    report.damageDescription.trim().length < 20
  ) {
    evidenceGaps.push({
      description:
        'It is recommended that a detailed written description of each damaged area be provided (e.g., "front bumper cracked, bonnet dented, nearside headlight shattered"). A comprehensive description will support the damage severity assessment.',
      evidenceType: "description",
      confidenceLevel: BigInt(80),
    });
  }

  if (!hasOtherVehicle) {
    evidenceGaps.push({
      description:
        "The claimant is advised to record full details of the other vehicle involved, including the third-party driver's name, vehicle registration, insurer, and policy number. These particulars are required for the claims process.",
      evidenceType: "third_party_info",
      confidenceLevel: BigInt(85),
    });
  }

  if (!report.witnesses || report.witnesses.length === 0) {
    evidenceGaps.push({
      description:
        "It is recommended that independent witness particulars be recorded. Should any bystanders have witnessed the incident, their contact details and statements would corroborate the insured party's account.",
      evidenceType: "witness",
      confidenceLevel: BigInt(60),
    });
  }

  if (!report.trafficSignalState && !hasViolations) {
    evidenceGaps.push({
      description:
        "The claimant is advised to document the state of any traffic signals or road signs relevant to the incident. Recording right-of-way indicators would assist in determining liability.",
      evidenceType: "traffic_signal",
      confidenceLevel: BigInt(55),
    });
  }

  if (
    !report.surroundings?.weather ||
    report.surroundings.weather === "Clear"
  ) {
    if (
      report.surroundings?.roadCondition &&
      report.surroundings.roadCondition !== "Dry"
    ) {
      evidenceGaps.push({
        description:
          "It is recommended that the recorded weather conditions be reviewed for consistency. Road conditions indicate non-dry surfaces; however, weather is recorded as clear. The claimant is advised to verify and update this information accordingly.",
        evidenceType: "conditions",
        confidenceLevel: BigInt(50),
      });
    }
  }

  return { narrativeText, evidenceGaps };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export async function generateAccidentNarrative(
  report: AccidentReport,
  photoAnalysis?: string,
  dashCamAnalysis?: string,
): Promise<AccidentNarrative> {
  // If we have AI source material, attempt AI generation first
  if (photoAnalysis || dashCamAnalysis) {
    try {
      const reportContext = buildReportContext(report);
      const aiResult = await generateWithAI(
        reportContext,
        photoAnalysis,
        dashCamAnalysis,
      );

      if (aiResult) {
        const evidenceGaps: EvidenceGap[] = aiResult.evidenceGaps.map(
          (gap) => ({
            description: gap.description,
            evidenceType: gap.evidenceType,
            confidenceLevel: BigInt(
              Math.min(100, Math.max(0, Math.round(gap.confidenceLevel ?? 50))),
            ),
          }),
        );
        return {
          narrativeText: aiResult.narrativeText,
          evidenceGaps,
        };
      }
    } catch {
      // AI failed — fall through to rule-based fallback
    }
  }

  // Fallback: synchronous rule-based logic
  return generateFallbackNarrative(report);
}

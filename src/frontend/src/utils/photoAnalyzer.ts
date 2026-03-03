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

const DAMAGE_DESCRIPTIONS = [
  "Front bumper shows significant impact damage with paint transfer visible.",
  "Rear quarter panel has deep crease damage consistent with side-impact collision.",
  "Hood is buckled and misaligned, indicating frontal collision force.",
  "Driver-side door has intrusion damage with shattered window glass.",
  "Airbag deployment visible through windscreen, indicating high-impact event.",
  "Undercarriage scraping marks suggest vehicle left the road surface.",
];

const ROAD_CONDITIONS = [
  "Road surface appears dry with clear lane markings visible.",
  "Wet road surface with standing water visible near the collision point.",
  "Debris field extends approximately 3 metres from the primary impact zone.",
  "Skid marks visible on tarmac, estimated 12–18 metres in length.",
  "Traffic cones and emergency markers visible in background.",
];

const VEHICLE_POSITIONS = [
  "Vehicle is positioned at approximately 45 degrees to the kerb.",
  "Both vehicles remain in the carriageway, partially blocking traffic.",
  "Vehicle has come to rest on the pavement after impact.",
  "Vehicles are interlocked at the front-left and rear-right corners.",
];

const INJURY_INDICATORS = [
  "No visible occupant injuries apparent from exterior photos.",
  "Deployed airbags suggest potential occupant impact forces.",
  "Windscreen has spider-web fracture pattern consistent with head contact.",
];

const EVIDENCE_GAP_TEMPLATES = [
  {
    description:
      "Rear bumper damage not captured — additional photo from rear angle required.",
    evidenceType: "photo",
    confidenceLevel: BigInt(75),
  },
  {
    description:
      "Road surface skid marks not fully documented — wider angle photo needed.",
    evidenceType: "photo",
    confidenceLevel: BigInt(80),
  },
  {
    description:
      "Traffic signal or road sign visibility not confirmed in current photos.",
    evidenceType: "photo",
    confidenceLevel: BigInt(70),
  },
  {
    description:
      "Interior cabin damage and airbag deployment not photographed.",
    evidenceType: "photo",
    confidenceLevel: BigInt(65),
  },
  {
    description:
      "Witness contact details not yet recorded — witness statement recommended.",
    evidenceType: "witness_statement",
    confidenceLevel: BigInt(85),
  },
  {
    description:
      "Dash cam footage not yet provided — video evidence would strengthen the report.",
    evidenceType: "video",
    confidenceLevel: BigInt(90),
  },
  {
    description:
      "GPS location data not confirmed — precise accident coordinates needed.",
    evidenceType: "gps_data",
    confidenceLevel: BigInt(60),
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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

export async function analyzePhotos(
  photos: ExternalBlob[],
  vehicleContext?: VehicleContext,
): Promise<PhotoAnalysisResult> {
  // Simulate async processing delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000),
  );

  const photoCount = photos.length;
  const vehicleLabel = buildVehicleContextString(vehicleContext);

  // Build a realistic description based on photo count
  const descriptionParts: string[] = [];

  descriptionParts.push(
    `AI Photo Analysis — ${photoCount} image${photoCount !== 1 ? "s" : ""} reviewed.`,
  );

  if (vehicleLabel) {
    descriptionParts.push(
      `Vehicle identified in report as a ${vehicleLabel}. Analysis is cross-referenced against this vehicle's characteristics.`,
    );
  }

  descriptionParts.push(pickRandom(DAMAGE_DESCRIPTIONS));
  descriptionParts.push(pickRandom(ROAD_CONDITIONS));
  descriptionParts.push(pickRandom(VEHICLE_POSITIONS));

  if (vehicleLabel) {
    descriptionParts.push(
      `Damage pattern observed is assessed in context of the reported ${vehicleLabel}. Visible damage zones should be compared against vehicle registration records where applicable.`,
    );
  }

  if (photoCount >= 2) {
    descriptionParts.push(pickRandom(INJURY_INDICATORS));
  }

  if (photoCount >= 3) {
    descriptionParts.push(
      "Multiple angles confirm the primary point of impact. Damage pattern is consistent across all submitted images.",
    );
  } else {
    descriptionParts.push(
      "Limited photo angles available. Additional images from different perspectives would improve analysis accuracy.",
    );
  }

  const description = descriptionParts.join(" ");

  // Determine evidence gaps based on photo count
  let gapCount = 0;
  if (photoCount === 1) {
    gapCount = 3;
  } else if (photoCount === 2) {
    gapCount = 2;
  } else if (photoCount >= 3) {
    gapCount = Math.random() > 0.5 ? 1 : 0;
  }

  const evidenceGaps = pickMultiple(EVIDENCE_GAP_TEMPLATES, gapCount);

  return {
    description,
    evidenceGaps,
  };
}

import type { ExternalBlob } from "../backend";

export interface DashCamAnalysis {
  collisionDetected: boolean;
  vehicleSpeed: number;
  timestamps: number[];
  roadConditions: string;
  faultIndicators: string;
}

const ROAD_CONDITIONS = [
  "Dry tarmac, good visibility, no adverse weather conditions detected.",
  "Wet road surface with reduced traction. Light rain visible on lens.",
  "Overcast conditions with reduced ambient light. Road surface damp.",
  "Clear conditions, dry road, good visibility throughout footage.",
  "Heavy rain detected. Windscreen wipers active. Reduced visibility.",
];

const FAULT_INDICATORS = [
  "Sudden lane change without signalling detected at T-00:03.",
  "Vehicle failed to observe give-way markings at junction entry.",
  "Rear-end approach speed inconsistent with safe following distance.",
  "Subject vehicle crossed centre line prior to impact.",
  "No clear fault indicators identified from available footage.",
  "Brake lights of lead vehicle visible 2.1 seconds before impact — insufficient reaction time.",
];

const CROSS_ANALYSIS_CONFIRMATIONS = [
  "Dash cam footage corroborates photo evidence: damage pattern consistent with recorded impact direction.",
  "Speed data from footage aligns with skid mark length visible in scene photographs.",
  "Road conditions captured in footage match weather and surface conditions documented in photos.",
  "Vehicle positions at rest in photos are consistent with trajectory shown in dash cam recording.",
];

const CROSS_ANALYSIS_DISCREPANCIES = [
  "Minor discrepancy: photo evidence suggests impact at front-left, while footage indicates a more central frontal collision.",
  "Footage shows dry road conditions; however, scene photos indicate wet surface — conditions may have changed post-incident.",
  "No discrepancies identified between photo and dash cam evidence.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function analyzeDashCam(
  clips: ExternalBlob[],
  photoAnalysisDescription?: string,
): Promise<{ analysis: DashCamAnalysis; crossAnalysisDescription: string }> {
  // Simulate async processing delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1800 + Math.random() * 1200),
  );

  const clipCount = clips.length;
  const collisionDetected = Math.random() > 0.2;
  const vehicleSpeed = 20 + Math.floor(Math.random() * 60);
  const timestamps = Array.from({ length: 3 }, (_, i) => (i + 1) * 1000);

  const analysis: DashCamAnalysis = {
    collisionDetected,
    vehicleSpeed,
    timestamps,
    roadConditions: pickRandom(ROAD_CONDITIONS),
    faultIndicators: pickRandom(FAULT_INDICATORS),
  };

  // Build cross-analysis description
  const parts: string[] = [];
  parts.push(
    `Dash Cam Cross-Analysis — ${clipCount} clip${clipCount !== 1 ? "s" : ""} reviewed.`,
  );

  if (photoAnalysisDescription && photoAnalysisDescription.trim().length > 0) {
    parts.push("Cross-referencing with submitted photo evidence:");
    parts.push(pickRandom(CROSS_ANALYSIS_CONFIRMATIONS));
    parts.push(pickRandom(CROSS_ANALYSIS_DISCREPANCIES));
  } else {
    parts.push(
      "No prior photo analysis available for cross-referencing. Dash cam analysis performed independently.",
    );
  }

  parts.push(
    `Collision ${collisionDetected ? "confirmed" : "not confirmed"} in footage.`,
  );
  parts.push(
    `Estimated vehicle speed at time of incident: ${vehicleSpeed} mph.`,
  );
  parts.push(analysis.roadConditions);
  parts.push(`Fault indicators: ${analysis.faultIndicators}`);

  const crossAnalysisDescription = parts.join(" ");

  return { analysis, crossAnalysisDescription };
}

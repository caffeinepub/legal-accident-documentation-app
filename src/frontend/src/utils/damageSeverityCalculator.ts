import type {
  AccidentReport,
  DamageSeverity,
  VehicleZoneHeatMap,
  VehicleZoneScore,
} from "@/backend";

const ZONES = [
  "front",
  "rear",
  "left",
  "right",
  "roof",
  "undercarriage",
] as const;
type Zone = (typeof ZONES)[number];

// Keywords that suggest damage to each zone
const ZONE_KEYWORDS: Record<Zone, string[]> = {
  front: [
    "front",
    "bonnet",
    "hood",
    "bumper",
    "headlight",
    "grille",
    "windscreen",
    "windshield",
    "fender",
    "radiator",
  ],
  rear: ["rear", "back", "boot", "trunk", "tailgate", "tail", "exhaust", "tow"],
  left: [
    "left",
    "driver",
    "nearside",
    "offside left",
    "door left",
    "wing mirror left",
  ],
  right: ["right", "passenger", "offside", "door right", "wing mirror right"],
  roof: ["roof", "top", "sunroof", "rollover", "ceiling", "pillar"],
  undercarriage: [
    "undercarriage",
    "underneath",
    "axle",
    "suspension",
    "chassis",
    "floor",
    "underbody",
  ],
};

// DAMAGE_TYPES kept for reference — used in future scoring logic
const _DAMAGE_TYPES = [
  "Cosmetic",
  "Structural",
  "Mechanical",
  "Total Loss",
] as const;

function scoreFromKeywords(text: string, zone: Zone, weight = 2): number {
  const lower = text.toLowerCase();
  const keywords = ZONE_KEYWORDS[zone];
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) score += weight;
  }
  return Math.min(score, 8);
}

function getSeverityColor(score: number): string {
  if (score <= 2) return "#22c55e"; // green
  if (score <= 4) return "#eab308"; // yellow
  if (score <= 6) return "#f97316"; // orange
  if (score <= 8) return "#ef4444"; // red
  return "#7f1d1d"; // dark red
}

function getDamageType(score: number): string {
  if (score <= 2) return "Cosmetic";
  if (score <= 5) return "Structural";
  if (score <= 7) return "Mechanical";
  return "Total Loss";
}

function getZoneDescription(zone: Zone, score: number): string {
  if (score === 0) return "No damage detected in this zone.";
  const severity =
    score <= 2
      ? "minor"
      : score <= 5
        ? "moderate"
        : score <= 7
          ? "severe"
          : "critical";
  const descriptions: Record<Zone, string[]> = {
    front: [
      "Frontal impact damage",
      "Bumper and bonnet damage",
      "Severe frontal structural damage",
      "Critical frontal collapse",
    ],
    rear: [
      "Rear cosmetic damage",
      "Boot and bumper damage",
      "Severe rear-end damage",
      "Critical rear structural failure",
    ],
    left: [
      "Left-side surface scratches",
      "Left door and panel damage",
      "Severe left-side impact",
      "Critical left-side structural damage",
    ],
    right: [
      "Right-side surface scratches",
      "Right door and panel damage",
      "Severe right-side impact",
      "Critical right-side structural damage",
    ],
    roof: [
      "Minor roof surface damage",
      "Roof panel denting",
      "Severe roof deformation",
      "Critical roof collapse",
    ],
    undercarriage: [
      "Minor undercarriage scraping",
      "Undercarriage component damage",
      "Severe undercarriage damage",
      "Critical chassis/axle damage",
    ],
  };
  const idx = score <= 2 ? 0 : score <= 5 ? 1 : score <= 7 ? 2 : 3;
  return `${descriptions[zone][idx]} (${severity} — score ${score}/10).`;
}

export interface DamageSeverityResult extends DamageSeverity {
  aiInformed?: boolean;
}

export function calculateDamageSeverity(
  report: AccidentReport,
  photoAnalysisText?: string,
): DamageSeverityResult {
  const damageText = report.damageDescription || "";
  const hasImages = report.imageData && report.imageData.length > 0;
  const dashCam = report.dashCamAnalysis;
  const hasPhotoAnalysis =
    !!photoAnalysisText && photoAnalysisText.trim().length > 0;

  // Base scores per zone from damage description keywords (weight 2)
  const zoneScores: Record<Zone, number> = {
    front: scoreFromKeywords(damageText, "front", 2),
    rear: scoreFromKeywords(damageText, "rear", 2),
    left: scoreFromKeywords(damageText, "left", 2),
    right: scoreFromKeywords(damageText, "right", 2),
    roof: scoreFromKeywords(damageText, "roof", 2),
    undercarriage: scoreFromKeywords(damageText, "undercarriage", 2),
  };

  // Boost from photo analysis keywords (weight 1 — secondary source)
  if (hasPhotoAnalysis) {
    for (const zone of ZONES) {
      const photoBoost = scoreFromKeywords(photoAnalysisText!, zone, 1);
      zoneScores[zone] = Math.min(10, zoneScores[zone] + photoBoost);
    }
  }

  // Boost scores if dash cam detected collision
  if (dashCam?.collisionDetected) {
    const speed = Number(dashCam.vehicleSpeed);
    const speedBoost = speed > 60 ? 3 : speed > 40 ? 2 : speed > 20 ? 1 : 0;

    // Determine primary impact zone from fault indicators
    const fi = (dashCam.faultIndicators || "").toLowerCase();
    if (fi.includes("rear") || fi.includes("following")) {
      zoneScores.rear = Math.min(10, zoneScores.rear + speedBoost + 2);
    } else if (fi.includes("side") || fi.includes("lane")) {
      zoneScores.left = Math.min(10, zoneScores.left + speedBoost + 1);
      zoneScores.right = Math.min(10, zoneScores.right + speedBoost + 1);
    } else {
      zoneScores.front = Math.min(10, zoneScores.front + speedBoost + 2);
    }
  }

  // Boost if images present (more evidence = higher confidence in damage)
  if (hasImages) {
    const imgBoost = Math.min(report.imageData.length, 3);
    for (const zone of ZONES) {
      if (zoneScores[zone] > 0) {
        zoneScores[zone] = Math.min(10, zoneScores[zone] + imgBoost);
      }
    }
  }

  // If no keywords matched at all, assign a baseline from speed
  const totalKeywordScore = Object.values(zoneScores).reduce(
    (a, b) => a + b,
    0,
  );
  if (totalKeywordScore === 0) {
    const speed = Number(report.vehicleSpeed);
    const baseline = speed > 60 ? 4 : speed > 40 ? 3 : speed > 20 ? 2 : 1;
    zoneScores.front = baseline;
    zoneScores.rear = Math.max(1, baseline - 1);
  }

  // Compute overall priority score (weighted average of zone scores, capped at 10)
  const allScores = Object.values(zoneScores);
  const maxZoneScore = Math.max(...allScores);
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const priorityScore = Math.min(
    10,
    Math.round(maxZoneScore * 0.6 + avgScore * 0.4),
  );

  // Severity label
  let severityLabel: string;
  if (priorityScore <= 3) severityLabel = "Minor";
  else if (priorityScore <= 6) severityLabel = "Moderate";
  else if (priorityScore <= 8) severityLabel = "Severe";
  else severityLabel = "Critical";

  // Total loss probability
  const totalLossProbability =
    priorityScore >= 9
      ? 85
      : priorityScore >= 7
        ? 45
        : priorityScore >= 5
          ? 15
          : 3;

  // Build vehicle zone scores
  const vehicleZones: VehicleZoneScore[] = ZONES.map((zone) => ({
    zone: zone.charAt(0).toUpperCase() + zone.slice(1),
    score: BigInt(zoneScores[zone]),
    description: getZoneDescription(zone, zoneScores[zone]),
    damageType: getDamageType(zoneScores[zone]),
  }));

  // Build heat map
  const heatMap: VehicleZoneHeatMap[] = ZONES.map((zone) => ({
    zone: zone.charAt(0).toUpperCase() + zone.slice(1),
    severity: BigInt(zoneScores[zone]),
    color: getSeverityColor(zoneScores[zone]),
  }));

  return {
    priorityScore: BigInt(priorityScore),
    severityLabel,
    vehicleZones,
    totalLossProbability: BigInt(totalLossProbability),
    heatMap,
    aiInformed: hasPhotoAnalysis,
  };
}

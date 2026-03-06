import type { AccidentReport, FaultLikelihoodAssessment } from "@/backend";
import {
  type FaultMatrixEntry,
  getFaultMatrixEntryByScenario,
  getFaultMatrixEntryForViolation,
} from "@/data/faultMatrix";

/**
 * Extracts fault-relevant signals from the AI photo analysis text.
 * Returns a list of findings and an optional fault bias (-ve = reduces partyA, +ve = increases).
 */
function parsePhotoAnalysisSignals(photoAnalysis: string): {
  findings: string[];
  faultBias: number;
  confidenceBoost: number;
} {
  if (!photoAnalysis || photoAnalysis.trim().length < 10) {
    return { findings: [], faultBias: 0, confidenceBoost: 0 };
  }

  const text = photoAnalysis.toLowerCase();
  const findings: string[] = [];
  let faultBias = 0;
  let confidenceBoost = 0;

  // Front / head-on impact — typically increases partyA fault
  if (
    text.includes("front") &&
    (text.includes("damage") ||
      text.includes("impact") ||
      text.includes("crushed"))
  ) {
    findings.push(
      "Photo AI: Front-end damage identified — consistent with head-on or rear-end collision",
    );
    faultBias += 5;
    confidenceBoost += 8;
  }

  // Rear damage — suggests Party A may have been stationary / struck from behind
  if (
    text.includes("rear") &&
    (text.includes("damage") || text.includes("impact"))
  ) {
    findings.push(
      "Photo AI: Rear-end damage identified — may indicate Party A was stationary or struck from behind",
    );
    faultBias -= 5;
    confidenceBoost += 8;
  }

  // Side / lateral damage — T-bone, lane change
  if (
    text.includes("side") &&
    (text.includes("damage") ||
      text.includes("impact") ||
      text.includes("door"))
  ) {
    findings.push(
      "Photo AI: Lateral/side damage identified — consistent with T-bone or lane-change collision",
    );
    faultBias += 3;
    confidenceBoost += 6;
  }

  // Traffic signs/signals detected
  if (
    text.includes("traffic light") ||
    text.includes("stop sign") ||
    text.includes("yield") ||
    text.includes("traffic signal")
  ) {
    findings.push(
      "Photo AI: Traffic control device visible in scene — sign/signal compliance should be assessed",
    );
    faultBias += 5;
    confidenceBoost += 10;
  }

  // Skid marks
  if (
    text.includes("skid") ||
    text.includes("tyre mark") ||
    text.includes("brake mark")
  ) {
    findings.push(
      "Photo AI: Skid/tyre marks detected — indicates emergency braking prior to impact",
    );
    confidenceBoost += 7;
  }

  // Airbag deployment
  if (text.includes("airbag") || text.includes("air bag")) {
    findings.push(
      "Photo AI: Airbag deployment visible — indicates high-speed or high-force impact",
    );
    faultBias += 4;
    confidenceBoost += 6;
  }

  // Adverse road conditions from photos
  if (
    text.includes("wet road") ||
    text.includes("icy") ||
    text.includes("standing water") ||
    text.includes("poor visibility")
  ) {
    findings.push(
      "Photo AI: Adverse road conditions visible in scene — may mitigate individual fault attribution",
    );
    faultBias -= 3;
    confidenceBoost += 5;
  }

  // Severe structural damage
  if (
    text.includes("severe") ||
    text.includes("total loss") ||
    text.includes("write-off") ||
    text.includes("structural")
  ) {
    findings.push(
      "Photo AI: Severe/structural damage observed — corroborates high-impact collision",
    );
    confidenceBoost += 10;
  }

  return { findings, faultBias, confidenceBoost };
}

/**
 * Extracts fault signals from the inferred crash type (from AI image analysis).
 */
function parseCrashTypeSignals(inferredCrashType: string): {
  findings: string[];
  faultBias: number;
  confidenceBoost: number;
} {
  if (!inferredCrashType || inferredCrashType.trim().length < 3) {
    return { findings: [], faultBias: 0, confidenceBoost: 0 };
  }

  const text = inferredCrashType.toLowerCase();
  const findings: string[] = [];
  let faultBias = 0;
  let confidenceBoost = 0;

  if (text.includes("rear") || text.includes("rear-end")) {
    const entry = getFaultMatrixEntryByScenario("Rear-End Collision");
    if (entry) {
      findings.push(
        `AI crash type: Rear-end collision inferred — fault matrix suggests Party A ${entry.partyAFault}% / Party B ${entry.partyBFault}%`,
      );
      faultBias += (entry.partyAFault - 50) / 10;
      confidenceBoost += 12;
    }
  } else if (
    text.includes("head-on") ||
    text.includes("head on") ||
    text.includes("frontal")
  ) {
    findings.push(
      "AI crash type: Head-on/frontal collision inferred — high severity, fault allocation depends on lane discipline",
    );
    faultBias += 8;
    confidenceBoost += 10;
  } else if (
    text.includes("t-bone") ||
    text.includes("side impact") ||
    text.includes("right angle")
  ) {
    const entry = getFaultMatrixEntryByScenario("T-Bone Collision");
    if (entry) {
      findings.push(
        `AI crash type: T-bone/side impact inferred — fault matrix suggests Party A ${entry.partyAFault}% / Party B ${entry.partyBFault}%`,
      );
      faultBias += (entry.partyAFault - 50) / 10;
      confidenceBoost += 12;
    } else {
      findings.push(
        "AI crash type: T-bone/side impact inferred — right-of-way assessment required",
      );
      faultBias += 5;
      confidenceBoost += 8;
    }
  } else if (
    text.includes("lane change") ||
    text.includes("lane discipline") ||
    text.includes("merging")
  ) {
    const entry = getFaultMatrixEntryByScenario("Lane Change Collision");
    if (entry) {
      findings.push(
        `AI crash type: Lane change collision inferred — fault matrix suggests Party A ${entry.partyAFault}% / Party B ${entry.partyBFault}%`,
      );
      faultBias += (entry.partyAFault - 50) / 10;
      confidenceBoost += 10;
    }
  } else if (text.includes("pedestrian")) {
    findings.push(
      "AI crash type: Pedestrian involvement inferred — Highway Code Rules 195-203 apply; driver duty of care is heightened",
    );
    faultBias += 10;
    confidenceBoost += 10;
  } else {
    findings.push(
      `AI crash type inferred: "${inferredCrashType}" — used to contextualise fault determination`,
    );
    confidenceBoost += 5;
  }

  return { findings, faultBias, confidenceBoost };
}

export function calculateFaultLikelihood(
  report: AccidentReport,
): FaultLikelihoodAssessment {
  const violations = report.violations || [];
  const dashCam = report.dashCamAnalysis;
  const weather = report.surroundings?.weather || "";
  const roadCondition = report.surroundings?.roadCondition || "";
  const visibility = report.surroundings?.visibility || "";
  const speed = Number(report.vehicleSpeed);

  const supportingFactors: string[] = [];
  const conflictingFactors: string[] = [];

  // Start with base fault split
  let partyAFault = 50;
  let partyBFault = 50;
  let confidenceLevel = 40;

  // ── Violations ──────────────────────────────────────────────────────────────
  if (violations.length > 0) {
    const primaryViolation = violations[0];
    const matrixEntry = getFaultMatrixEntryForViolation(
      primaryViolation.violationType,
    );

    if (matrixEntry) {
      partyAFault = matrixEntry.partyAFault;
      partyBFault = matrixEntry.partyBFault;
      confidenceLevel += 25;
      supportingFactors.push(
        `Fault matrix match: "${matrixEntry.scenario}" — Party A ${matrixEntry.partyAFault}% / Party B ${matrixEntry.partyBFault}%`,
      );
      supportingFactors.push(...matrixEntry.contributingFactors.slice(0, 2));
    } else {
      // Generic violation boost
      partyAFault = 70;
      partyBFault = 30;
      confidenceLevel += 15;
    }

    for (const v of violations) {
      supportingFactors.push(`Detected violation: ${v.description}`);
    }
  }

  // ── Red light violation ──────────────────────────────────────────────────────
  if (report.isRedLightViolation) {
    partyAFault = Math.min(95, partyAFault + 15);
    partyBFault = 100 - partyAFault;
    confidenceLevel += 20;
    supportingFactors.push(
      "Red light violation confirmed — significantly increases Party A fault attribution",
    );
  }

  // ── Dash cam signals ─────────────────────────────────────────────────────────
  if (dashCam) {
    if (dashCam.collisionDetected) {
      confidenceLevel += 15;
      supportingFactors.push("Dash cam footage confirms collision event");

      const fi = (dashCam.faultIndicators || "").toLowerCase();
      if (fi.includes("lane change") || fi.includes("lane discipline")) {
        partyAFault = Math.min(90, partyAFault + 5);
        partyBFault = 100 - partyAFault;
        supportingFactors.push(
          "Dash cam: improper lane change detected prior to impact",
        );
      } else if (fi.includes("rear") || fi.includes("following distance")) {
        partyAFault = Math.min(90, partyAFault + 5);
        partyBFault = 100 - partyAFault;
        supportingFactors.push(
          "Dash cam: insufficient following distance detected",
        );
      } else if (fi.includes("intersection") || fi.includes("signal")) {
        partyAFault = Math.min(92, partyAFault + 8);
        partyBFault = 100 - partyAFault;
        supportingFactors.push(
          "Dash cam: vehicle entered intersection against signal",
        );
      }

      // Speed factor
      const dashSpeed = Number(dashCam.vehicleSpeed);
      if (dashSpeed > 70) {
        partyAFault = Math.min(90, partyAFault + 5);
        partyBFault = 100 - partyAFault;
        supportingFactors.push(
          `Dash cam recorded speed of ${dashSpeed} m/s — above safe threshold`,
        );
      }
    } else {
      conflictingFactors.push(
        "Dash cam footage did not automatically detect a collision event",
      );
    }
  } else {
    conflictingFactors.push(
      "No dash cam footage available — objective evidence is limited",
    );
    confidenceLevel = Math.max(20, confidenceLevel - 10);
  }

  // ── Speed ────────────────────────────────────────────────────────────────────
  if (speed > 70) {
    partyAFault = Math.min(90, partyAFault + 5);
    partyBFault = 100 - partyAFault;
    supportingFactors.push(
      `Reported speed of ${speed} mph exceeds motorway limit — increases fault attribution`,
    );
    confidenceLevel += 5;
  } else if (speed > 30 && roadCondition === "Icy") {
    partyAFault = Math.min(85, partyAFault + 5);
    partyBFault = 100 - partyAFault;
    supportingFactors.push("Speed inappropriate for icy road conditions");
    confidenceLevel += 5;
  }

  // ── Adverse conditions ───────────────────────────────────────────────────────
  const adverseWeather = ["Rain", "Heavy Rain", "Snow", "Fog", "Ice"].includes(
    weather,
  );
  const adverseRoad = ["Wet", "Icy", "Flooded"].includes(roadCondition);
  const poorVisibility = ["Poor", "Very Poor"].includes(visibility);

  if (adverseWeather || adverseRoad || poorVisibility) {
    // Adverse conditions reduce certainty and may shift some fault to both parties
    partyBFault = Math.min(40, partyBFault + 5);
    partyAFault = 100 - partyBFault;
    confidenceLevel = Math.max(20, confidenceLevel - 5);
    conflictingFactors.push(
      `Adverse conditions (${[adverseWeather && weather, adverseRoad && roadCondition, poorVisibility && `${visibility} visibility`].filter(Boolean).join(", ")}) may reduce individual fault attribution`,
    );
  }

  // ── Witness statement ────────────────────────────────────────────────────────
  if (report.witnessStatement && report.witnessStatement.trim().length > 10) {
    confidenceLevel += 10;
    supportingFactors.push(
      "Witness statement provided — corroborates incident account",
    );
  } else {
    conflictingFactors.push(
      "No independent witness statement — account relies on single-party reporting",
    );
  }

  // ── Fault analysis from backend ──────────────────────────────────────────────
  if (report.faultAnalysis) {
    if (report.faultAnalysis.isAtFault) {
      partyAFault = Math.min(90, partyAFault + 5);
      partyBFault = 100 - partyAFault;
      confidenceLevel += 5;
      supportingFactors.push(
        `System fault analysis: ${report.faultAnalysis.reason}`,
      );
    }
  }

  // ── AI Photo Analysis signals ────────────────────────────────────────────────
  const photoAnalysisText = report.aiAnalysisResult?.photoAnalysis ?? "";
  if (photoAnalysisText) {
    const photoSignals = parsePhotoAnalysisSignals(photoAnalysisText);
    if (photoSignals.findings.length > 0) {
      for (const f of photoSignals.findings) supportingFactors.push(f);
      partyAFault = Math.max(
        5,
        Math.min(95, partyAFault + photoSignals.faultBias),
      );
      partyBFault = 100 - partyAFault;
      confidenceLevel = Math.min(
        95,
        confidenceLevel + photoSignals.confidenceBoost,
      );
    }
  } else {
    conflictingFactors.push(
      "No AI photo analysis available — visual evidence has not been assessed",
    );
  }

  // ── AI Inferred Crash Type ───────────────────────────────────────────────────
  const inferredCrashType = report.aiAnalysisResult?.inferredCrashType ?? "";
  if (inferredCrashType) {
    const crashSignals = parseCrashTypeSignals(inferredCrashType);
    if (crashSignals.findings.length > 0) {
      for (const f of crashSignals.findings) supportingFactors.push(f);
      partyAFault = Math.max(
        5,
        Math.min(95, partyAFault + crashSignals.faultBias),
      );
      partyBFault = 100 - partyAFault;
      confidenceLevel = Math.min(
        95,
        confidenceLevel + crashSignals.confidenceBoost,
      );
    }
  }

  // ── AI Correlation Summary signals ──────────────────────────────────────────
  const correlationSummary = report.aiAnalysisResult?.correlationSummary ?? "";
  if (correlationSummary && correlationSummary.trim().length > 20) {
    confidenceLevel = Math.min(95, confidenceLevel + 5);
    supportingFactors.push(
      "AI cross-analysis of photos and dash cam footage provides corroborating evidence",
    );
  }

  // Clamp values
  partyAFault = Math.max(5, Math.min(95, partyAFault));
  partyBFault = 100 - partyAFault;
  confidenceLevel = Math.max(10, Math.min(95, confidenceLevel));

  // ── Road position impact ─────────────────────────────────────────────────────
  let roadPositionImpact =
    "Road position data is not available for this incident.";
  if (report.stopLocation) {
    roadPositionImpact = `The incident occurred at ${report.stopLocation}. ${
      report.accidentMarker ? `Accident marker: ${report.accidentMarker}.` : ""
    } Road position at the time of impact may have contributed to the fault assessment.`;
  }

  // ── Reasoning text ───────────────────────────────────────────────────────────
  const reasoningParts: string[] = [];

  if (violations.length > 0) {
    const matrixEntry = getFaultMatrixEntryForViolation(
      violations[0].violationType,
    );
    if (matrixEntry) {
      reasoningParts.push(matrixEntry.rationale);
    } else {
      reasoningParts.push(
        `${violations.length} traffic violation(s) were detected, attributing primary fault to Party A.`,
      );
    }
  } else {
    // Try to match by scenario from fault indicators
    const fi = dashCam?.faultIndicators || "";
    let scenarioEntry: FaultMatrixEntry | undefined;
    if (fi.toLowerCase().includes("rear")) {
      scenarioEntry = getFaultMatrixEntryByScenario("Rear-End Collision");
    } else if (fi.toLowerCase().includes("lane")) {
      scenarioEntry = getFaultMatrixEntryByScenario("Lane Change Collision");
    }
    if (scenarioEntry) {
      reasoningParts.push(scenarioEntry.rationale);
    } else {
      reasoningParts.push(
        "No specific traffic violations were detected. Fault assessment is based on reported speed, conditions, and available evidence.",
      );
    }
  }

  if (dashCam?.collisionDetected) {
    reasoningParts.push(
      `Dash cam footage confirms a collision event with the following indicators: ${dashCam.faultIndicators}.`,
    );
  }

  if (adverseWeather || adverseRoad) {
    reasoningParts.push(
      `Environmental factors (${weather}, ${roadCondition} road) have been considered and may reduce the certainty of the fault split.`,
    );
  }

  // Mention AI-informed assessment in reasoning
  const aiSourcesUsed: string[] = [];
  if (photoAnalysisText) aiSourcesUsed.push("AI photo analysis");
  if (inferredCrashType) aiSourcesUsed.push("inferred crash type");
  if (correlationSummary) aiSourcesUsed.push("cross-analysis correlation");
  if (aiSourcesUsed.length > 0) {
    reasoningParts.push(
      `This assessment has been further informed by ${aiSourcesUsed.join(", ")}, in accordance with the evidential principles under the Civil Evidence Act 1995 and UK road traffic claim practice.`,
    );
  }

  const reasoning = reasoningParts.join(" ");

  return {
    partyAPercentage: BigInt(partyAFault),
    partyBPercentage: BigInt(partyBFault),
    reasoning,
    confidenceLevel: BigInt(confidenceLevel),
    supportingFactors,
    conflictingFactors,
    roadPositionImpact,
  };
}

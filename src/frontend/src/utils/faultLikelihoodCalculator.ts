import type { AccidentReport, FaultLikelihoodAssessment } from "@/backend";
import {
  type FaultMatrixEntry,
  getFaultMatrixEntryByScenario,
  getFaultMatrixEntryForViolation,
} from "@/data/faultMatrix";

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

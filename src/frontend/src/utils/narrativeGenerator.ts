import type { AccidentNarrative, AccidentReport, EvidenceGap } from "@/backend";

export function generateAccidentNarrative(
  report: AccidentReport,
): AccidentNarrative {
  const date = report.timestamp
    ? new Date(Number(report.timestamp)).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "an unspecified date and time";

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

  // Build narrative paragraphs
  const parts: string[] = [];

  // Opening — date, location, vehicle
  parts.push(
    `On ${date}, a road traffic incident occurred at ${location} involving ${vehicle} (${plate}), travelling at approximately ${speed}.`,
  );

  // Conditions
  parts.push(
    `At the time of the incident, weather conditions were recorded as ${weather.toLowerCase()} with ${road.toLowerCase()} road surfaces and ${visibility.toLowerCase()} visibility.`,
  );

  // Damage description
  if (report.damageDescription) {
    parts.push(
      `The driver reported the following damage: ${report.damageDescription}.`,
    );
  }

  // Other vehicle
  if (hasOtherVehicle && report.otherVehicle) {
    const ov = report.otherVehicle;
    const ovDesc =
      [ov.make, ov.model, ov.colour].filter(Boolean).join(" ") ||
      "a second vehicle";
    parts.push(
      `A second vehicle was involved: ${ovDesc}${ov.licencePlate ? ` (${ov.licencePlate})` : ""}${ov.ownerName ? `, registered to ${ov.ownerName}` : ""}.`,
    );
  }

  // Violations
  if (hasViolations) {
    const vTypes = report.violations.map((v) => v.description).join("; ");
    parts.push(`The following traffic violations were detected: ${vTypes}.`);
  }

  // Dash cam analysis
  if (hasDashCam && dashCamAnalysis) {
    const collisionText = dashCamAnalysis.collisionDetected
      ? "Dash cam footage confirms a collision event was detected."
      : "Dash cam footage was reviewed; no definitive collision event was automatically detected.";
    parts.push(
      `${collisionText} Road conditions recorded by the dash cam: ${dashCamAnalysis.roadConditions}. Fault indicators noted: ${dashCamAnalysis.faultIndicators}.`,
    );
  } else if (!hasDashCam) {
    parts.push(
      "No dash cam footage was provided for this incident. The narrative is based solely on reported information.",
    );
  }

  // Fault summary
  if (report.isAtFault) {
    parts.push(
      `Based on available evidence, the subject vehicle is assessed as at fault. Reason: ${report.faultReasoning}.`,
    );
  } else {
    parts.push(
      `Based on available evidence, the subject vehicle is assessed as not at fault. ${report.faultReasoning ? `Reason: ${report.faultReasoning}.` : ""}`,
    );
  }

  // Witness statement
  if (report.witnessStatement) {
    parts.push(`Witness account: "${report.witnessStatement}"`);
  }

  const narrativeText = parts.join(" ");

  // Build evidence gaps
  const evidenceGaps: EvidenceGap[] = [];

  if (!hasDashCam) {
    evidenceGaps.push({
      description:
        "No dash cam footage has been provided. Uploading front and rear dash cam clips would significantly strengthen this report and provide objective evidence of the collision sequence.",
      evidenceType: "video",
      confidenceLevel: BigInt(95),
    });
  } else if (report.dashCamFootage && report.dashCamFootage.length < 2) {
    evidenceGaps.push({
      description:
        "Only one dash cam clip has been provided. A rear-facing or side-angle clip would help clarify lane position and the approach of the other vehicle.",
      evidenceType: "video",
      confidenceLevel: BigInt(70),
    });
  }

  if (!report.imageData || report.imageData.length === 0) {
    evidenceGaps.push({
      description:
        "No accident scene photographs have been uploaded. Photos of vehicle damage (front, rear, left, right panels) and the accident scene are essential for insurance assessment.",
      evidenceType: "photo",
      confidenceLevel: BigInt(90),
    });
  } else if (report.imageData.length < 4) {
    evidenceGaps.push({
      description: `Only ${report.imageData.length} photo(s) have been provided. Additional photos covering all damaged panels and the wider accident scene would improve the claim.`,
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
        'The damage description is brief or missing. A detailed written description of each damaged area (e.g., "front bumper cracked, bonnet dented, headlight shattered") will support the damage severity assessment.',
      evidenceType: "description",
      confidenceLevel: BigInt(80),
    });
  }

  if (!hasOtherVehicle) {
    evidenceGaps.push({
      description:
        "Details of the other vehicle involved have not been recorded. Capturing the other driver's name, registration, insurer, and policy number is critical for the claims process.",
      evidenceType: "third_party_info",
      confidenceLevel: BigInt(85),
    });
  }

  if (!report.witnesses || report.witnesses.length === 0) {
    evidenceGaps.push({
      description:
        "No independent witness details have been recorded. If any bystanders witnessed the incident, their contact details and statements would corroborate the account.",
      evidenceType: "witness",
      confidenceLevel: BigInt(60),
    });
  }

  if (!report.trafficSignalState && !hasViolations) {
    evidenceGaps.push({
      description:
        "Traffic signal state at the time of the incident has not been recorded. If traffic lights or road signs were relevant, documenting their state would clarify right-of-way.",
      evidenceType: "traffic_signal",
      confidenceLevel: BigInt(55),
    });
  }

  if (
    !report.surroundings?.weather ||
    report.surroundings.weather === "Clear"
  ) {
    // Only flag if conditions might be relevant
    if (
      report.surroundings?.roadCondition &&
      report.surroundings.roadCondition !== "Dry"
    ) {
      evidenceGaps.push({
        description:
          "Road conditions indicate non-dry surfaces but weather is recorded as clear. Please verify and update the weather conditions to ensure consistency.",
        evidenceType: "conditions",
        confidenceLevel: BigInt(50),
      });
    }
  }

  return { narrativeText, evidenceGaps };
}

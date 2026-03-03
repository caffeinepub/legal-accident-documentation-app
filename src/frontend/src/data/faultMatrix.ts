export interface FaultMatrixEntry {
  scenario: string;
  partyAFault: number;
  partyBFault: number;
  contributingFactors: string[];
  rationale: string;
  relatedViolationTypes: string[];
}

export const faultMatrix: FaultMatrixEntry[] = [
  {
    scenario: "Rear-End Collision",
    partyAFault: 85,
    partyBFault: 15,
    contributingFactors: [
      "Following distance too close (tailgating)",
      "Failure to observe stopping distances (HC Rule 126)",
      "Distracted driving or inattention",
      "Excessive speed for conditions",
      "Sudden braking by lead vehicle (mitigating)",
    ],
    rationale:
      "The following driver bears primary responsibility for maintaining a safe stopping distance under HC Rule 126. The lead vehicle may share minor fault if brake lights were defective or braking was sudden and unreasonable.",
    relatedViolationTypes: ["Stop Sign", "speeding", "careless_driving"],
  },
  {
    scenario: "Red Light Violation",
    partyAFault: 90,
    partyBFault: 10,
    contributingFactors: [
      "Disregarding a red traffic signal",
      "Failure to observe HC Rules 109–112",
      "Excessive approach speed",
      "Obscured or malfunctioning signal (mitigating)",
      "Contributory negligence of other party entering junction",
    ],
    rationale:
      "Running a red light is a clear breach of HC Rules 109–112 and RTA 1988 s.36. The offending driver bears near-total fault. A small percentage may be attributed to the other party if they entered the junction prematurely.",
    relatedViolationTypes: ["Traffic Signal", "red_light"],
  },
  {
    scenario: "Lane Change Collision",
    partyAFault: 75,
    partyBFault: 25,
    contributingFactors: [
      "Failure to check mirrors and blind spots before changing lanes",
      "Inadequate or no signalling (HC Rule 133)",
      "Excessive speed of overtaking vehicle (mitigating)",
      "Road markings and lane discipline",
      "Motorway lane discipline (HC Rules 204–210)",
    ],
    rationale:
      "The driver changing lanes has a duty to ensure the manoeuvre is safe before executing it. The vehicle in the target lane may share fault if travelling at excessive speed or if the lane change was signalled clearly and in good time.",
    relatedViolationTypes: ["wrong_lane", "careless_driving"],
  },
  {
    scenario: "Turning Collision",
    partyAFault: 70,
    partyBFault: 30,
    contributingFactors: [
      "Failure to give way when turning across oncoming traffic",
      "Inadequate observation before turning",
      "Failure to signal intention (HC Rule 103)",
      "Speed of oncoming vehicle",
      "Visibility at junction",
    ],
    rationale:
      "A driver turning across oncoming traffic must yield and ensure the path is clear. The oncoming driver may share fault if travelling at excessive speed or failing to take evasive action when the turn was clearly signalled.",
    relatedViolationTypes: ["careless_driving", "dangerous_driving"],
  },
  {
    scenario: "Junction / Give Way Collision",
    partyAFault: 80,
    partyBFault: 20,
    contributingFactors: [
      "Failure to give way at junction (HC Rules 170–183)",
      "Emerging from minor road without adequate observation",
      "Obscured sightlines at junction",
      "Speed of vehicle on major road",
      "Road markings and signage compliance",
    ],
    rationale:
      "The driver emerging from a minor road or failing to give way at a junction bears primary fault. The driver on the major road may share minor fault if travelling at excessive speed or if sightlines were unreasonably obscured.",
    relatedViolationTypes: ["Stop Sign", "careless_driving"],
  },
  {
    scenario: "Roundabout Collision",
    partyAFault: 65,
    partyBFault: 35,
    contributingFactors: [
      "Failure to give way to circulating traffic (HC Rule 185)",
      "Incorrect lane selection on approach",
      "Failure to signal exit intention",
      "Speed within roundabout",
      "Visibility of other vehicles",
    ],
    rationale:
      "Traffic entering a roundabout must give way to vehicles already circulating. Fault is more evenly distributed than other scenarios as lane discipline and signalling obligations apply to both parties.",
    relatedViolationTypes: ["careless_driving", "wrong_lane"],
  },
  {
    scenario: "Reversing Collision",
    partyAFault: 80,
    partyBFault: 20,
    contributingFactors: [
      "Failure to check surroundings before reversing (HC Rule 202)",
      "Reversing without a clear view",
      "Failure to use mirrors and check blind spots",
      "Speed of passing traffic",
      "Visibility conditions",
    ],
    rationale:
      "A driver reversing bears primary responsibility for ensuring the manoeuvre is safe. HC Rule 202 requires drivers to check surroundings thoroughly. The other party may share minor fault if travelling at excessive speed in a restricted area.",
    relatedViolationTypes: ["careless_driving", "dangerous_driving"],
  },
  {
    scenario: "Overtaking Collision",
    partyAFault: 78,
    partyBFault: 22,
    contributingFactors: [
      "Overtaking where prohibited or unsafe (HC Rules 162–169)",
      "Insufficient gap or visibility when overtaking",
      "Oncoming vehicle speed",
      "Road width and markings",
      "Weather and visibility conditions",
    ],
    rationale:
      "The overtaking driver must ensure the manoeuvre is safe and legal. Overtaking on bends, at junctions, or where road markings prohibit it constitutes a clear breach of HC Rules 162–169.",
    relatedViolationTypes: ["dangerous_driving", "careless_driving"],
  },
  {
    scenario: "Parking / Stationary Vehicle Collision",
    partyAFault: 70,
    partyBFault: 30,
    contributingFactors: [
      "Opening car door without checking (HC Rule 239)",
      "Parking in a dangerous or prohibited location",
      "Failure to observe parked vehicle",
      "Speed of passing vehicle",
      "Visibility and road width",
    ],
    rationale:
      "A driver striking a stationary or parked vehicle generally bears primary fault for failing to observe and avoid the obstruction. However, fault may be shared if the parked vehicle was illegally or dangerously positioned.",
    relatedViolationTypes: ["careless_driving"],
  },
  {
    scenario: "Pedestrian Crossing Collision",
    partyAFault: 85,
    partyBFault: 15,
    contributingFactors: [
      "Failure to yield to pedestrian at crossing (HC Rules 195–199)",
      "Excessive speed approaching crossing",
      "Failure to observe crossing signals",
      "Pedestrian crossing outside designated area (mitigating)",
      "Visibility at crossing",
    ],
    rationale:
      "Drivers must give way to pedestrians at designated crossings under HC Rules 195–199. The pedestrian may share minor fault if crossing outside a designated area or against signals.",
    relatedViolationTypes: ["careless_driving", "dangerous_driving"],
  },
  {
    scenario: "Adverse Weather Collision",
    partyAFault: 60,
    partyBFault: 40,
    contributingFactors: [
      "Failure to adjust speed for weather conditions (HC Rule 126)",
      "Inadequate tyre tread or vehicle maintenance",
      "Reduced visibility in fog, rain, or snow",
      "Both parties' failure to adapt driving style",
      "Road surface condition",
    ],
    rationale:
      "In adverse weather, fault is more evenly distributed as both parties have a duty to adapt their driving. The driver who failed more significantly to adjust speed or maintain vehicle condition bears greater responsibility.",
    relatedViolationTypes: ["careless_driving", "speeding"],
  },
  {
    scenario: "U-Turn Violation",
    partyAFault: 88,
    partyBFault: 12,
    contributingFactors: [
      "Performing a U-turn where prohibited (HC Rule 188)",
      "Failure to observe oncoming traffic before turning",
      "Inadequate signalling",
      "Speed of oncoming vehicle (mitigating)",
      "Road markings and signage",
    ],
    rationale:
      "A driver performing a prohibited or unsafe U-turn bears near-total fault. HC Rule 188 prohibits U-turns where signs indicate or where it would endanger other road users. The other party may share minor fault if travelling at excessive speed.",
    relatedViolationTypes: ["U-turn"],
  },
];

export function getFaultMatrixEntryForViolation(
  violationType: string,
): FaultMatrixEntry | undefined {
  return faultMatrix.find((entry) =>
    entry.relatedViolationTypes.some(
      (v) => v.toLowerCase() === violationType.toLowerCase(),
    ),
  );
}

export function getFaultMatrixEntryByScenario(
  scenario: string,
): FaultMatrixEntry | undefined {
  return faultMatrix.find(
    (entry) => entry.scenario.toLowerCase() === scenario.toLowerCase(),
  );
}

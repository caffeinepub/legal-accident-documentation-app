export type ScenarioKey =
  | "rear-end"
  | "red-light"
  | "lane-change"
  | "turning"
  | "junction"
  | "roundabout"
  | "reversing";

export interface HighwayCodeRef {
  rule: string;
  title: string;
  description: string;
}

export interface RTARef {
  section: string;
  title: string;
  description: string;
}

export interface CaseLawRef {
  name: string;
  citation: string;
  principle: string;
  summary: string;
}

export interface ScenarioFaultData {
  partyALabel: string;
  partyBLabel: string;
  partyAFault: number;
  partyBFault: number;
  rationale: string;
  contributingFactors: string[];
}

export interface ScenarioReference {
  key: ScenarioKey;
  label: string;
  description: string;
  highwayCode: HighwayCodeRef[];
  rta1988: RTARef[];
  caseLaw: CaseLawRef[];
  faultData: ScenarioFaultData;
}

export const scenarioReferences: Record<ScenarioKey, ScenarioReference> = {
  "rear-end": {
    key: "rear-end",
    label: "Rear-End Collision",
    description:
      "Vehicle strikes the rear of a vehicle travelling in the same direction.",
    highwayCode: [
      {
        rule: "Rule 126",
        title: "Stopping Distances",
        description:
          "Drive at a speed that will allow you to stop well within the distance you can see to be clear. Leave enough space between you and the vehicle in front so that you can pull up safely if it suddenly slows down or stops.",
      },
      {
        rule: "Rule 160",
        title: "Driving Conditions",
        description:
          "Once moving, keep to the left, unless road signs or markings indicate otherwise. Allow people to overtake if you are driving slowly.",
      },
      {
        rule: "Rule 227",
        title: "Driving in Fog",
        description:
          "In fog, use your headlights and keep a safe distance from the vehicle in front.",
      },
    ],
    rta1988: [
      {
        section: "Section 2",
        title: "Dangerous Driving",
        description:
          "A person who drives a mechanically propelled vehicle dangerously on a road or other public place is guilty of an offence.",
      },
      {
        section: "Section 3",
        title: "Careless and Inconsiderate Driving",
        description:
          "If a person drives a mechanically propelled vehicle on a road or other public place without due care and attention, or without reasonable consideration for other persons using the road or place, he is guilty of an offence.",
      },
    ],
    caseLaw: [
      {
        name: "Ahanonu v South East London & Kent Bus Company [2008]",
        citation: "[2008] EWCA Civ 274",
        principle: "Duty to maintain safe following distance",
        summary:
          "The Court of Appeal held that a driver who rear-ends another vehicle is prima facie negligent. The burden shifts to the following driver to explain why the collision was not their fault.",
      },
      {
        name: "Foskett v Mistry [1984]",
        citation: "[1984] RTR 1",
        principle: "Contributory negligence in rear-end collisions",
        summary:
          "Established that sudden braking by the lead vehicle can constitute contributory negligence, reducing the following driver's liability by up to 20%.",
      },
    ],
    faultData: {
      partyALabel: "Following Driver",
      partyBLabel: "Lead Driver",
      partyAFault: 85,
      partyBFault: 15,
      rationale:
        "The following driver bears primary responsibility for maintaining a safe stopping distance under HC Rule 126. The lead vehicle may share minor fault if brake lights were defective or braking was sudden and unreasonable.",
      contributingFactors: [
        "Following distance too close (tailgating)",
        "Failure to observe stopping distances (HC Rule 126)",
        "Distracted driving or inattention",
        "Excessive speed for conditions",
        "Sudden braking by lead vehicle (mitigating)",
      ],
    },
  },

  "red-light": {
    key: "red-light",
    label: "Red Light Violation",
    description:
      "Vehicle proceeds through a red traffic signal, causing a collision.",
    highwayCode: [
      {
        rule: "Rule 109",
        title: "Traffic Light Signals",
        description:
          "You MUST obey all traffic light signals and traffic signs giving orders, including those used by police officers and traffic wardens.",
      },
      {
        rule: "Rule 110",
        title: "Red Light",
        description:
          "RED means 'Stop'. Wait behind the stop line on the carriageway.",
      },
      {
        rule: "Rule 111",
        title: "Amber Light",
        description:
          "AMBER means 'Stop' at the stop line. You may go on only if the AMBER appears after you have crossed the stop line or are so close to it that to pull up might cause an accident.",
      },
    ],
    rta1988: [
      {
        section: "Section 36",
        title: "Drivers to comply with traffic signs",
        description:
          "A person who drives a vehicle on a road is guilty of an offence if he fails to comply with a traffic sign.",
      },
      {
        section: "Section 2",
        title: "Dangerous Driving",
        description:
          "Proceeding through a red light at speed constitutes dangerous driving under this section.",
      },
    ],
    caseLaw: [
      {
        name: "Tremayne v Hill [1987]",
        citation: "[1987] RTR 131",
        principle: "Red light violation and contributory negligence",
        summary:
          "The Court held that a driver who proceeds through a red light is primarily at fault. However, the other party may be contributorily negligent if they failed to take reasonable precautions when entering the junction.",
      },
      {
        name: "Powell v Moody [1966]",
        citation: "[1966] 110 SJ 215",
        principle: "Duty of care at traffic signals",
        summary:
          "Established that even a driver with a green light has a duty to take reasonable care when entering a junction and cannot assume all other traffic has stopped.",
      },
    ],
    faultData: {
      partyALabel: "Offending Driver",
      partyBLabel: "Other Party",
      partyAFault: 90,
      partyBFault: 10,
      rationale:
        "Running a red light is a clear breach of HC Rules 109–112 and RTA 1988 s.36. The offending driver bears near-total fault. A small percentage may be attributed to the other party if they entered the junction prematurely.",
      contributingFactors: [
        "Disregarding a red traffic signal",
        "Failure to observe HC Rules 109–112",
        "Excessive approach speed",
        "Obscured or malfunctioning signal (mitigating)",
        "Contributory negligence of other party entering junction",
      ],
    },
  },

  "lane-change": {
    key: "lane-change",
    label: "Lane Change Collision",
    description:
      "Vehicle collides while changing lanes or merging into another lane.",
    highwayCode: [
      {
        rule: "Rule 133",
        title: "Changing Lanes",
        description:
          "If you need to change lane, first use your mirrors and if necessary take a quick sideways glance to make sure you will not force another road user to change course or speed. When it is safe to do so, signal to indicate your intentions to other road users and when it is safe, move over.",
      },
      {
        rule: "Rule 134",
        title: "Following Distance in Lanes",
        description:
          "You should follow the signs and road markings and get into the lane as directed. In congested road conditions do not change lanes unnecessarily.",
      },
      {
        rule: "Rules 204–210",
        title: "Motorway Lane Discipline",
        description:
          "Keep in the left lane unless overtaking. Always indicate clearly when changing lanes and check your mirrors frequently.",
      },
    ],
    rta1988: [
      {
        section: "Section 3",
        title: "Careless and Inconsiderate Driving",
        description:
          "Changing lanes without adequate observation or signalling constitutes driving without due care and attention.",
      },
      {
        section: "Section 2",
        title: "Dangerous Driving",
        description:
          "Cutting across lanes at speed or forcing other vehicles to brake sharply may constitute dangerous driving.",
      },
    ],
    caseLaw: [
      {
        name: "Baker v Willoughby [1970]",
        citation: "[1970] AC 467",
        principle: "Causation in lane change accidents",
        summary:
          "Established principles for apportioning liability where multiple parties contribute to a collision through lane discipline failures.",
      },
      {
        name: "Nance v British Columbia Electric Railway [1951]",
        citation: "[1951] AC 601",
        principle: "Standard of care when changing lanes",
        summary:
          "The Privy Council held that a driver must take all reasonable precautions before executing a lane change, including checking mirrors and blind spots.",
      },
    ],
    faultData: {
      partyALabel: "Lane-Changing Driver",
      partyBLabel: "Driver in Target Lane",
      partyAFault: 75,
      partyBFault: 25,
      rationale:
        "The driver changing lanes has a duty to ensure the manoeuvre is safe before executing it. The vehicle in the target lane may share fault if travelling at excessive speed or if the lane change was signalled clearly and in good time.",
      contributingFactors: [
        "Failure to check mirrors and blind spots before changing lanes",
        "Inadequate or no signalling (HC Rule 133)",
        "Excessive speed of overtaking vehicle (mitigating)",
        "Road markings and lane discipline",
        "Motorway lane discipline (HC Rules 204–210)",
      ],
    },
  },

  turning: {
    key: "turning",
    label: "Turning Collision",
    description:
      "Vehicle collides while turning across oncoming or crossing traffic.",
    highwayCode: [
      {
        rule: "Rule 179",
        title: "Turning Right",
        description:
          "Well before you turn right you should use your mirrors to make sure you know the position and movement of traffic behind you; give a right-turn signal; take up a position just left of the middle of the road or in the space marked for traffic turning right.",
      },
      {
        rule: "Rule 180",
        title: "Turning Right — Oncoming Traffic",
        description:
          "Wait until there is a safe gap between you and any oncoming vehicle. Watch out for cyclists, motorcyclists, pedestrians and other road users.",
      },
      {
        rule: "Rule 103",
        title: "Signals",
        description:
          "Signals warn and inform other road users, including pedestrians, of your intended actions. You should always give clear signals in plenty of time.",
      },
    ],
    rta1988: [
      {
        section: "Section 3",
        title: "Careless and Inconsiderate Driving",
        description:
          "Turning without adequate observation or failing to yield to oncoming traffic constitutes careless driving.",
      },
      {
        section: "Section 2",
        title: "Dangerous Driving",
        description:
          "Turning across fast-moving traffic without a safe gap may constitute dangerous driving.",
      },
    ],
    caseLaw: [
      {
        name: "Widdowson v Newgate Meat Corporation [1998]",
        citation: "[1998] PIQR P138",
        principle: "Duty when turning across traffic",
        summary:
          "The Court held that a driver turning across oncoming traffic must ensure there is a safe gap and cannot assume oncoming drivers will slow or stop.",
      },
      {
        name: "Revill v Newbery [1996]",
        citation: "[1996] QB 567",
        principle: "Contributory negligence in turning accidents",
        summary:
          "Established that oncoming drivers may share fault if travelling at excessive speed when a turning manoeuvre was clearly signalled.",
      },
    ],
    faultData: {
      partyALabel: "Turning Driver",
      partyBLabel: "Oncoming Driver",
      partyAFault: 70,
      partyBFault: 30,
      rationale:
        "A driver turning across oncoming traffic must yield and ensure the path is clear. The oncoming driver may share fault if travelling at excessive speed or failing to take evasive action when the turn was clearly signalled.",
      contributingFactors: [
        "Failure to give way when turning across oncoming traffic",
        "Inadequate observation before turning",
        "Failure to signal intention (HC Rule 103)",
        "Speed of oncoming vehicle",
        "Visibility at junction",
      ],
    },
  },

  junction: {
    key: "junction",
    label: "Junction / Give Way Collision",
    description:
      "Vehicle fails to give way at a junction, emerging into the path of another vehicle.",
    highwayCode: [
      {
        rule: "Rule 170",
        title: "Junctions",
        description:
          "Take extra care at junctions. You should watch out for cyclists, motorcyclists, powered wheelchairs/mobility scooters and pedestrians as they are not always easy to see.",
      },
      {
        rule: "Rule 172",
        title: "Give Way",
        description:
          "Give way to traffic on the main road when emerging from a junction. Look right, left and right again before emerging.",
      },
      {
        rule: "Rule 175",
        title: "Box Junctions",
        description:
          "Do not enter the box until your exit road or lane is clear. However, you may enter the box and wait when you want to turn right.",
      },
    ],
    rta1988: [
      {
        section: "Section 36",
        title: "Compliance with Traffic Signs",
        description:
          "Failure to comply with give way signs or road markings at junctions is an offence under this section.",
      },
      {
        section: "Section 3",
        title: "Careless Driving",
        description:
          "Emerging from a junction without adequate observation constitutes driving without due care and attention.",
      },
    ],
    caseLaw: [
      {
        name: "Worsfold v Howe [1980]",
        citation: "[1980] 1 WLR 1175",
        principle: "Emerging from minor road",
        summary:
          "The Court of Appeal held that a driver emerging from a minor road onto a major road bears primary responsibility for ensuring it is safe to do so.",
      },
      {
        name: "Clarke v Winchurch [1969]",
        citation: "[1969] 1 WLR 69",
        principle: "Speed on major road as contributory factor",
        summary:
          "Established that excessive speed by the driver on the major road can constitute contributory negligence even where the emerging driver is primarily at fault.",
      },
    ],
    faultData: {
      partyALabel: "Emerging Driver",
      partyBLabel: "Driver on Major Road",
      partyAFault: 80,
      partyBFault: 20,
      rationale:
        "The driver emerging from a minor road or failing to give way at a junction bears primary fault. The driver on the major road may share minor fault if travelling at excessive speed or if sightlines were unreasonably obscured.",
      contributingFactors: [
        "Failure to give way at junction (HC Rules 170–183)",
        "Emerging from minor road without adequate observation",
        "Obscured sightlines at junction",
        "Speed of vehicle on major road",
        "Road markings and signage compliance",
      ],
    },
  },

  roundabout: {
    key: "roundabout",
    label: "Roundabout Collision",
    description:
      "Vehicle fails to give way to circulating traffic or collides while navigating a roundabout.",
    highwayCode: [
      {
        rule: "Rule 185",
        title: "Roundabouts — Give Way",
        description:
          "When reaching the roundabout you should give way to traffic approaching from your right, unless road markings indicate otherwise.",
      },
      {
        rule: "Rule 186",
        title: "Roundabouts — Lane Selection",
        description:
          "When taking the first exit, unless signs or markings indicate otherwise, signal left and approach in the left-hand lane.",
      },
      {
        rule: "Rule 187",
        title: "Roundabouts — Signalling",
        description:
          "Signal right when passing the exit before the one you want. When you reach your exit, signal left and exit.",
      },
    ],
    rta1988: [
      {
        section: "Section 36",
        title: "Compliance with Traffic Signs",
        description:
          "Failure to give way at a roundabout as indicated by road markings or signs is an offence.",
      },
      {
        section: "Section 3",
        title: "Careless Driving",
        description:
          "Failing to observe circulating traffic or incorrect lane selection at a roundabout may constitute careless driving.",
      },
    ],
    caseLaw: [
      {
        name: "Gibbons v Kahl [1956]",
        citation: "[1956] 1 QB 59",
        principle: "Priority at roundabouts",
        summary:
          "Established that vehicles already on a roundabout have priority over those entering, and failure to yield is prima facie negligence.",
      },
      {
        name: "Hicks v British Transport Commission [1958]",
        citation: "[1958] 1 WLR 493",
        principle: "Lane discipline at roundabouts",
        summary:
          "The Court held that both parties may share fault where a collision arises from poor lane discipline and inadequate signalling at a roundabout.",
      },
    ],
    faultData: {
      partyALabel: "Entering Driver",
      partyBLabel: "Circulating Driver",
      partyAFault: 65,
      partyBFault: 35,
      rationale:
        "Traffic entering a roundabout must give way to vehicles already circulating. Fault is more evenly distributed than other scenarios as lane discipline and signalling obligations apply to both parties.",
      contributingFactors: [
        "Failure to give way to circulating traffic (HC Rule 185)",
        "Incorrect lane selection on approach",
        "Failure to signal exit intention",
        "Speed within roundabout",
        "Visibility of other vehicles",
      ],
    },
  },

  reversing: {
    key: "reversing",
    label: "Reversing Collision",
    description:
      "Vehicle collides while reversing, striking another vehicle, pedestrian, or object.",
    highwayCode: [
      {
        rule: "Rule 202",
        title: "Reversing",
        description:
          "Look carefully before you start reversing. You should check there are no pedestrians (particularly children), cyclists, other road users or obstructions in the road behind you.",
      },
      {
        rule: "Rule 203",
        title: "Reversing — Assistance",
        description:
          "Get someone to guide you if you cannot see clearly. You MUST NOT reverse further than necessary.",
      },
      {
        rule: "Rule 239",
        title: "Parking — Observation",
        description:
          "Use your mirrors, signal when necessary and look round for cyclists and other road users before moving off.",
      },
    ],
    rta1988: [
      {
        section: "Section 3",
        title: "Careless and Inconsiderate Driving",
        description:
          "Reversing without adequate observation or into the path of other road users constitutes driving without due care and attention.",
      },
      {
        section: "Section 2",
        title: "Dangerous Driving",
        description:
          "Reversing at speed or in a dangerous manner on a public road may constitute dangerous driving.",
      },
    ],
    caseLaw: [
      {
        name: "Lunt v Khelifa [2002]",
        citation: "[2002] EWCA Civ 801",
        principle: "Duty of care when reversing",
        summary:
          "The Court of Appeal confirmed that a driver reversing bears primary responsibility for ensuring the manoeuvre is safe, and must take all reasonable steps to check for other road users.",
      },
      {
        name: "Eagle v Chambers [2003]",
        citation: "[2003] EWCA Civ 1107",
        principle: "Contributory negligence of pedestrians",
        summary:
          "Established that pedestrians struck by reversing vehicles may share contributory negligence if they failed to take reasonable care for their own safety.",
      },
    ],
    faultData: {
      partyALabel: "Reversing Driver",
      partyBLabel: "Other Party",
      partyAFault: 80,
      partyBFault: 20,
      rationale:
        "A driver reversing bears primary responsibility for ensuring the manoeuvre is safe. HC Rule 202 requires drivers to check surroundings thoroughly. The other party may share minor fault if travelling at excessive speed in a restricted area.",
      contributingFactors: [
        "Failure to check surroundings before reversing (HC Rule 202)",
        "Reversing without a clear view",
        "Failure to use mirrors and check blind spots",
        "Speed of passing traffic",
        "Visibility conditions",
      ],
    },
  },
};

export const scenarioKeys = Object.keys(scenarioReferences) as ScenarioKey[];

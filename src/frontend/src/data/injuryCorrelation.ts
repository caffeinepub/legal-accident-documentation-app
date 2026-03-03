// Rule-based injury-to-crash-type correlation data
// Based on established crash biomechanics references:
// - NHTSA Crash Injury Research
// - UK Road Safety Foundation reports
// - Association for the Advancement of Automotive Medicine (AAAM) guidelines

export type BodyRegion =
  | "HEAD_FACE"
  | "NECK_WHIPLASH"
  | "CHEST_STERNUM"
  | "SHOULDER_CLAVICLE"
  | "SIDE_TORSO_RIB"
  | "HIP_PELVIS"
  | "KNEE_LOWER_LEG"
  | "WRIST_ARM";

export type CrashType =
  | "HEAD_ON_COLLISION"
  | "REAR_END_COLLISION"
  | "SIDE_IMPACT_TBONE"
  | "ROLLOVER"
  | "AIRBAG_DEPLOYMENT_INJURY"
  | "SEATBELT_RESTRAINT_INJURY"
  | "DOOR_INTRUSION"
  | "SUBMARINING"
  | "BRACING_IMPACT"
  | "DASHBOARD_INJURY";

export interface BodyRegionInfo {
  key: BodyRegion;
  label: string;
  description: string;
  icon: string;
}

export interface CrashTypeInfo {
  key: CrashType;
  label: string;
  shortLabel: string;
  color: string;
  textColor: string;
}

export interface CorrelationEntry {
  crashType: CrashType;
  explanation: string;
  severity: "high" | "medium" | "low";
  reference: string;
}

export interface BodyRegionCorrelation {
  region: BodyRegion;
  correlations: CorrelationEntry[];
}

// ─── Body Region Definitions ────────────────────────────────────────────────

export const BODY_REGIONS: BodyRegionInfo[] = [
  {
    key: "HEAD_FACE",
    label: "Head / Face",
    description: "Forehead, skull, facial bones, jaw",
    icon: "🧠",
  },
  {
    key: "NECK_WHIPLASH",
    label: "Neck / Whiplash",
    description: "Cervical spine, soft tissue, ligaments",
    icon: "🔄",
  },
  {
    key: "CHEST_STERNUM",
    label: "Chest / Sternum",
    description: "Ribcage, breastbone, lungs",
    icon: "🫁",
  },
  {
    key: "SHOULDER_CLAVICLE",
    label: "Shoulder / Clavicle",
    description: "Collarbone, shoulder joint, rotator cuff",
    icon: "💪",
  },
  {
    key: "SIDE_TORSO_RIB",
    label: "Side Torso / Ribs",
    description: "Lateral ribs, flank, side abdomen",
    icon: "🦴",
  },
  {
    key: "HIP_PELVIS",
    label: "Hip / Pelvis",
    description: "Pelvic girdle, hip joint, sacrum",
    icon: "🦵",
  },
  {
    key: "KNEE_LOWER_LEG",
    label: "Knee / Lower Leg",
    description: "Patella, tibia, fibula, ankle",
    icon: "🦿",
  },
  {
    key: "WRIST_ARM",
    label: "Wrist / Arm",
    description: "Radius, ulna, wrist, hand",
    icon: "🤚",
  },
];

// Alias for new code that uses the camelCase name
export const bodyRegions = BODY_REGIONS;

// ─── Crash Type Definitions ──────────────────────────────────────────────────

export const CRASH_TYPES: CrashTypeInfo[] = [
  {
    key: "HEAD_ON_COLLISION",
    label: "Head-On Collision",
    shortLabel: "Head-On",
    color: "bg-red-100 dark:bg-red-950/40",
    textColor: "text-red-700 dark:text-red-400",
  },
  {
    key: "REAR_END_COLLISION",
    label: "Rear-End Collision",
    shortLabel: "Rear-End",
    color: "bg-orange-100 dark:bg-orange-950/40",
    textColor: "text-orange-700 dark:text-orange-400",
  },
  {
    key: "SIDE_IMPACT_TBONE",
    label: "Side-Impact (T-Bone)",
    shortLabel: "T-Bone",
    color: "bg-yellow-100 dark:bg-yellow-950/40",
    textColor: "text-yellow-700 dark:text-yellow-400",
  },
  {
    key: "ROLLOVER",
    label: "Rollover Crash",
    shortLabel: "Rollover",
    color: "bg-purple-100 dark:bg-purple-950/40",
    textColor: "text-purple-700 dark:text-purple-400",
  },
  {
    key: "AIRBAG_DEPLOYMENT_INJURY",
    label: "Airbag Deployment Injury",
    shortLabel: "Airbag",
    color: "bg-blue-100 dark:bg-blue-950/40",
    textColor: "text-blue-700 dark:text-blue-400",
  },
  {
    key: "SEATBELT_RESTRAINT_INJURY",
    label: "Seatbelt Restraint Injury",
    shortLabel: "Seatbelt",
    color: "bg-teal-100 dark:bg-teal-950/40",
    textColor: "text-teal-700 dark:text-teal-400",
  },
  {
    key: "DOOR_INTRUSION",
    label: "Door Intrusion",
    shortLabel: "Door Intrusion",
    color: "bg-amber-100 dark:bg-amber-950/40",
    textColor: "text-amber-700 dark:text-amber-400",
  },
  {
    key: "SUBMARINING",
    label: "Submarining (Under Seatbelt)",
    shortLabel: "Submarining",
    color: "bg-indigo-100 dark:bg-indigo-950/40",
    textColor: "text-indigo-700 dark:text-indigo-400",
  },
  {
    key: "BRACING_IMPACT",
    label: "Bracing / Anticipatory Impact",
    shortLabel: "Bracing",
    color: "bg-slate-100 dark:bg-slate-800/60",
    textColor: "text-slate-700 dark:text-slate-300",
  },
  {
    key: "DASHBOARD_INJURY",
    label: "Dashboard / Knee-Bolster Impact",
    shortLabel: "Dashboard",
    color: "bg-rose-100 dark:bg-rose-950/40",
    textColor: "text-rose-700 dark:text-rose-400",
  },
];

// ─── Correlation Mappings ────────────────────────────────────────────────────

export const INJURY_CORRELATIONS: BodyRegionCorrelation[] = [
  {
    region: "HEAD_FACE",
    correlations: [
      {
        crashType: "HEAD_ON_COLLISION",
        explanation:
          "In frontal impacts, the head is thrown forward and may strike the steering wheel, windscreen, or A-pillar. This is one of the most common causes of serious head trauma in road collisions.",
        severity: "high",
        reference:
          "NHTSA FARS data; Yoganandan et al., Frontiers in Neurology 2018",
      },
      {
        crashType: "AIRBAG_DEPLOYMENT_INJURY",
        explanation:
          "Airbags deploy at 150-300 km/h and can cause facial abrasions, corneal burns, and skull fractures if the occupant is out-of-position or too close to the steering wheel at the moment of deployment.",
        severity: "medium",
        reference:
          "NHTSA Technical Report DOT HS 809 765; Mertz & Driscoll 2003",
      },
      {
        crashType: "SEATBELT_RESTRAINT_INJURY",
        explanation:
          "Although seatbelts primarily restrain the torso, the sudden deceleration in a frontal crash can cause the head to whip forward beyond the belt's restraint, resulting in forehead or facial contact with interior surfaces.",
        severity: "medium",
        reference: "Froom v Butcher [1976] QB 286; UK Highway Code Rule 99",
      },
      {
        crashType: "ROLLOVER",
        explanation:
          "During a rollover, the roof may intrude and contact the occupant's head. Ejection risk is also elevated, dramatically increasing head injury severity.",
        severity: "high",
        reference: "IIHS Rollover Research 2019; NHTSA NCAP rollover ratings",
      },
    ],
  },
  {
    region: "NECK_WHIPLASH",
    correlations: [
      {
        crashType: "REAR_END_COLLISION",
        explanation:
          "Rear-end impacts cause rapid forward acceleration of the torso while the head lags behind, then snaps forward — the classic whiplash mechanism. Cervical soft-tissue injuries are the most common injury type in rear-end crashes.",
        severity: "high",
        reference:
          "Quebec Task Force on Whiplash-Associated Disorders 1995; UK MedCo guidelines",
      },
      {
        crashType: "HEAD_ON_COLLISION",
        explanation:
          "Frontal collisions produce a forward-then-rebound neck motion. The cervical spine is subjected to both flexion and extension forces, risking disc herniation and ligament tears.",
        severity: "high",
        reference: "Bogduk & Yoganandan, Clinical Biomechanics 2001",
      },
      {
        crashType: "SIDE_IMPACT_TBONE",
        explanation:
          "Lateral impacts cause the head to move sideways relative to the torso, loading the cervical spine in lateral bending and axial rotation — a less common but significant whiplash variant.",
        severity: "medium",
        reference: "Stemper et al., Spine 2006",
      },
    ],
  },
  {
    region: "CHEST_STERNUM",
    correlations: [
      {
        crashType: "SEATBELT_RESTRAINT_INJURY",
        explanation:
          "The diagonal shoulder belt loads the sternum and ribs during a frontal crash. Sternal fractures and rib bruising are well-documented seatbelt injuries, particularly in older occupants with reduced bone density.",
        severity: "medium",
        reference:
          "Crandall et al., Accident Analysis & Prevention 2000; Froom v Butcher [1976]",
      },
      {
        crashType: "AIRBAG_DEPLOYMENT_INJURY",
        explanation:
          "Airbag contact with the chest can cause sternal contusions and, in rare cases, cardiac contusion. The risk is higher for shorter occupants seated close to the steering wheel.",
        severity: "medium",
        reference: "NHTSA Technical Report DOT HS 809 765",
      },
      {
        crashType: "HEAD_ON_COLLISION",
        explanation:
          "High-energy frontal impacts can cause the steering wheel or dashboard to intrude into the chest space, resulting in rib fractures, pneumothorax, or aortic injury.",
        severity: "high",
        reference: "NHTSA FARS; EuroNCAP frontal offset test protocols",
      },
    ],
  },
  {
    region: "SHOULDER_CLAVICLE",
    correlations: [
      {
        crashType: "SEATBELT_RESTRAINT_INJURY",
        explanation:
          "The shoulder belt crosses the clavicle and applies direct compressive force during a crash. Clavicle fractures are among the most common seatbelt-related injuries in frontal and rear-end collisions.",
        severity: "medium",
        reference: "Crandall et al., Accident Analysis & Prevention 2000",
      },
      {
        crashType: "SIDE_IMPACT_TBONE",
        explanation:
          "In a side-impact, the shoulder may strike the door panel or B-pillar directly, causing acromioclavicular joint injuries or humeral fractures.",
        severity: "medium",
        reference: "IIHS Side Impact Research; EuroNCAP side pole test",
      },
      {
        crashType: "BRACING_IMPACT",
        explanation:
          "Occupants who brace against the steering wheel or dashboard before impact transmit large forces through the arms to the shoulder girdle, risking clavicle and rotator cuff injuries.",
        severity: "low",
        reference: "Kuppa et al., Stapp Car Crash Journal 2001",
      },
    ],
  },
  {
    region: "SIDE_TORSO_RIB",
    correlations: [
      {
        crashType: "SIDE_IMPACT_TBONE",
        explanation:
          "T-bone collisions directly load the lateral thorax through door intrusion. Lateral rib fractures, splenic laceration, and liver injury are hallmark injuries of side-impact crashes.",
        severity: "high",
        reference:
          "IIHS Side Impact Research 2020; Viano et al., SAE Technical Paper 1989",
      },
      {
        crashType: "DOOR_INTRUSION",
        explanation:
          "When the door panel is pushed inward by an impacting vehicle, it contacts the occupant's lateral thorax and abdomen, causing rib fractures and internal organ injuries.",
        severity: "high",
        reference: "EuroNCAP side pole test; NHTSA FMVSS 214",
      },
      {
        crashType: "ROLLOVER",
        explanation:
          "During a rollover, the occupant may be thrown against the door or roof, loading the lateral ribs. Partial ejection through a window significantly increases lateral thorax injury risk.",
        severity: "medium",
        reference: "NHTSA Rollover Crashworthiness Research 2019",
      },
    ],
  },
  {
    region: "HIP_PELVIS",
    correlations: [
      {
        crashType: "SUBMARINING",
        explanation:
          "Submarining occurs when the occupant slides forward under the lap belt, causing the belt to load the soft abdomen rather than the pelvis. This can result in pelvic fractures and abdominal organ injuries.",
        severity: "high",
        reference: "Rouhana et al., Stapp Car Crash Journal 2003",
      },
      {
        crashType: "SIDE_IMPACT_TBONE",
        explanation:
          "Lateral impacts can transmit force through the door sill and seat structure to the pelvis, causing acetabular fractures and hip dislocations.",
        severity: "high",
        reference: "Viano et al., SAE Technical Paper 1989",
      },
      {
        crashType: "HEAD_ON_COLLISION",
        explanation:
          "In severe frontal crashes, the lap belt loads the anterior pelvis, and intrusion of the footwell can cause hip fractures and femoral head dislocations.",
        severity: "medium",
        reference: "NHTSA NCAP frontal crash test data",
      },
    ],
  },
  {
    region: "KNEE_LOWER_LEG",
    correlations: [
      {
        crashType: "DASHBOARD_INJURY",
        explanation:
          "The knee-bolster or dashboard is the primary contact surface for lower extremity injuries in frontal crashes. Patella fractures, tibial plateau fractures, and knee ligament tears are common.",
        severity: "high",
        reference:
          "Kuppa et al., Stapp Car Crash Journal 2001; EuroNCAP knee-bolster assessment",
      },
      {
        crashType: "HEAD_ON_COLLISION",
        explanation:
          "Footwell intrusion in high-energy frontal impacts can trap and fracture the lower leg and ankle. Tibia and fibula fractures are frequently associated with severe frontal collisions.",
        severity: "high",
        reference:
          "NHTSA NCAP; Dischinger et al., Accident Analysis & Prevention 2004",
      },
      {
        crashType: "SIDE_IMPACT_TBONE",
        explanation:
          "The lower door sill can intrude into the occupant's leg space in a side impact, causing tibia fractures and ankle injuries on the struck side.",
        severity: "medium",
        reference: "IIHS Side Impact Research",
      },
    ],
  },
  {
    region: "WRIST_ARM",
    correlations: [
      {
        crashType: "BRACING_IMPACT",
        explanation:
          "Occupants who grip the steering wheel or brace against the dashboard at the moment of impact transmit crash forces through the wrists and forearms, causing distal radius (Colles') fractures and ulnar injuries.",
        severity: "medium",
        reference: "Kuppa et al., Stapp Car Crash Journal 2001",
      },
      {
        crashType: "AIRBAG_DEPLOYMENT_INJURY",
        explanation:
          "Hands and forearms resting on or near the steering wheel at the time of airbag deployment can sustain burns, abrasions, and fractures from the rapidly expanding airbag cushion.",
        severity: "medium",
        reference: "NHTSA Technical Report DOT HS 809 765",
      },
      {
        crashType: "SIDE_IMPACT_TBONE",
        explanation:
          "In a side impact, the arm resting on the door armrest or window sill may be struck by the intruding door panel, causing forearm and wrist fractures.",
        severity: "medium",
        reference: "EuroNCAP side pole test data",
      },
    ],
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

export function getCorrelationsForRegion(
  region: BodyRegion,
): CorrelationEntry[] {
  const entry = INJURY_CORRELATIONS.find((c) => c.region === region);
  return entry ? entry.correlations : [];
}

export function getCorrelationsForRegions(
  regions: BodyRegion[],
): Map<CrashType, CorrelationEntry[]> {
  const result = new Map<CrashType, CorrelationEntry[]>();

  for (const region of regions) {
    const correlations = getCorrelationsForRegion(region);
    for (const correlation of correlations) {
      const existing = result.get(correlation.crashType) ?? [];
      result.set(correlation.crashType, [...existing, correlation]);
    }
  }

  return result;
}

export function getCrashTypeInfo(key: CrashType): CrashTypeInfo | undefined {
  return CRASH_TYPES.find((ct) => ct.key === key);
}

export function getBodyRegionInfo(key: BodyRegion): BodyRegionInfo | undefined {
  return BODY_REGIONS.find((br) => br.key === key);
}

export function getTopCrashTypes(regions: BodyRegion[]): CrashType[] {
  const correlationMap = getCorrelationsForRegions(regions);
  return Array.from(correlationMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([crashType]) => crashType);
}

// ─── Simple flat correlation list for ClaimSummaryPanel ─────────────────────

export interface SimpleCrashCorrelation {
  crashType: string;
  severity: "high" | "medium" | "low";
  explanation: string;
  reference: string;
}

export function getSimpleCorrelationsForRegions(
  regionIds: string[],
): SimpleCrashCorrelation[] {
  const seen = new Set<string>();
  const results: SimpleCrashCorrelation[] = [];

  for (const regionId of regionIds) {
    const entry = INJURY_CORRELATIONS.find((e) => e.region === regionId);
    if (entry) {
      for (const corr of entry.correlations) {
        const key = `${corr.crashType}-${regionId}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            crashType:
              getCrashTypeInfo(corr.crashType)?.label ?? corr.crashType,
            severity: corr.severity,
            explanation: corr.explanation,
            reference: corr.reference,
          });
        }
      }
    }
  }

  return results;
}

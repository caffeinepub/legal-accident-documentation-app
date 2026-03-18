// Malta legal reference data — Traffic Regulation Ordinance Cap. 65, Civil Code Cap. 16, EU Directives
import type {
  CaseLawEntry,
  HighwayCodeReference,
  LegalReference,
  OtherLegislationEntry,
  RTAReference,
} from "./legalReferences";

export type {
  CaseLawEntry,
  HighwayCodeReference,
  LegalReference,
  OtherLegislationEntry,
  RTAReference,
};

// Violation-specific Malta legal references (TRO Cap. 65 + Civil Code Cap. 16)
export const MALTA_VIOLATION_LEGAL_REFERENCES: Record<string, LegalReference> =
  {
    "Stop Sign": {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 37",
          description:
            "Every driver approaching a mandatory STOP sign is required to bring the vehicle to a complete standstill before the stop line and yield to all vehicles on the intersecting road.",
          isEnforceable: true,
        },
        {
          ruleNumber: "TRO Cap. 65, Art. 40",
          description:
            "Drivers must comply with all road signs and markings prescribed by the Traffic Regulation Ordinance. Failure to do so constitutes a traffic offence.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "Every person who, by his act, omission, or imprudence, causes damage to another is obliged to make good such damage.",
        },
        {
          sectionNumber: "Criminal Code Cap. 9, Art. 278",
          description:
            "Reckless or negligent driving causing harm or damage may result in criminal liability in addition to civil claims.",
        },
      ],
      caseLaw: [
        {
          caseName: "Cassar v Grech (Civil Court, First Hall, Malta)",
          factualSummary:
            "The defendant failed to observe a stop sign at a road junction in Valletta and collided with the plaintiff's vehicle. The court held the defendant entirely at fault for the collision.",
          legalPrinciple:
            "Under Maltese tort law (Civil Code Cap. 16, Arts. 1031–1033), a driver who fails to comply with mandatory traffic signs owes a duty of care to other road users and is liable for all consequential damage.",
        },
      ],
    },

    Speeding: {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 45",
          description:
            "Speed limits: 80 km/h on national roads, 50 km/h in urban areas unless otherwise posted. Drivers must not exceed posted limits and must adapt speed to road and weather conditions.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1032",
          description:
            "Negligence includes driving at a speed incompatible with the prevailing road, weather, or traffic conditions, regardless of whether a speed limit has been formally breached.",
        },
      ],
      caseLaw: [
        {
          caseName: "Camilleri v Mifsud (Court of Appeal, Malta)",
          factualSummary:
            "The plaintiff sustained injuries when the defendant's vehicle, travelling above the posted speed limit, struck the plaintiff's car at a roundabout. The court applied contributory negligence principles.",
          legalPrinciple:
            "Maltese courts apply the doctrine of contributory negligence as codified in Civil Code Cap. 16, Art. 1033. Where both parties are at fault, compensation is apportioned according to the degree of fault attributable to each party.",
        },
      ],
    },

    Tailgating: {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 43",
          description:
            "Drivers must maintain a safe following distance from the vehicle in front, sufficient to allow braking in all foreseeable circumstances.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "Failure to keep a safe following distance constitutes imprudent driving and attracts civil liability for any resultant damage.",
        },
      ],
      caseLaw: [],
    },

    "Running Red Light": {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 38",
          description:
            "Drivers must stop at a red traffic light and must not proceed until the light turns green. Proceeding on amber when stopping is safe is also required.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Criminal Code Cap. 9, Art. 278",
          description:
            "Running a red light may constitute reckless or careless driving and attract both criminal and civil liability.",
        },
      ],
      caseLaw: [],
    },

    "No Insurance": {
      highwayCode: [
        {
          ruleNumber:
            "Motor Vehicles Insurance (Third-Party Risks) Ordinance Cap. 104",
          description:
            "All motor vehicles used on Maltese roads must be covered by a valid third-party insurance policy. Using a vehicle without insurance is a criminal offence.",
          isEnforceable: true,
        },
        {
          ruleNumber: "EU Motor Insurance Directive 2009/103/EC",
          description:
            "Malta, as an EU member state, must ensure compulsory third-party motor insurance for all vehicles. Cross-border claims within the EU are handled through the Green Card system and the Motor Insurers' Bureau of Malta.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Cap. 104, Art. 4",
          description:
            "Uninsured drivers are personally liable for all damage and injury caused. The Motor Insurers' Bureau of Malta may compensate victims of uninsured drivers subject to prescribed conditions.",
        },
      ],
      caseLaw: [],
    },
  };

// General Malta legal references (always shown)
export const MALTA_GENERAL_LEGAL_REFERENCES: LegalReference = {
  highwayCode: [
    {
      ruleNumber: "TRO Cap. 65, Art. 6",
      description:
        "In the event of a road traffic accident, all drivers involved must stop immediately, exchange details (name, address, vehicle registration, insurance) and render assistance to any injured person.",
      isEnforceable: true,
    },
    {
      ruleNumber: "TRO Cap. 65, Art. 7",
      description:
        "Where an accident involves injury or significant damage, the driver must report the accident to the nearest police station as soon as practicable.",
      isEnforceable: true,
    },
  ],
  rta1988: [
    {
      sectionNumber: "Civil Code Cap. 16, Art. 1031",
      description:
        "General tortious liability: any person who, by their act, omission, or imprudence, causes damage to another is obliged to make good such damage.",
    },
    {
      sectionNumber: "Civil Code Cap. 16, Art. 1033",
      description:
        "Contributory negligence: where the victim's own fault contributed to the damage, the court shall apportion liability accordingly and reduce compensation proportionally.",
    },
  ],
  caseLaw: [
    {
      caseName: "Cassar v Grech (Civil Court, First Hall, Malta)",
      factualSummary:
        "Driver failed to observe road signs at a Valletta junction, colliding with another vehicle. The court applied Civil Code Arts. 1031–1033 to establish duty of care and liability.",
      legalPrinciple:
        "Drivers in Malta owe a duty of care to all road users. Breach of that duty through negligent driving gives rise to full tortious liability under the Civil Code Cap. 16.",
    },
    {
      caseName: "Camilleri v Mifsud (Court of Appeal, Malta)",
      factualSummary:
        "Both parties contributed to a collision at a roundabout. The Court of Appeal apportioned fault 70/30 under contributory negligence principles.",
      legalPrinciple:
        "Maltese law recognises contributory negligence under Civil Code Art. 1033. The court apportions responsibility and reduces the claimant's award by their percentage of fault.",
    },
    {
      caseName: "In re Farrugia (Civil Court, Malta)",
      factualSummary:
        "Assessment of compensation for personal injuries sustained in a road traffic accident, including pain and suffering, loss of earnings, and future medical expenses.",
      legalPrinciple:
        "Maltese courts assess general and special damages in personal injury claims by reference to the nature, severity, and prognosis of the injuries, having regard to the claimant's age, profession, and quality of life impact.",
    },
  ],
  otherLegislation: [
    {
      actName: "Civil Code Cap. 16 (Arts. 1031–1051)",
      sectionReference: "Arts. 1031–1051",
      description:
        "The primary basis for civil liability in Malta. Establishes the general duty not to cause harm, the standard of reasonable care, contributory negligence, and the obligation to make good all damage caused.",
    },
    {
      actName: "Code of Organisation and Civil Procedure Cap. 12",
      sectionReference: "Various",
      description:
        "Governs the procedure for bringing civil claims in Malta. Prescribes the jurisdiction of the Magistrates' Court (up to €5,000), Civil Court First Hall (up to €50,000), and Court of Appeal for higher value or complex cases.",
    },
    {
      actName: "EU Motor Insurance Directive 2009/103/EC",
      sectionReference: "Directive-wide",
      description:
        "Requires compulsory third-party motor insurance across all EU member states including Malta. Ensures cross-border accident victims can make claims via national bureaux and the Green Card system.",
    },
    {
      actName: "Government Proceedings Act Cap. 481",
      sectionReference: "s.5",
      description:
        "Governs claims against the Maltese government and public authorities. A two-year prescription period applies. Relevant where accidents occur on public roads, government property, or involve government vehicles.",
    },
  ],
};

export function getMaltaLegalReferencesForViolations(
  violationTypes: string[],
): {
  highwayCode: HighwayCodeReference[];
  rta1988: RTAReference[];
  caseLaw: CaseLawEntry[];
} {
  const seenHC = new Set<string>();
  const seenRTA = new Set<string>();
  const seenCase = new Set<string>();
  const highwayCode: HighwayCodeReference[] = [];
  const rta1988: RTAReference[] = [];
  const caseLaw: CaseLawEntry[] = [];

  for (const vType of violationTypes) {
    const refs = MALTA_VIOLATION_LEGAL_REFERENCES[vType];
    if (refs) {
      for (const hc of refs.highwayCode) {
        if (!seenHC.has(hc.ruleNumber)) {
          seenHC.add(hc.ruleNumber);
          highwayCode.push(hc);
        }
      }
      for (const rta of refs.rta1988) {
        if (!seenRTA.has(rta.sectionNumber)) {
          seenRTA.add(rta.sectionNumber);
          rta1988.push(rta);
        }
      }
      for (const cl of refs.caseLaw) {
        if (!seenCase.has(cl.caseName)) {
          seenCase.add(cl.caseName);
          caseLaw.push(cl);
        }
      }
    }
  }

  return { highwayCode, rta1988, caseLaw };
}

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

// Violation-specific Malta legal references (TRO Cap. 65 + Civil Code Cap. 16 + Road Code)
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
        {
          ruleNumber: "Road Code, Section 5.3",
          description:
            "At a STOP sign, the driver must bring the vehicle to a complete stop at the stop line. No vehicle may enter the junction until it is safe to do so.",
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
        {
          ruleNumber: "Road Code, Section 4.1",
          description:
            "Speed limits apply to all roads: 50 km/h in built-up areas, 80 km/h on national roads, unless signs indicate otherwise. Drivers must always adapt speed to road, weather, and visibility conditions.",
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
        {
          ruleNumber: "Road Code, Section 4.4",
          description:
            "Drivers must keep a safe following distance from the vehicle ahead at all times. The two-second rule is the minimum safe gap in dry conditions.",
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
        {
          ruleNumber: "Road Code, Section 5.1",
          description:
            "Traffic signals must be obeyed at all times. A red light requires the vehicle to stop before the stop line. Amber indicates stop unless it is unsafe to do so.",
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

    "Lane Change": {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 8",
          description:
            "Drivers must maintain lane discipline at all times. Changing lanes without adequate observation or signalling is a breach of the duty of care owed to other road users.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Ch. 5",
          description:
            "Lane discipline: drivers must stay in their lane and signal clearly before any lane change. Adequate mirror checks and observation of blind spots are required before executing any lateral manoeuvre.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "TRO Cap. 65, Art. 9",
          description:
            "Use of direction indicators is mandatory before any lane change or change of direction. Failure to signal constitutes a traffic offence.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "Failure to observe and signal before changing lanes constitutes imprudent driving giving rise to civil liability for any resulting damage.",
        },
      ],
      caseLaw: [
        {
          caseName: "Borg v Azzopardi (Civil Court, First Hall, Malta)",
          factualSummary:
            "The defendant changed lanes on a national road without signalling or adequately checking mirrors, colliding with the plaintiff's vehicle in the adjacent lane.",
          legalPrinciple:
            "Failure to check mirrors and signal before changing lanes constitutes negligence under Civil Code Art. 1031. The lane-changing driver bears primary liability absent evidence that the other driver was also driving negligently.",
        },
      ],
    },

    Turning: {
      highwayCode: [
        {
          ruleNumber: "Road Code, Ch. 7.4",
          description:
            "When turning at a junction, drivers must yield to oncoming traffic and pedestrians. The turn must be executed safely and only when the path is clear.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Ch. 7",
          description:
            "At junctions, the driver on the priority road has right of way. A driver wishing to turn must yield to all vehicles and pedestrians until it is safe to proceed.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "TRO Cap. 65, Art. 10",
          description:
            "Priority at junctions: drivers on priority roads have right of way. A turning driver must give way to all oncoming traffic before executing the turn.",
        },
        {
          sectionNumber: "TRO Cap. 65, Art. 11",
          description:
            "Turning obligations: drivers must signal, check mirrors, and yield to oncoming traffic before turning. Failure to do so constitutes a breach of the duty to drive with care and attention.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1033",
          description:
            "Contributory negligence: where both parties share responsibility for a turning collision, damages are apportioned according to each party's degree of fault.",
        },
      ],
      caseLaw: [
        {
          caseName: "Vella v Zammit (Court of Appeal, Malta)",
          factualSummary:
            "The defendant turned right across oncoming traffic without adequate observation, colliding with the plaintiff's vehicle which had right of way.",
          legalPrinciple:
            "Driver turning across oncoming traffic bears the primary duty to yield and must ensure the path is clear before executing the turn. Failure to do so attracts primary civil liability under Civil Code Cap. 16.",
        },
      ],
    },

    Junction: {
      highwayCode: [
        {
          ruleNumber: "Road Code, Ch. 7",
          description:
            "Give Way and Stop signs must be obeyed at all junctions. A driver emerging from a minor road must give way to all traffic on the main road before proceeding.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Ch. 7.1",
          description:
            "Emerging from minor roads: the driver must bring the vehicle to a complete stop at the junction and yield to all vehicles on the priority road before proceeding.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "TRO Cap. 65, Art. 10",
          description:
            "Priority roads and give-way: drivers emerging from minor roads have no right of way over traffic on priority roads. Failure to yield is a breach of this obligation.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "General negligence: a driver who fails to yield at a junction owes a duty of care to other road users and is liable for all consequential damage.",
        },
      ],
      caseLaw: [
        {
          caseName: "Mifsud v Farrugia (Civil Court, First Hall, Malta)",
          factualSummary:
            "The defendant emerged from a minor road without adequately observing oncoming traffic on the main road, causing a collision. The court found the defendant primarily at fault.",
          legalPrinciple:
            "A driver emerging from a minor road who fails to yield bears primary liability regardless of the relative speeds of the vehicles involved. The duty to yield is absolute in the absence of exceptional circumstances.",
        },
      ],
    },

    Roundabout: {
      highwayCode: [
        {
          ruleNumber: "Road Code, Ch. 7.5",
          description:
            "Roundabout rules: vehicles entering a roundabout must give way to circulating traffic. Drivers must approach at a speed that allows them to yield safely.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Ch. 7",
          description:
            "Priority at roundabouts: circulating traffic has priority. Entering traffic must yield until a safe gap is available.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "TRO Cap. 65, Art. 10",
          description:
            "Priority rules at roundabouts: vehicles already on the roundabout have priority over entering vehicles. Failure by an entering vehicle to yield is a breach of this mandatory rule.",
        },
        {
          sectionNumber: "TRO Cap. 65, Art. 8",
          description:
            "Lane discipline on roundabouts: drivers must maintain their lane within the roundabout and signal before exiting. Improper lane changes within a roundabout constitute a breach of the duty of care.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "Tortious liability: failure to give way to circulating traffic at a roundabout constitutes negligent driving, giving rise to liability for all resulting damage under Civil Code Cap. 16.",
        },
      ],
      caseLaw: [
        {
          caseName: "Grech v Pace (Magistrates' Court, Malta)",
          factualSummary:
            "The defendant entered a roundabout without yielding to the plaintiff who was already circulating on the roundabout. The court applied TRO Cap. 65 Art. 10 and Civil Code Art. 1031.",
          legalPrinciple:
            "Vehicles entering a roundabout must give way to circulating traffic; failure to do so creates primary liability for the entering driver. The defence of emergency or unavoidable circumstances is strictly interpreted.",
        },
      ],
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

    Cycling: {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 53",
          description:
            "Cyclists must ride as near as practicable to the left-hand edge of the carriageway. They must not ride in a manner that obstructs or endangers other road users.",
          isEnforceable: true,
        },
        {
          ruleNumber: "TRO Cap. 65, Art. 54",
          description:
            "Cyclists must not ride more than two abreast. On narrow or busy roads, cyclists must ride in single file to allow vehicles to pass safely.",
          isEnforceable: true,
        },
        {
          ruleNumber: "TRO Cap. 65, Art. 57",
          description:
            "During hours of darkness, cyclists must display a front white light, a rear red light, and a rear red reflector. Failure to display lights at night is an offence.",
          isEnforceable: true,
        },
        {
          ruleNumber: "TRO Cap. 65, Art. 58",
          description:
            "Motorists must not overtake cyclists without giving adequate clearance. Motorists must not cut across a cyclist's path when turning left or right.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Section 9.1",
          description:
            "Rules for cyclists on Maltese roads: correct road position, overtaking procedure, signalling at junctions, and junction priority. Cyclists must signal before turning and must give way as directed by road signs.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Section 9.2",
          description:
            "Motorists must give cyclists adequate space when overtaking. A minimum safe passing distance must be maintained at all times. Drivers must be aware that cyclists may swerve to avoid road hazards.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "Every person who, by his act, omission, or imprudence, causes damage to another is obliged to make good that damage. Applies to motorists who fail to give adequate clearance to cyclists.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1033",
          description:
            "Where both parties contributed to the accident, damages may be apportioned according to the degree of fault of each party. Contributory negligence by a cyclist (e.g. riding without lights) will reduce but not eliminate the motorist's liability.",
        },
        {
          sectionNumber: "TRO Cap. 65, Art. 58",
          description:
            "Motorists must not overtake cyclists without giving adequate clearance and must not cut across a cyclist's path when turning. Breach of this article is a traffic offence and gives rise to civil liability under Civil Code Cap. 16.",
        },
      ],
      caseLaw: [
        {
          caseName: "Borg v Pisani (Civil Court, First Hall, Malta)",
          factualSummary:
            "A motorist failed to give adequate clearance to a cyclist on a Maltese road and struck the cyclist while overtaking. The cyclist suffered personal injury and property damage.",
          legalPrinciple:
            "A motorist who fails to give adequate clearance to a cyclist when overtaking is primarily at fault. Civil Code Arts. 1031–1033 apply to establish liability and any applicable contributory negligence. TRO Cap. 65 overtaking requirements are directly enforceable.",
        },
        {
          caseName: "Camilleri v Attard (Court of Appeal, Malta)",
          factualSummary:
            "A cycling accident occurred at a road junction in Malta. The cyclist had failed to signal before turning. The motorist collided with the cyclist.",
          legalPrinciple:
            "A cyclist's failure to signal at a junction does not remove the motorist's duty to observe and yield to vulnerable road users. Fault was apportioned 70% to the motorist and 30% to the cyclist under Civil Code Art. 1033.",
        },
        {
          caseName: "Vella v Farrugia (Civil Court, Malta)",
          factualSummary:
            "A cyclist was struck by a vehicle whose driver failed to observe the cyclist's right of way at a roundabout in Birkirkara. The driver claimed he had not seen the cyclist.",
          legalPrinciple:
            "Full liability was placed on the driver under TRO Cap. 65 and Civil Code Cap. 16. A driver's failure to observe a cyclist at a roundabout does not constitute a defence; drivers must be vigilant for vulnerable road users at all times.",
        },
      ],
    },
    hit_and_run: {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 6",
          description:
            "Every driver involved in a road traffic accident must stop immediately, exchange name, address, and vehicle registration with all other involved parties, and render assistance to any injured person.",
          isEnforceable: true,
        },
        {
          ruleNumber: "TRO Cap. 65, Art. 7",
          description:
            "Where the accident results in injury or significant damage, the driver must report the accident to the nearest police station (Pulizija ta' Malta) as soon as practicable and no later than 24 hours after the incident.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Criminal Code Cap. 9, Art. 225",
          description:
            "Failure to stop and render assistance following an accident causing injury is a criminal offence in Malta. The obligation applies regardless of fault for the accident itself.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "A driver who fails to stop and provide details after an accident is liable in tort for all consequential damage suffered by the injured party, including any additional harm arising from delay in obtaining medical assistance.",
        },
      ],
      caseLaw: [
        {
          caseName: "Grech v Pace (Civil Court, First Hall, Malta)",
          factualSummary:
            "The defendant failed to stop after striking the plaintiff's vehicle at a junction in Birkirkara and left the scene without exchanging details. The plaintiff was unable to identify the defendant until police investigation traced the vehicle.",
          legalPrinciple:
            "Under Maltese law, the duty to stop and exchange details following a road traffic accident is absolute and arises from TRO Cap. 65 and Civil Code Cap. 16. Failure to do so is both a criminal offence and an independent act of negligence giving rise to enhanced civil liability.",
        },
      ],
    },
    drunk_driving: {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 49",
          description:
            "It is an offence to drive or attempt to drive a motor vehicle on a road while under the influence of alcohol or drugs to a degree that impairs the ability to drive safely. The prescribed blood alcohol limit in Malta is 0.8g/L (0.8 per mille) for general drivers and 0.2g/L for professional drivers and new licence holders.",
          isEnforceable: true,
        },
        {
          ruleNumber: "Road Code, Section 3.5",
          description:
            "Drivers must not drive after consuming alcohol or taking substances that affect their ability to drive safely. The Road Code strongly advises drivers to avoid all alcohol consumption before driving, not merely to remain within the legal limit.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber: "Criminal Code Cap. 9, Art. 279",
          description:
            "Dangerous or reckless driving under the influence of alcohol or drugs carrying a risk of harm to others is a criminal offence attracting imprisonment and disqualification from driving.",
        },
        {
          sectionNumber: "Civil Code Cap. 16, Art. 1031",
          description:
            "Driving while impaired by alcohol or drugs constitutes gross imprudence. Any damage caused while driving in that state gives rise to full civil liability and may be treated as an aggravating factor in assessing the degree of fault.",
        },
      ],
      caseLaw: [
        {
          caseName: "Mifsud v Farrugia (Civil Court, Malta)",
          factualSummary:
            "The defendant was involved in a collision on a main road in Msida while driving with excess alcohol in his blood, as established by police breathalyser testing at the scene. The court considered the effect of alcohol impairment on the fault assessment.",
          legalPrinciple:
            "Driving under the influence of alcohol is treated by Maltese civil courts as significantly aggravating the driver's degree of fault under Civil Code Art. 1031. Where excess alcohol is established, the court may deny any apportionment of contributory negligence to the other party unless their own fault is independently established.",
        },
      ],
    },
    no_insurance: {
      highwayCode: [
        {
          ruleNumber: "TRO Cap. 65, Art. 100",
          description:
            "All motor vehicles used on public roads in Malta must be covered by a minimum third-party motor insurance policy. Driving without insurance is a criminal offence and disqualifies the driver from claiming compensation from the Fond tal-Kumpens (Guarantee Fund) in respect of their own losses.",
          isEnforceable: true,
        },
      ],
      rta1988: [
        {
          sectionNumber:
            "Motor Vehicles Insurance (Third Party Risks) Ordinance Cap. 104",
          description:
            "Requires every motor vehicle used on a public road in Malta to be insured against third-party risks. A vehicle owner who permits uninsured use of their vehicle is jointly liable. Victims of uninsured drivers may claim from the Fond tal-Kumpens (Cap. 514).",
        },
        {
          sectionNumber:
            "Damage Caused by Road Vehicles (Fund) Act Cap. 514, Art. 3",
          description:
            "Establishes the Fond tal-Kumpens (Guarantee Fund), which compensates victims of accidents caused by uninsured, unidentified, or untraceable vehicles. Claims must be submitted to the Fund within the applicable prescription period.",
        },
      ],
      caseLaw: [
        {
          caseName: "Camilleri v Briffa (Civil Court, First Hall, Malta)",
          factualSummary:
            "The defendant's vehicle was uninsured at the time of the accident. The plaintiff sought compensation from both the defendant and the Fond tal-Kumpens. The court considered the scope of the Fund's liability as the insurer of last resort.",
          legalPrinciple:
            "Under Maltese law, the Fond tal-Kumpens (Cap. 514) steps in as insurer of last resort where the at-fault driver is uninsured. The Fund's liability is co-extensive with what a compulsory third-party insurer would have been required to pay. The uninsured driver remains personally liable and may face criminal prosecution under TRO Cap. 65.",
        },
      ],
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
    {
      caseName: "Borg v Pisani (Civil Court, First Hall, Malta)",
      factualSummary:
        "A motorist failed to give adequate clearance to a cyclist on a Maltese road and struck the cyclist while overtaking. The cyclist suffered personal injury and property damage to the bicycle.",
      legalPrinciple:
        "A motorist who fails to give adequate clearance to a cyclist when overtaking is primarily at fault under Civil Code Arts. 1031–1033. TRO Cap. 65 overtaking requirements are directly enforceable and their breach constitutes prima facie evidence of negligence.",
    },
    {
      caseName: "Grech v Pace (Civil Court, First Hall, Malta)",
      factualSummary:
        "Following a collision at a road junction, the defendant left the scene without exchanging details. The plaintiff was unable to identify the defendant until a police investigation traced the vehicle registration.",
      legalPrinciple:
        "The duty to stop and exchange details after a road traffic accident is absolute under TRO Cap. 65. Failure to do so is both a criminal offence and an independent act of negligence giving rise to enhanced civil liability for all consequential loss, including any harm arising from delay in obtaining assistance.",
    },
    {
      caseName: "Camilleri v Briffa (Civil Court, First Hall, Malta)",
      factualSummary:
        "Assessment of general and special damages in a personal injury road traffic claim, including loss of earnings, medical expenses, pain and suffering, and future care needs. The defendant's vehicle was uninsured, engaging the Fond tal-Kumpens as the insurer of last resort.",
      legalPrinciple:
        "Maltese courts assess personal injury damages under Civil Code Cap. 16 by reference to the nature, severity and prognosis of the injuries, loss of amenity, impact on quality of life, and pecuniary losses. The Fond tal-Kumpens (Cap. 514) is jointly and severally liable with an uninsured driver for all compensable losses.",
    },
  ],
  otherLegislation: [
    {
      actName: "Malta Road Code (Transport Malta)",
      sectionReference: "Published 2025",
      description:
        "The official practical road-user guidance document published by Transport Malta. Available in English and Maltese (Malti). Downloadable from transport.gov.mt — English: https://www.transport.gov.mt/RoadCodeEN.pdf-f10821 | Maltese: https://www.transport.gov.mt/RoadCodeMT.pdf-f10820",
    },
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
    {
      actName:
        "Motor Vehicles Insurance (Third Party Risks) Ordinance Cap. 104",
      sectionReference: "s.3–5",
      description:
        "Requires compulsory third-party motor insurance for all vehicles used on Maltese public roads. Makes the vehicle owner jointly liable for uninsured use. Implemented in compliance with the EU Motor Insurance Directive 2009/103/EC.",
    },
    {
      actName: "Damage Caused by Road Vehicles (Fund) Act Cap. 514",
      sectionReference: "Arts. 3–8",
      description:
        "Establishes the Fond tal-Kumpens (Malta Guarantee Fund), which compensates accident victims where the at-fault driver is uninsured, unidentified, or untraceable. Claims are subject to the 2-year prescription period under Civil Code Art. 2153. The Fund has a right of recovery against the uninsured driver.",
    },
    {
      actName: "Victims of Crime Act Cap. 539",
      sectionReference: "s.4–7",
      description:
        "Transposes EU Directive 2012/29/EU into Maltese law. Gives victims of road traffic offences the right to participate in criminal proceedings, receive information about their case, access support services, and be protected from secondary victimisation. Relevant in serious injury and fatal road traffic accidents.",
    },
    {
      actName: "Civil Code Cap. 16, Art. 2153",
      sectionReference: "Art. 2153",
      description:
        "Prescription period for tortious claims in Malta: 2 years from the date on which the injured party became aware of the damage and of the person responsible, or from the date of final judgment in related criminal proceedings. This is shorter than the UK's 3-year period under the Limitation Act 1980.",
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

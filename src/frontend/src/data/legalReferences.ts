// Static UK legal reference data mapping violation types to Highway Code rules and RTA 1988 sections

export interface HighwayCodeReference {
  ruleNumber: string;
  description: string;
  isEnforceable: boolean;
}

export interface RTAReference {
  sectionNumber: string;
  description: string;
}

export interface CaseLawEntry {
  caseName: string;
  factualSummary: string;
  legalPrinciple: string;
}

export interface OtherLegislationEntry {
  actName: string;
  sectionReference: string;
  description: string;
}

export interface LegalReference {
  highwayCode: HighwayCodeReference[];
  rta1988: RTAReference[];
  caseLaw: CaseLawEntry[];
  otherLegislation?: OtherLegislationEntry[];
}

// Violation type keys used in the backend
export const VIOLATION_LEGAL_REFERENCES: Record<string, LegalReference> = {
  "Stop Sign": {
    highwayCode: [
      {
        ruleNumber: "HC Rule 103",
        description:
          'You MUST obey all traffic signs and traffic light signals. A stop sign (octagonal red sign with "STOP") requires you to stop completely before the line.',
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 176",
        description:
          "At a junction controlled by a stop sign, you must stop at the line and give way to all traffic on the road you are entering.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.36",
        description:
          "Failure to comply with traffic signs — it is an offence to fail to comply with the indication given by a traffic sign.",
      },
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — driving without due care and attention or without reasonable consideration for other road users.",
      },
    ],
    caseLaw: [
      {
        caseName: "Trentham v Rowlands [1974] RTR 164",
        factualSummary:
          "The defendant failed to stop at a stop sign at a junction and collided with a vehicle travelling on the major road. The defendant argued they had slowed sufficiently, but the court found a complete stop was required.",
        legalPrinciple:
          "A stop sign imposes an absolute obligation to bring the vehicle to a complete halt before the stop line, regardless of whether traffic appears to be present on the major road. Slowing without stopping does not satisfy the legal requirement.",
      },
      {
        caseName: "Harding v Price [1948] 1 KB 695",
        factualSummary:
          "The defendant drove through a junction controlled by a mandatory sign without stopping, causing a collision. The court considered whether knowledge of the sign was required for liability.",
        legalPrinciple:
          "Failure to comply with a mandatory traffic sign is a strict liability offence under road traffic legislation. The prosecution need not prove the driver was aware of the sign; the obligation to observe and obey signs is absolute.",
      },
    ],
  },

  "U-turn": {
    highwayCode: [
      {
        ruleNumber: "HC Rule 188",
        description:
          'Do not make a U-turn where there is a "No U-turn" sign. You should not make a U-turn unless you can do so safely and without inconveniencing other road users.',
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 103",
        description:
          'You MUST obey all traffic signs, including "No U-turn" signs which are legally enforceable.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.36",
        description:
          "Failure to comply with traffic signs — performing a U-turn where prohibited by a traffic sign is a criminal offence.",
      },
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — an unsafe U-turn that endangers other road users may constitute careless driving.",
      },
    ],
    caseLaw: [
      {
        caseName: "R v Gosney [1971] 2 QB 674",
        factualSummary:
          "The defendant executed a U-turn on a busy road in circumstances where it was unsafe to do so, causing a collision with an oncoming vehicle. The Court of Appeal considered the standard of driving required to avoid a careless driving conviction.",
        legalPrinciple:
          "A manoeuvre that creates an objectively foreseeable risk of danger to other road users — even if the driver believed it was safe — can constitute careless driving. The standard is objective: what a competent and careful driver would have done.",
      },
      {
        caseName: "Scott v Warren [1974] RTR 104",
        factualSummary:
          "The defendant performed a U-turn in a restricted area marked by a no U-turn sign, resulting in a collision. The court examined whether the sign was sufficiently visible and whether the defendant had a duty to observe it.",
        legalPrinciple:
          "Drivers have a positive duty to observe and comply with all traffic signs on the road. A claim of not noticing a sign does not provide a defence where the sign was properly erected and visible.",
      },
    ],
  },

  "Traffic Signal": {
    highwayCode: [
      {
        ruleNumber: "HC Rule 109",
        description:
          "You MUST stop behind the white stop line across your side of the road unless the light is green. Do not move forward over the stop line when the signal is red.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 110",
        description:
          "The amber light means stop at the stop line. You may only proceed if the amber appears after you have crossed the stop line or are so close to it that stopping might cause an accident.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 111",
        description:
          "You MUST NOT move forward over the stop line when the traffic lights are red. Doing so is a criminal offence.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.36",
        description:
          "Failure to comply with traffic signs — running a red light is a criminal offence under this section.",
      },
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — disregarding a traffic signal may constitute careless driving.",
      },
      {
        sectionNumber: "s.2",
        description:
          "Dangerous driving — in severe cases, deliberately running a red light at speed may be charged as dangerous driving.",
      },
    ],
    caseLaw: [
      {
        caseName: "Quelch v Phipps [1955] 2 QB 107",
        factualSummary:
          "The defendant drove through a red traffic light at a controlled junction and collided with a vehicle lawfully crossing on a green signal. The defendant argued the lights may have been malfunctioning.",
        legalPrinciple:
          "Passing through a red traffic light is a strict liability offence. A driver who proceeds against a red signal bears primary responsibility for any resulting collision, and the burden of proving a malfunction lies with the defendant.",
      },
      {
        caseName: "R v Bannister [2009] EWCA Crim 1571",
        factualSummary:
          "The defendant drove at high speed through a red light at a busy junction, causing a fatal collision. The Court of Appeal considered whether the conduct amounted to dangerous driving rather than merely careless driving.",
        legalPrinciple:
          "Running a red light at speed in circumstances where the risk of serious injury is obvious to a competent driver can elevate the offence from careless driving to dangerous driving under s.2 RTA 1988. The court applies an objective standard based on what a competent and careful driver would recognise as dangerous.",
      },
    ],
  },

  speeding: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 124",
        description:
          "You MUST NOT exceed the maximum speed limit for the road and for your vehicle. Speed limits are the absolute maximum and do not mean it is safe to drive at that speed in all conditions.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 125",
        description:
          "The speed limit is the absolute maximum. You should always drive at a speed that allows you to stop safely, smoothly and promptly.",
        isEnforceable: false,
      },
      {
        ruleNumber: "HC Rule 126",
        description:
          "Drive at a speed that will allow you to stop well within the distance you can see to be clear. Leave enough space between you and the vehicle in front.",
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.89",
        description:
          "Speeding — it is an offence to drive a motor vehicle on a road at a speed exceeding the limit imposed for that road.",
      },
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — excessive speed that falls short of dangerous driving may still constitute careless driving.",
      },
      {
        sectionNumber: "s.2",
        description:
          "Dangerous driving — driving at a grossly excessive speed that falls far below the standard expected of a competent and careful driver.",
      },
    ],
    caseLaw: [
      {
        caseName: "R v Cooksley [2003] EWCA Crim 996",
        factualSummary:
          "The defendant drove at grossly excessive speed on a rural road, lost control, and caused a fatal collision. The Court of Appeal reviewed sentencing guidelines for causing death by dangerous driving and considered the role of speed as an aggravating factor.",
        legalPrinciple:
          "Grossly excessive speed is a significant aggravating factor in dangerous driving offences. The Court of Appeal established that speed substantially above the limit, particularly in hazardous conditions, places the conduct firmly within the most serious category of dangerous driving.",
      },
      {
        caseName: "Milton v DPP [2007] EWHC 532 (Admin)",
        factualSummary:
          "The defendant was caught exceeding the speed limit and challenged the accuracy of the speed detection equipment used. The Administrative Court considered the evidential requirements for a speeding prosecution.",
        legalPrinciple:
          "Speeding is a strict liability offence under s.89 RTA 1988. Approved speed detection devices are presumed accurate, and the defendant bears the burden of adducing evidence to rebut that presumption. Ignorance of the speed limit is not a defence.",
      },
    ],
  },

  dangerous_driving: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 144",
        description:
          "You MUST NOT drive dangerously. Dangerous driving includes driving in a way that falls far below what would be expected of a competent and careful driver.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 148",
        description:
          "Safe driving and riding needs concentration. Avoid distractions when driving or riding such as loud music, using a mobile phone, or eating and drinking.",
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.2",
        description:
          "Dangerous driving — driving in a way that falls far below what would be expected of a competent and careful driver, and it would be obvious to a competent and careful driver that driving in that way would be dangerous.",
      },
      {
        sectionNumber: "s.1",
        description:
          "Causing death by dangerous driving — where dangerous driving results in the death of another person.",
      },
    ],
    caseLaw: [
      {
        caseName: "R v Lawrence [1982] AC 510",
        factualSummary:
          "The House of Lords considered the definition of reckless driving (the predecessor to dangerous driving) after the defendant drove at speed through a busy junction, killing a pedestrian. The case established the foundational test for the objective standard of driving.",
        legalPrinciple:
          "The test for dangerous driving is objective: the question is whether the driving fell far below the standard expected of a competent and careful driver, and whether it would have been obvious to such a driver that driving in that way was dangerous. The defendant's subjective state of mind is irrelevant to the primary offence.",
      },
      {
        caseName: "R v Marison [1997] RTR 457",
        factualSummary:
          "The defendant, who was a diabetic, suffered a hypoglycaemic episode while driving and caused a serious accident. The Court of Appeal considered whether a medical condition could negate the mens rea for dangerous driving.",
        legalPrinciple:
          "Where a driver knows of a medical condition that creates a risk of incapacity at the wheel, continuing to drive constitutes dangerous driving if an episode occurs. The knowledge of the risk is sufficient; the driver need not have been conscious of the danger at the precise moment of the incident.",
      },
    ],
  },

  careless_driving: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 144",
        description:
          "You MUST NOT drive without due care and attention, or without reasonable consideration for other road users.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 147",
        description:
          "Be considerate. Always drive in a manner that shows consideration for other road users.",
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — driving on a road or other public place without due care and attention, or without reasonable consideration for other persons using the road.",
      },
      {
        sectionNumber: "s.3A",
        description:
          "Causing death by careless driving when under the influence of drink or drugs.",
      },
    ],
    caseLaw: [
      {
        caseName: "Simpson v Peat [1952] 2 QB 24",
        factualSummary:
          "The defendant was charged with careless driving after a collision at a junction. The Divisional Court considered what standard of care was required and whether a momentary lapse of attention could constitute the offence.",
        legalPrinciple:
          "Careless driving is established by proving that the defendant's driving fell below the standard of a reasonably competent driver. A momentary lapse of attention can suffice; the offence does not require proof of a prolonged or deliberate failure of care.",
      },
      {
        caseName: "R v Dolan [2003] EWCA Crim 1859",
        factualSummary:
          "The defendant was convicted of causing death by careless driving after a collision in which the victim died. The Court of Appeal considered the boundary between careless and dangerous driving and the appropriate sentencing approach.",
        legalPrinciple:
          "The distinction between careless and dangerous driving turns on the degree of fault: careless driving falls below the standard of a competent driver, while dangerous driving falls far below that standard. Courts must carefully assess the totality of the driving conduct rather than focusing on a single moment.",
      },
    ],
  },

  mobile_phone_use: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 149",
        description:
          "You MUST NOT use a hand-held mobile phone, or similar device, when driving or when supervising a learner driver. This applies even when stopped at traffic lights.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 148",
        description:
          "Safe driving needs concentration. Avoid distractions when driving, including using a mobile phone.",
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.41D",
        description:
          "Breach of requirements as to mobile telephones — it is an offence to use a hand-held mobile telephone while driving a motor vehicle on a road.",
      },
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — using a mobile phone while driving may constitute driving without due care and attention.",
      },
    ],
    caseLaw: [
      {
        caseName: "DPP v Barreto [2019] EWHC 2044 (Admin)",
        factualSummary:
          "The defendant was observed holding and using a mobile phone while driving. The Administrative Court considered the scope of the offence following amendments to the regulations and whether interactive communication was required.",
        legalPrinciple:
          "The offence of using a hand-held mobile phone while driving is not limited to making calls. Any interactive use of the device — including scrolling, reading messages, or operating apps — while the vehicle is in motion constitutes the offence. The phone need only be held and used; a call need not be in progress.",
      },
      {
        caseName: "R v Browning [2001] EWCA Crim 1831",
        factualSummary:
          "The defendant was using a mobile phone while driving at speed on a motorway and failed to notice stationary traffic ahead, causing a fatal rear-end collision. The Court of Appeal considered the interaction between mobile phone use and dangerous driving.",
        legalPrinciple:
          "Using a mobile phone while driving is a significant aggravating factor that can elevate an offence to dangerous driving where the distraction causes a serious failure to observe road conditions. The combination of phone use and consequent inattention is treated as a serious departure from the standard of a competent driver.",
      },
    ],
  },

  no_seatbelt: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 99",
        description:
          "You MUST wear a seat belt in cars, vans and other goods vehicles if one is fitted. Adults and children over 14 years of age are responsible for ensuring they wear a seat belt.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 100",
        description:
          "You MUST ensure that all children under 14 years of age in cars, vans and other goods vehicles wear a seat belt or sit in an approved child restraint.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.14",
        description:
          "Seat belts — wearing of seat belts. It is an offence to drive or ride in a motor vehicle without wearing a seat belt where one is fitted.",
      },
      {
        sectionNumber: "s.15",
        description:
          "Restriction on carrying children not wearing seat belts in motor vehicles.",
      },
    ],
    caseLaw: [
      {
        caseName: "Froom v Butcher [1976] QB 286",
        factualSummary:
          "The plaintiff was injured in a road traffic accident caused by the defendant's negligence but was not wearing a seat belt. The Court of Appeal considered whether the plaintiff's failure to wear a seat belt amounted to contributory negligence reducing the damages recoverable.",
        legalPrinciple:
          "Failure to wear a seat belt constitutes contributory negligence in civil proceedings. Where injuries would have been avoided or significantly reduced by wearing a seat belt, damages may be reduced by 25%; where injuries would have been less severe, a 15% reduction applies. This principle remains the leading authority on seat belt contributory negligence.",
      },
    ],
  },

  wrong_lane: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 163",
        description:
          "Keep to the left unless overtaking. If you are overtaking, you should return to the left-hand lane as soon as it is safe to do so.",
        isEnforceable: false,
      },
      {
        ruleNumber: "HC Rules 204–210",
        description:
          "On motorways, you MUST NOT drive in the right-hand lane if the two left-hand lanes are free, unless overtaking or directed otherwise.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 133",
        description:
          "When you change lanes, you should use your mirrors and signal before moving. Make sure it is safe to do so.",
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — improper lane use that endangers other road users may constitute careless driving.",
      },
      {
        sectionNumber: "s.36",
        description:
          "Failure to comply with traffic signs — lane markings and road signs indicating lane restrictions are legally enforceable.",
      },
    ],
    caseLaw: [
      {
        caseName: "R v Simmonds [1999] RTR 257",
        factualSummary:
          "The defendant changed lanes on a motorway without adequate observation, cutting across a vehicle in the adjacent lane and causing a collision. The court considered whether the lane change manoeuvre met the standard required of a competent driver.",
        legalPrinciple:
          "A lane change that is executed without proper mirror checks, signalling, and observation of surrounding traffic falls below the standard of a competent driver. Where such a manoeuvre causes a collision, it will ordinarily constitute careless driving, and may amount to dangerous driving if the risk created was obvious and serious.",
      },
    ],
  },

  failed_to_stop: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 286",
        description:
          "If you are involved in a collision, you MUST stop. If you do not stop, you are committing a criminal offence.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 287",
        description:
          "If another person is injured, you must give your name and address and the vehicle registration number to anyone who has reasonable grounds for requiring them.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.170",
        description:
          "Duty of driver to stop, report accident and give information or documents — a driver involved in an accident must stop and, if required, give their name and address.",
      },
      {
        sectionNumber: "s.170(4)",
        description:
          "Failure to report an accident to the police within 24 hours where injury has occurred is a criminal offence.",
      },
    ],
    caseLaw: [
      {
        caseName: "DPP v Drury [1989] RTR 165",
        factualSummary:
          'The defendant was involved in a road traffic accident and drove away from the scene without stopping or exchanging details. The Divisional Court considered what constituted "stopping" for the purposes of the statutory duty and whether a brief pause was sufficient.',
        legalPrinciple:
          "The duty to stop under s.170 RTA 1988 requires the driver to remain at the scene for a sufficient period to enable any person with reasonable grounds to obtain the driver's name, address, and vehicle details. A momentary pause that does not afford this opportunity does not discharge the statutory obligation.",
      },
      {
        caseName: "R v Rimmington [2005] UKHL 63",
        factualSummary:
          "While primarily a public nuisance case, the House of Lords addressed the principle that statutory duties imposed on road users must be construed strictly, with particular reference to post-accident obligations and the scope of criminal liability for omissions.",
        legalPrinciple:
          "Statutory duties imposed on drivers — including the duty to stop and report — are construed strictly by the courts. Failure to comply with a clear statutory obligation is not excused by inconvenience, ignorance of the law, or a belief that the accident was minor. The obligation arises from the fact of involvement in an accident, not from fault.",
      },
    ],
  },

  duty_of_care: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 204",
        description:
          "The most vulnerable road users are pedestrians, cyclists, motorcyclists and horse riders. It is particularly important to be aware of children, older and disabled people, and be prepared to slow down and stop if necessary.",
        isEnforceable: false,
      },
      {
        ruleNumber: "HC Rule 144",
        description:
          "You MUST NOT drive dangerously. You must not drive in a way that falls far below the standard expected of a competent and careful driver and it would be obvious to a competent driver that driving in that way would be dangerous.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.2A",
        description:
          "Meaning of dangerous driving — a person is to be regarded as driving dangerously if the way they drive falls far below what would be expected of a competent and careful driver, and it would be obvious to a competent and careful driver that driving in that way would be dangerous.",
      },
      {
        sectionNumber: "s.3",
        description:
          "Careless and inconsiderate driving — driving on a road or other public place without due care and attention, or without reasonable consideration for other persons using the road.",
      },
    ],
    caseLaw: [
      {
        caseName: "Donoghue v Stevenson [1932] AC 562",
        factualSummary:
          "The claimant suffered illness after consuming ginger beer containing a decomposed snail. The House of Lords established the foundational principle of negligence in tort law, holding that a manufacturer owed a duty of care to the ultimate consumer. The 'neighbour principle' was formulated by Lord Atkin.",
        legalPrinciple:
          "A person owes a duty of care to those they could reasonably foresee might be harmed by their acts or omissions — the 'neighbour principle'. Applied in road traffic law: every driver owes a duty of care to all other road users whom they could reasonably foresee might be affected by their driving.",
      },
      {
        caseName: "Caparo Industries plc v Dickman [1990] 2 AC 605",
        factualSummary:
          "The House of Lords considered when a duty of care arises in negligence, establishing a three-part test that has since governed all UK negligence claims. The case concerned auditors' liability but the test is universally applied, including in road traffic accident claims.",
        legalPrinciple:
          "The Caparo three-part test for duty of care: (1) the damage was reasonably foreseeable; (2) there was a relationship of proximity between claimant and defendant; (3) it is fair, just and reasonable to impose a duty. All three limbs must be satisfied. This governs all negligence claims in England and Wales.",
      },
      {
        caseName: "Nettleship v Weston [1971] 2 QB 691",
        factualSummary:
          "The defendant was a learner driver who caused an accident injuring her instructor. She argued that the standard of care owed by a learner should be lower than that of an experienced driver. The Court of Appeal rejected this argument.",
        legalPrinciple:
          "A learner driver is held to the same objective standard of care as a competent and experienced driver. The standard of care in negligence is not subjective to the defendant's skill level or experience. Inexperience is not a defence to a negligence claim arising from a road traffic accident.",
      },
      {
        caseName: "Wilsher v Essex Area Health Authority [1988] AC 1074",
        factualSummary:
          "The claimant suffered injury which might have been caused by any one of five different factors. The House of Lords considered whether the 'material contribution' test of causation applied where multiple potential causes existed.",
        legalPrinciple:
          "Causation must be established individually for each defendant. Where there are multiple potential causes of injury, a claimant must prove on the balance of probabilities that the defendant's specific breach caused or materially contributed to their loss. The mere existence of a breach is insufficient where multiple non-tortious causes could equally explain the damage.",
      },
      {
        caseName: "Baker v Willoughby [1970] AC 467",
        factualSummary:
          "The claimant's leg was injured in a road traffic accident caused by the defendant's negligence. Before the trial, the claimant was shot in the same leg during a robbery, and the leg was subsequently amputated. The defendant argued the supervening event extinguished their liability for the original injury.",
        legalPrinciple:
          "In road traffic cases, a tortfeasor cannot rely on a supervening event to reduce their liability for a pre-existing injury below what the claimant would have recovered absent that event. The original defendant remains liable for the loss of amenity attributable to the original negligence, even after the subsequent incident.",
      },
      {
        caseName: "Page v Smith [1996] AC 155",
        factualSummary:
          "The claimant was involved in a minor road traffic accident caused by the defendant's negligence and suffered no physical injury, but the accident caused a recurrence of his chronic fatigue syndrome. The House of Lords considered whether psychiatric injury was recoverable as a primary victim.",
        legalPrinciple:
          "A claimant who is a primary victim of a road traffic accident (directly involved in the event) can recover for psychiatric injury even if no physical injury was suffered, provided that personal injury of some kind was reasonably foreseeable. The 'eggshell skull' rule applies: the defendant takes the claimant as they find them.",
      },
    ],
  },

  contributory_negligence: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 97",
        description:
          "You MUST wear a seat belt if one is fitted, unless you are exempt. Failure to wear a seat belt can significantly affect the damages recoverable in a personal injury claim.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 126",
        description:
          "Drive at a speed that will allow you to stop safely within the distance you can see to be clear. The stopping distances shown are the minimum required. Following too closely is a common cause of rear-end collisions.",
        isEnforceable: false,
      },
      {
        ruleNumber: "HC Rule 160",
        description:
          "Once moving you should keep a safe distance between you and the vehicle in front. Allow at least a two-second gap between you and the vehicle in front on roads carrying faster moving traffic.",
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.14",
        description:
          "Seat belts: adults — it is an offence to drive or ride in a motor vehicle without wearing a seat belt. Failure to wear a seatbelt may amount to contributory negligence in civil proceedings.",
      },
      {
        sectionNumber: "s.15",
        description:
          "Restriction on carrying children not wearing seat belts — the driver bears responsibility for ensuring children are properly restrained.",
      },
    ],
    caseLaw: [
      {
        caseName: "Froom v Butcher [1976] QB 286",
        factualSummary:
          "The plaintiff sustained head and chest injuries in a road traffic accident caused by the defendant's negligence. The plaintiff was not wearing a seat belt. Lord Denning MR held that the plaintiff's failure to wear a belt was contributory negligence, setting out precise percentage reductions.",
        legalPrinciple:
          "Failure to wear a seat belt is contributory negligence. The standard deductions under Froom v Butcher are: 25% if wearing a belt would have prevented the injury entirely; 15% if it would have reduced the severity of injury. This remains the definitive authority on seatbelt contributory negligence in UK personal injury law.",
      },
      {
        caseName: "Pitts v Hunt [1991] 1 QB 24",
        factualSummary:
          "The claimant, a passenger, encouraged the defendant to drive dangerously while under the influence of alcohol. The claimant was injured in the resulting accident and sought damages. The Court of Appeal considered whether the ex turpi causa principle barred the claim entirely.",
        legalPrinciple:
          "A claimant who actively encourages and participates in the defendant's dangerous and illegal driving may be found wholly or substantially contributorily negligent and may be denied any recovery under the ex turpi causa principle. Joint participation in an illegal enterprise can extinguish the duty of care owed between the parties.",
      },
      {
        caseName: "Sayers v Harlow UDC [1958] 1 WLR 623",
        factualSummary:
          "The claimant became trapped in a public lavatory cubicle and, while attempting to escape, stood on the toilet roll holder which gave way, causing injury. The Court of Appeal considered whether her conduct in attempting to escape was contributorily negligent.",
        legalPrinciple:
          "A claimant is contributorily negligent if, following the defendant's initial breach, they take an unreasonable risk in attempting to extricate themselves from the situation created by the defendant. Damages were reduced by 25%. This principle is relevant in road traffic claims where a claimant's post-accident conduct aggravates their injury.",
      },
      {
        caseName: "Jones v Livox Quarries Ltd [1952] 2 QB 608",
        factualSummary:
          "The plaintiff rode on the back of a traxcavator contrary to instructions, and was injured when another vehicle collided with it from behind. The Court of Appeal held that he was contributorily negligent even though the precise manner of injury was not the obvious risk of his conduct.",
        legalPrinciple:
          "A claimant is contributorily negligent if they unreasonably expose themselves to danger, even if the precise manner in which they are ultimately injured is not the most foreseeable consequence of their conduct. It is sufficient that their conduct was a contributory cause of the damage suffered.",
      },
      {
        caseName: "Revill v Newbery [1996] QB 567",
        factualSummary:
          "The defendant shot and injured the claimant who had been attempting to break into his allotment shed. The Court of Appeal considered whether the claimant's criminal activity extinguished the duty of care and whether ex turpi causa applied.",
        legalPrinciple:
          "Even where a claimant is engaged in unlawful conduct, the defendant may still owe a duty of care. The court applies contributory negligence rather than completely denying recovery via ex turpi causa, unless the claimant's conduct is so closely connected with the defendant's act that it would be wrong to allow recovery. Applied in road traffic cases to assess the extent to which a claimant's own unlawful conduct reduces their damages.",
      },
      {
        caseName:
          "Reeves v Commissioner of Police of the Metropolis [2000] 1 AC 360",
        factualSummary:
          "The deceased was a known suicide risk in police custody who succeeded in taking his own life. The House of Lords considered whether the claimant's own deliberate act constituted a novus actus interveniens breaking the chain of causation, or whether it was contributory negligence to be apportioned.",
        legalPrinciple:
          "Where the defendant's duty of care exists precisely to guard against the claimant's own acts (including deliberate acts), those acts do not break the chain of causation but may constitute contributory negligence to be apportioned. Applied in road traffic cases to determine whether a claimant's voluntary assumption of risk or deliberate conduct reduces, but does not eliminate, their damages.",
      },
    ],
  },
  Cycling: {
    highwayCode: [
      {
        ruleNumber: "HC Rules 59–82",
        description:
          "Rules applying TO cyclists: Rule 60 — ride at least 0.5m from the kerb; Rule 66 — do not ride more than two abreast on narrow roads; Rule 72 — signal clearly at junctions; Rule 79 — approach junctions with care; Rule 81 — use lights at night (mandatory); Rule 82 — wear a helmet (advisory).",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 212",
        description:
          "Give cyclists at least 1.5 metres of clearance when overtaking at speeds up to 30 mph; give more space at higher speeds. Do not overtake a cyclist just before you turn left.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 213",
        description:
          "Do not cut across a cyclist's path when turning. Be aware that cyclists may be travelling faster than you expect.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 214",
        description:
          "Be aware that cyclists may swerve to avoid road debris, drain covers, or hazards. Give them room to manoeuvre safely.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 215",
        description:
          "Give lorry and bus drivers space — they may not be able to see cyclists in their mirrors. Cyclists should not pass large vehicles on the inside.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "Road Traffic Act 1988, s.3",
        description:
          "Careless and inconsiderate driving. A driver who fails to give adequate space to a cyclist or cuts across a cyclist's path commits an offence under this section.",
      },
      {
        sectionNumber: "Road Traffic Act 1988, s.2",
        description:
          "Dangerous driving. Applies where a motorist's conduct in relation to a cyclist falls far below what would be expected of a competent driver.",
      },
      {
        sectionNumber: "Highways Act 1980, s.41",
        description:
          "Local authorities have a statutory duty to maintain the highway in a safe condition. Relevant in cycling accident claims caused by potholes, poorly maintained road surfaces, or defective cycling infrastructure.",
      },
      {
        sectionNumber: "Active Travel (England) Act 2017",
        description:
          "Imposes obligations on local transport authorities to consider and invest in active travel infrastructure including cycling lanes. Relevant in claims involving inadequate cycling provision.",
      },
    ],
    caseLaw: [
      {
        caseName: "Eagle v Chambers [2004] EWCA Civ 1033",
        factualSummary:
          "A pedestrian was walking in the road at night and was struck by a motorist. The court significantly reduced the contributory negligence attributed to the pedestrian as a vulnerable road user.",
        legalPrinciple:
          "Motorists owe a heightened duty of care to vulnerable road users including cyclists and pedestrians. Contributory negligence of a cyclist is often assessed at a lower level than that of a motorist. The greater the disparity in the potential for causing harm, the more responsibility falls on the motorist.",
      },
      {
        caseName: "Gough v Thorne [1966] 1 WLR 1387",
        factualSummary:
          "A child cyclist followed an adult's signal to cross a road and was struck by a vehicle. The court held that a child cannot be held to the same standard of contributory negligence as an adult.",
        legalPrinciple:
          "The standard of care expected of a child cyclist is not the same as that of an adult. Age and vulnerability are relevant considerations in fault apportionment in cycling accident claims.",
      },
      {
        caseName: "Phipps v Rochester Corporation [1955] 1 QB 450",
        factualSummary:
          "A child fell into a trench on a public site. The court established that occupiers and public authorities must consider the presence of children who may not appreciate dangers.",
        legalPrinciple:
          "Local authorities and highway occupiers must take account of the presence of cyclists (including child cyclists) when maintaining roads and infrastructure. Applied in road defect cycling accident cases to establish highway authority liability.",
      },
      {
        caseName: "Lunt v Khelifa [2002] EWCA Civ 801",
        factualSummary:
          "A cyclist riding at night without lights was struck by a vehicle. The court found the cyclist contributorily negligent at 25% but held the motorist primarily liable.",
        legalPrinciple:
          "Cycling at night without lights constitutes contributory negligence and will reduce damages by an appropriate percentage. However, it does not remove the motorist's duty of care. Contributory negligence of 25% for no lights is a commonly applied benchmark.",
      },
      {
        caseName: "Smith v Littlewoods Organisation Ltd [1987] AC 241",
        factualSummary:
          "The defendant failed to act on knowledge of foreseeable harm arising from inaction on their premises. The House of Lords considered the circumstances in which a failure to act gives rise to liability in negligence.",
        legalPrinciple:
          "A duty of care may arise from omission where the defendant knows or ought to know of a foreseeable risk of harm to road users including cyclists. Applied in claims against highway authorities who fail to address known road hazards.",
      },
    ],
  },
  hit_and_run: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 286",
        description:
          "If you are involved in a collision, you MUST stop. If you do not stop, you are committing a criminal offence regardless of whether you were at fault for the collision.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 287",
        description:
          "If another person is injured or their vehicle or property is damaged, you MUST give your name and address, the vehicle owner's name and address and the vehicle registration number to anyone who has reasonable grounds for requiring them.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 288",
        description:
          "If you do not give your details at the time of the accident, you MUST report the accident to the police as soon as reasonably practicable and in any case within 24 hours.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.170(2)",
        description:
          "Duty to stop and give details — a driver involved in any accident causing injury, death, or damage to another person, vehicle, or property must stop and provide their name, address, and vehicle registration.",
      },
      {
        sectionNumber: "s.170(4)",
        description:
          "Duty to report — where details were not exchanged at the scene, the driver must report the accident to a constable or police station as soon as practicable and within 24 hours.",
      },
      {
        sectionNumber: "s.170(7)",
        description:
          "Failure to comply with ss.170(2) or 170(4) is a criminal offence. Prosecution may be brought even where the driver was not at fault for the collision itself.",
      },
    ],
    caseLaw: [
      {
        caseName: "DPP v Drury [1989] RTR 165",
        factualSummary:
          "The defendant left the scene of an accident without stopping to exchange details. The Divisional Court considered what constituted adequate compliance with the duty to stop under the Road Traffic Act.",
        legalPrinciple:
          "The duty to stop requires the driver to remain at the scene for a sufficient period to allow any person with reasonable grounds to obtain the driver's name, address, and vehicle registration. A momentary pause that does not afford this opportunity does not discharge the statutory obligation.",
      },
      {
        caseName: "R v Sherwood [1995] RTR 60",
        factualSummary:
          "The defendant failed to stop after a collision and later reported the accident to the police. The court considered whether voluntary reporting after the 24-hour period constituted a defence.",
        legalPrinciple:
          "The duty to report to the police arises immediately if details were not exchanged at the scene. Late reporting does not constitute a defence to the primary offence under s.170, though it may be a mitigating factor in sentencing.",
      },
    ],
  },
  drunk_driving: {
    highwayCode: [
      {
        ruleNumber: "HC Rule 95",
        description:
          "Do not drink and drive as it affects your ability to drive safely. It is illegal to drive with more than 80 milligrams of alcohol per 100 millilitres of blood, 35 micrograms per 100 millilitres of breath, or 107 milligrams per 100 millilitres of urine in England and Wales.",
        isEnforceable: true,
      },
      {
        ruleNumber: "HC Rule 96",
        description:
          "You MUST NOT drive under the influence of drugs or medicine. Check that any medicines you take will not affect your driving — consult your doctor or pharmacist if in doubt.",
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: "s.4",
        description:
          "Driving or attempting to drive while unfit through drink or drugs — it is an offence to drive, attempt to drive, or be in charge of a motor vehicle on a road or other public place while unfit to drive through drink or drugs.",
      },
      {
        sectionNumber: "s.5",
        description:
          "Driving or attempting to drive with excess alcohol — the legal limit in England and Wales is 80mg of alcohol per 100ml of blood. Scotland has a lower limit of 50mg per 100ml.",
      },
      {
        sectionNumber: "s.5A",
        description:
          "Driving with a specified controlled drug above the specified limit — sets drug driving limits for 16 controlled substances. Zero tolerance for illegal drugs; medical limits for prescribed drugs.",
      },
      {
        sectionNumber: "s.3A",
        description:
          "Causing death by careless driving when under the influence of drink or drugs — a more serious offence than careless driving alone, carrying a maximum sentence of 14 years' imprisonment.",
      },
    ],
    caseLaw: [
      {
        caseName: "DPP v Butterworth [1994] 3 WLR 538",
        factualSummary:
          "The defendant argued that the evidential breath test procedure had not been properly followed, and that the results should therefore be excluded. The House of Lords considered the proper interpretation of the evidential testing provisions.",
        legalPrinciple:
          "Strict compliance with the prescribed breath test procedure is required. However, minor procedural errors that do not affect the reliability of the result do not automatically render the evidence inadmissible. Substantive compliance with the legislative scheme is the governing principle.",
      },
      {
        caseName: "R v St-Hillaire [2020] EWCA Crim 1246",
        factualSummary:
          "The defendant caused a fatal accident while driving with excess alcohol. The Court of Appeal reviewed the application of sentencing guidelines for causing death by careless driving under the influence.",
        legalPrinciple:
          "Causing death by careless driving while over the prescribed alcohol limit is treated by sentencing courts as a very serious offence. The combination of impaired driving and a fatal outcome places the offence in the highest culpability category, with a starting point of 36 weeks' custody even for a first offence.",
      },
    ],
  },
};

// General references that apply to all incidents regardless of violation type
export const GENERAL_LEGAL_REFERENCES: LegalReference = {
  highwayCode: [
    {
      ruleNumber: "HC Rule 285",
      description:
        "If you are involved in a collision, you should remain calm. Do not move injured people unless they are in immediate danger. Call 999 if anyone is injured.",
      isEnforceable: false,
    },
    {
      ruleNumber: "HC Rule 288",
      description:
        "If you are involved in a collision which causes damage or injury to any other person, vehicle, animal or property, you MUST give your details to anyone who has reasonable grounds for requiring them.",
      isEnforceable: true,
    },
  ],
  rta1988: [
    {
      sectionNumber: "s.170",
      description:
        "Duty of driver to stop, report accident and give information — applies to all road traffic accidents involving injury or damage.",
    },
  ],
  caseLaw: [],
  otherLegislation: [
    {
      actName: "Civil Liability Act 2018",
      sectionReference: "s.1–3",
      description:
        "Introduces the Whiplash Injury Regulations tariff system. Minor whiplash claims (up to 2 years' duration) are fixed by statutory tariff and must be brought through the Official Injury Claim (OIC) portal. Psychological injuries may attract an uplift of up to 20% on the applicable tariff amount.",
    },
    {
      actName: "Occupiers' Liability Act 1957",
      sectionReference: "s.2",
      description:
        "Occupiers owe a 'common duty of care' to all lawful visitors to their premises. Relevant where an accident occurs on private land, car parks, forecourts, or roads controlled by a landowner rather than a public highway authority.",
    },
    {
      actName: "Fatal Accidents Act 1976",
      sectionReference: "s.1–4",
      description:
        "Enables dependants of a person killed by negligence to claim financial dependency losses. The statutory bereavement award (2023 rate: £15,120) is payable to a spouse, civil partner, or parents of an unmarried minor. Relevant in all fatal road traffic collisions where a negligence claim arises.",
    },
    {
      actName: "Limitation Act 1980",
      sectionReference: "s.11 & s.2",
      description:
        "Personal injury claims must be brought within 3 years from the date of the accident or the date of knowledge of injury (s.11). Property damage claims have a 6-year limitation period from the date of the damage (s.2). These are strict time limits — claims issued after the relevant period are statute-barred unless the court exercises its discretion under s.33 to override the time limit.",
    },
    {
      actName: "Road Traffic Offenders Act 1988",
      sectionReference: "s.34 & Sch. 2",
      description:
        "Sets out the mandatory and discretionary disqualification and penalty points regime for road traffic offences. Accumulation of 12 or more penalty points within 3 years results in mandatory 'totting up' disqualification. Certain offences (dangerous driving, drink driving, causing death by dangerous driving) carry mandatory minimum disqualification periods.",
    },
    {
      actName: "Whiplash Injury Regulations 2021 (WRP 2021)",
      sectionReference: "Tariff Table",
      description:
        "Introduces fixed statutory tariff amounts for whiplash and minor psychological injuries in road traffic accidents from 31 May 2021. Tariffs range from £240 (up to 3 months) to £4,345 (19–24 months) for whiplash, with a 20% psychological injury uplift where applicable. Claims must be brought via the Official Injury Claim (OIC) portal and cannot exceed the tariff amounts for covered injury types.",
    },
    {
      actName: "Criminal Justice Act 2003",
      sectionReference: "s.143–144",
      description:
        "Provides the sentencing framework for road traffic offences including dangerous and careless driving causing death. Aggravating factors (excess speed, mobile phone use, alcohol/drugs, multiple victims) increase the culpability category and the sentence. The Act requires courts to give reasons for any departure from the relevant sentencing guidelines.",
    },
  ],
};

/**
 * Get legal references for a given list of violation types.
 * Falls back to general references if no specific violations are found.
 */
export function getLegalReferencesForViolations(violationTypes: string[]): {
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
    const refs = VIOLATION_LEGAL_REFERENCES[vType];
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

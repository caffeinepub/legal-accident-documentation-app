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

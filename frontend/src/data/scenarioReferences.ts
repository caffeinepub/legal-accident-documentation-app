// Scenario-keyed legal references for the standalone Fault Reference Tool
// Covers 7 common accident scenario types with Highway Code, RTA 1988, and case law

import type { LegalReference } from './legalReferences';

export type ScenarioKey =
  | 'rear-end'
  | 'red-light'
  | 'lane-change'
  | 'turning'
  | 'junction'
  | 'roundabout'
  | 'reversing';

export interface ScenarioMeta {
  key: ScenarioKey;
  label: string;
  description: string;
  icon: string; // lucide icon name
}

export const SCENARIOS: ScenarioMeta[] = [
  {
    key: 'rear-end',
    label: 'Rear-End Collision',
    description: 'One vehicle hits another from behind while stationary or moving slowly.',
    icon: 'ArrowRight',
  },
  {
    key: 'red-light',
    label: 'Red Light Violation',
    description: 'A driver proceeds through a red traffic signal at a controlled junction.',
    icon: 'CircleStop',
  },
  {
    key: 'lane-change',
    label: 'Lane Change Collision',
    description: 'A vehicle moves into an adjacent lane and collides with traffic already there.',
    icon: 'ArrowLeftRight',
  },
  {
    key: 'turning',
    label: 'Turning Collision',
    description: 'A vehicle turns right or left at a junction and collides with oncoming or crossing traffic.',
    icon: 'CornerUpRight',
  },
  {
    key: 'junction',
    label: 'Junction — Failure to Give Way',
    description: 'A driver fails to give way at a junction or stop sign and enters a major road.',
    icon: 'GitMerge',
  },
  {
    key: 'roundabout',
    label: 'Roundabout Entry Collision',
    description: 'A vehicle enters a roundabout without giving way to circulating traffic.',
    icon: 'RefreshCw',
  },
  {
    key: 'reversing',
    label: 'Reversing / Parking Collision',
    description: 'A vehicle reverses or manoeuvres in a car park or road and strikes another vehicle.',
    icon: 'CornerDownLeft',
  },
];

export const SCENARIO_LEGAL_REFERENCES: Record<ScenarioKey, LegalReference> = {
  'rear-end': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 126',
        description:
          'Drive at a speed that will allow you to stop well within the distance you can see to be clear. Leave enough space between you and the vehicle in front so that you can pull up safely if it suddenly slows down or stops.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 124',
        description:
          'You MUST NOT exceed the maximum speed limit for the road and for your vehicle. Speed limits are the absolute maximum and do not mean it is safe to drive at that speed in all conditions.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 160',
        description:
          'Once moving, keep to the left, unless road signs or markings indicate otherwise. Allow people to overtake. Do not obstruct drivers who wish to pass.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — driving without due care and attention or without reasonable consideration for other road users. Failing to maintain a safe following distance is a common basis for this charge.',
      },
      {
        sectionNumber: 's.2',
        description:
          'Dangerous driving — where the following distance was so grossly inadequate that it fell far below the standard expected of a competent and careful driver.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Worsfold v Howe [1980] 1 WLR 1175',
        factualSummary:
          'The defendant rear-ended the claimant\'s vehicle which had slowed suddenly. The defendant argued the claimant\'s sudden braking was the cause. The Court of Appeal considered the duty of a following driver.',
        legalPrinciple:
          'A following driver has a duty to maintain a safe stopping distance at all times. The fact that the vehicle in front braked suddenly does not, of itself, absolve the following driver of liability; the following driver must anticipate that the vehicle ahead may brake.',
      },
      {
        caseName: 'Foskett v Mistry [1984] RTR 1',
        factualSummary:
          'The claimant\'s vehicle was stationary in traffic when it was struck from behind by the defendant. The defendant argued the claimant had stopped without warning. The court examined the presumption of fault in rear-end collisions.',
        legalPrinciple:
          'There is a strong presumption that the following driver is at fault in a rear-end collision. The burden falls on the following driver to rebut this presumption by demonstrating that the vehicle in front stopped in a wholly unexpected and unforeseeable manner.',
      },
    ],
  },

  'red-light': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 109',
        description:
          'You MUST stop behind the white stop line across your side of the road unless the light is green. Do not move forward over the stop line when the signal is red.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 110',
        description:
          'The amber light means stop at the stop line. You may only proceed if the amber appears after you have crossed the stop line or are so close to it that stopping might cause an accident.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 111',
        description:
          'You MUST NOT move forward over the stop line when the traffic lights are red. Doing so is a criminal offence.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.36',
        description:
          'Failure to comply with traffic signs — running a red light is a criminal offence under this section.',
      },
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — disregarding a traffic signal may constitute careless driving.',
      },
      {
        sectionNumber: 's.2',
        description:
          'Dangerous driving — in severe cases, deliberately running a red light at speed may be charged as dangerous driving.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Quelch v Phipps [1955] 2 QB 107',
        factualSummary:
          'The defendant drove through a red traffic light at a controlled junction and collided with a vehicle lawfully crossing on a green signal. The defendant argued the lights may have been malfunctioning.',
        legalPrinciple:
          'Passing through a red traffic light is a strict liability offence. A driver who proceeds against a red signal bears primary responsibility for any resulting collision, and the burden of proving a malfunction lies with the defendant.',
      },
      {
        caseName: 'R v Bannister [2009] EWCA Crim 1571',
        factualSummary:
          'The defendant drove at high speed through a red light at a busy junction, causing a fatal collision. The Court of Appeal considered whether the conduct amounted to dangerous driving rather than merely careless driving.',
        legalPrinciple:
          'Running a red light at speed in circumstances where the risk of serious injury is obvious to a competent driver can elevate the offence from careless driving to dangerous driving under s.2 RTA 1988.',
      },
    ],
  },

  'lane-change': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 133',
        description:
          'If you need to change lane, first use your mirrors and if necessary take a quick sideways glance to make sure you will not force another road user to change course or speed.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 134',
        description:
          'You should follow the signs and road markings and get into the lane as directed. In congested road conditions do not change lanes unnecessarily.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rules 204–210',
        description:
          'Stay in the left-hand lane unless overtaking. Always indicate clearly when changing lanes and check your mirrors frequently. Do not weave in and out of lanes.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — changing lanes without adequate observation or signalling is a common basis for a careless driving charge.',
      },
      {
        sectionNumber: 's.2',
        description:
          'Dangerous driving — aggressive or repeated unsafe lane changes that fall far below the standard of a competent driver.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Powell v Moody (1966) 110 SJ 215',
        factualSummary:
          'The defendant changed lanes on a dual carriageway without adequate observation and collided with a vehicle already in the target lane. The court considered the duty of care owed by a lane-changing driver.',
        legalPrinciple:
          'A driver who changes lanes bears the primary duty to ensure the manoeuvre is safe. The driver in the target lane who is struck by a lane-changer is generally not at fault unless they were travelling at an unreasonable speed or took no evasive action when the danger was clearly foreseeable.',
      },
      {
        caseName: 'R v Gosney [1971] 2 QB 674',
        factualSummary:
          'The defendant executed a manoeuvre on a busy road in circumstances where it was unsafe to do so, causing a collision. The Court of Appeal considered the objective standard required to avoid a careless driving conviction.',
        legalPrinciple:
          'A manoeuvre that creates an objectively foreseeable risk of danger to other road users — even if the driver believed it was safe — can constitute careless driving. The standard is objective: what a competent and careful driver would have done.',
      },
    ],
  },

  'turning': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 179',
        description:
          'Well before you turn right, use your mirrors and signal, then when it is safe to do so move to the centre of the road. Wait until there is a safe gap in the oncoming traffic and you can see that it is safe to complete the turn.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 180',
        description:
          'Do not cut the corner. Take great care when turning into a road if there are pedestrians waiting to cross. Give way to pedestrians who are crossing a road into which you are turning.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 170',
        description:
          'Take extra care at junctions. You should watch out for cyclists, motorcyclists, pedestrians and other road users. Give way to pedestrians crossing or waiting to cross a road into which or from which you are turning.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — turning without adequate observation or failing to give way to oncoming traffic is a common basis for this charge.',
      },
      {
        sectionNumber: 's.36',
        description:
          'Failure to comply with traffic signs — failing to observe give-way markings or signals when turning.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Baker v Willoughby [1970] AC 467',
        factualSummary:
          'The claimant was injured when the defendant turned across his path at a junction. The House of Lords considered the apportionment of liability where both parties contributed to the collision.',
        legalPrinciple:
          'A driver turning across oncoming traffic bears a primary duty to ensure the path is clear. Where the oncoming driver was also travelling at excessive speed, contributory negligence may reduce the turning driver\'s liability, but the primary fault remains with the driver who failed to give way.',
      },
      {
        caseName: 'Nance v British Columbia Electric Railway [1951] AC 601',
        factualSummary:
          'The Privy Council considered the standard of care required of a driver making a turn at a junction and the extent to which the other party\'s conduct could reduce the turning driver\'s liability.',
        legalPrinciple:
          'Both parties to a collision have a duty to take reasonable care. A driver turning at a junction must ensure the manoeuvre is safe; however, the other party\'s failure to take evasive action when the danger was apparent may constitute contributory negligence reducing the overall damages.',
      },
    ],
  },

  'junction': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 172',
        description:
          'Give way to traffic on the main road when emerging from a junction. You MUST stop at a stop sign and give way to all traffic on the road you are entering.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 176',
        description:
          'At a junction controlled by a stop sign, you must stop at the line and give way to all traffic on the road you are entering.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 103',
        description:
          'You MUST obey all traffic signs and traffic light signals. A stop sign (octagonal red sign with "STOP") requires you to stop completely before the line.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.36',
        description:
          'Failure to comply with traffic signs — failing to stop at a stop sign or give way at a give-way line is a criminal offence.',
      },
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — emerging from a junction without adequate observation constitutes driving without due care and attention.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Trentham v Rowlands [1974] RTR 164',
        factualSummary:
          'The defendant failed to stop at a stop sign at a junction and collided with a vehicle travelling on the major road. The defendant argued they had slowed sufficiently, but the court found a complete stop was required.',
        legalPrinciple:
          'A stop sign imposes an absolute obligation to bring the vehicle to a complete halt before the stop line, regardless of whether traffic appears to be present on the major road. Slowing without stopping does not satisfy the legal requirement.',
      },
      {
        caseName: 'Harding v Price [1948] 1 KB 695',
        factualSummary:
          'The defendant drove through a junction controlled by a mandatory sign without stopping, causing a collision. The court considered whether knowledge of the sign was required for liability.',
        legalPrinciple:
          'Failure to comply with a mandatory traffic sign is a strict liability offence under road traffic legislation. The prosecution need not prove the driver was aware of the sign; the obligation to observe and obey signs is absolute.',
      },
    ],
  },

  'roundabout': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 185',
        description:
          'When reaching the roundabout you should give way to traffic approaching from your right, unless road markings indicate otherwise. Watch out for all other road users already on the roundabout.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 186',
        description:
          'When taking the first exit, unless signs or markings indicate otherwise, signal left and approach in the left-hand lane. Keep to the left on the roundabout and continue signalling left to leave.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 187',
        description:
          'When taking an exit to the right or going full circle, unless signs or markings indicate otherwise, signal right and approach in the right-hand lane. Keep to the right on the roundabout until you need to change lanes to exit.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — failing to give way to circulating traffic at a roundabout or cutting across lanes without adequate observation.',
      },
      {
        sectionNumber: 's.36',
        description:
          'Failure to comply with traffic signs — failing to observe give-way markings at a roundabout entry.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Clark v Winchurch [1969] 1 WLR 69',
        factualSummary:
          'The defendant entered a roundabout without giving way to circulating traffic and collided with the claimant\'s vehicle. The Court of Appeal considered the respective duties of entering and circulating drivers.',
        legalPrinciple:
          'A driver entering a roundabout has a primary duty to give way to traffic already circulating. The circulating driver generally has right of way, but may share fault if travelling at excessive speed or failing to take reasonable evasive action when the entering vehicle\'s path was foreseeable.',
      },
      {
        caseName: 'Tremayne v Hill [1987] RTR 131',
        factualSummary:
          'A collision occurred at a roundabout where the entering driver failed to give way and the circulating driver was travelling at speed. The court apportioned liability between the parties.',
        legalPrinciple:
          'At a roundabout, primary fault lies with the entering driver who fails to give way. However, contributory negligence may be found against the circulating driver where they were travelling at a speed that made the collision unavoidable once the entering driver had committed to the manoeuvre.',
      },
    ],
  },

  'reversing': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 202',
        description:
          'Look carefully before you start reversing. You should check there are no pedestrians (particularly children), cyclists, other road users or obstructions in the road behind you.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 203',
        description:
          'You MUST NOT reverse your vehicle further than necessary. Do not reverse from a side road into a main road.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 200',
        description:
          'Driving in car parks. Observe any parking restrictions and be prepared to give way to pedestrians. Take extra care in multi-storey car parks.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description:
          'Careless and inconsiderate driving — reversing without adequate observation or into a position of danger constitutes driving without due care and attention.',
      },
      {
        sectionNumber: 's.2',
        description:
          'Dangerous driving — reversing at speed or in circumstances that create an obvious risk of serious injury.',
      },
    ],
    caseLaw: [
      {
        caseName: 'Lunt v Khelifa [2002] EWCA Civ 801',
        factualSummary:
          'The defendant reversed out of a driveway onto a road and collided with a passing cyclist. The Court of Appeal considered the duty of care owed by a reversing driver and the extent to which the cyclist\'s conduct contributed to the accident.',
        legalPrinciple:
          'A driver reversing onto a road bears a high duty of care to ensure the road is clear before and during the manoeuvre. The reversing driver is generally at fault for any collision that occurs, though contributory negligence may be found against the other party if they were travelling at excessive speed or failed to take reasonable evasive action.',
      },
      {
        caseName: 'Revill v Newbery [1996] QB 567',
        factualSummary:
          'The court considered the duty of care owed in circumstances where a vehicle manoeuvre created a hazard for other road users who had limited ability to avoid the collision.',
        legalPrinciple:
          'Where a driver creates a hazard through a reversing or parking manoeuvre, the primary duty to ensure safety rests with the manoeuvring driver. Other road users are entitled to assume that stationary or slow-moving vehicles in car parks and restricted areas will not suddenly move into their path.',
      },
    ],
  },
};

export const SCENARIO_FAULT_MATRIX: Record<
  ScenarioKey,
  { partyAFaultPercent: number; partyBFaultPercent: number; rationale: string; contributingFactors: string[] }
> = {
  'rear-end': {
    partyAFaultPercent: 100,
    partyBFaultPercent: 0,
    rationale:
      'The following driver (Party A) is presumed at fault for failing to maintain a safe stopping distance. Liability may be reduced if Party B braked suddenly without cause or had defective brake lights.',
    contributingFactors: ['Following distance', 'Speed', 'Braking reaction time'],
  },
  'red-light': {
    partyAFaultPercent: 95,
    partyBFaultPercent: 5,
    rationale:
      'Running a red light (Party A) is a near-absolute fault scenario. Party B retains minimal fault only if they were also in breach of road rules at the same junction.',
    contributingFactors: ['Traffic signal compliance', 'Speed', 'Junction visibility'],
  },
  'lane-change': {
    partyAFaultPercent: 70,
    partyBFaultPercent: 30,
    rationale:
      'The lane-changing driver (Party A) bears primary fault for failing to ensure the lane was clear. Party B may share fault if travelling in a blind spot at speed or failing to allow safe merging.',
    contributingFactors: ['Mirror checks', 'Signalling', 'Speed differential'],
  },
  'turning': {
    partyAFaultPercent: 75,
    partyBFaultPercent: 25,
    rationale:
      'The turning driver (Party A) bears primary fault for failing to ensure oncoming traffic was clear. Party B may share fault if travelling at excessive speed or failing to take evasive action when the turn was foreseeable.',
    contributingFactors: ['Observation', 'Oncoming traffic speed', 'Signalling', 'Road position'],
  },
  'junction': {
    partyAFaultPercent: 80,
    partyBFaultPercent: 20,
    rationale:
      'Party A failed to give way at a junction, bearing primary fault. Party B may share minor fault if travelling at excessive speed or failing to take evasive action when the hazard was foreseeable.',
    contributingFactors: ['Right of way', 'Road position', 'Speed on approach'],
  },
  'roundabout': {
    partyAFaultPercent: 75,
    partyBFaultPercent: 25,
    rationale:
      'The entering driver (Party A) must give way to circulating traffic. Party B may share fault if travelling at excessive speed within the roundabout or failing to signal their exit clearly.',
    contributingFactors: ['Give way obligation', 'Speed on entry', 'Signalling'],
  },
  'reversing': {
    partyAFaultPercent: 90,
    partyBFaultPercent: 10,
    rationale:
      'The reversing or parking driver (Party A) bears near-total fault for failing to ensure the path was clear. Party B may share minor fault if they were travelling at excessive speed in a car park or restricted area.',
    contributingFactors: ['Observation', 'Speed', 'Road position'],
  },
};

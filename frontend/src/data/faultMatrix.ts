// Insurer-style fault matrix for common road incident scenarios

export interface FaultMatrixEntry {
  id: string;
  scenarioTitle: string;
  contributingFactors: string[];
  partyAFaultPercent: number;
  partyBFaultPercent: number;
  rationale: string;
  relatedViolationTypes?: string[];
}

export const faultMatrix: FaultMatrixEntry[] = [
  {
    id: 'rear-end',
    scenarioTitle: 'Rear-End Collision',
    contributingFactors: ['Following distance', 'Speed', 'Braking reaction time'],
    partyAFaultPercent: 100,
    partyBFaultPercent: 0,
    rationale:
      'The following driver (Party A) is presumed at fault for failing to maintain a safe stopping distance. Liability may be reduced if Party B braked suddenly without cause or had defective brake lights.',
    relatedViolationTypes: ['speeding'],
  },
  {
    id: 'junction-failure-to-give-way',
    scenarioTitle: 'Junction — Failure to Give Way',
    contributingFactors: ['Right of way', 'Road position', 'Speed on approach'],
    partyAFaultPercent: 80,
    partyBFaultPercent: 20,
    rationale:
      'Party A failed to give way at a junction, bearing primary fault. Party B may share minor fault if travelling at excessive speed or failing to take evasive action when the hazard was foreseeable.',
    relatedViolationTypes: ['Stop Sign'],
  },
  {
    id: 'lane-change',
    scenarioTitle: 'Lane Change Collision',
    contributingFactors: ['Mirror checks', 'Signalling', 'Speed differential'],
    partyAFaultPercent: 70,
    partyBFaultPercent: 30,
    rationale:
      'The lane-changing driver (Party A) bears primary fault for failing to ensure the lane was clear. Party B may share fault if travelling in a blind spot at speed or failing to allow safe merging.',
    relatedViolationTypes: [],
  },
  {
    id: 'red-light',
    scenarioTitle: 'Red Light Violation',
    contributingFactors: ['Traffic signal compliance', 'Speed', 'Junction visibility'],
    partyAFaultPercent: 95,
    partyBFaultPercent: 5,
    rationale:
      'Running a red light (Party A) is a near-absolute fault scenario. Party B retains minimal fault only if they were also in breach of road rules at the same junction.',
    relatedViolationTypes: ['Traffic Signal'],
  },
  {
    id: 'roundabout-entry',
    scenarioTitle: 'Roundabout Entry Collision',
    contributingFactors: ['Give way obligation', 'Speed on entry', 'Signalling'],
    partyAFaultPercent: 75,
    partyBFaultPercent: 25,
    rationale:
      'The entering driver (Party A) must give way to circulating traffic. Party B may share fault if travelling at excessive speed within the roundabout or failing to signal their exit clearly.',
    relatedViolationTypes: [],
  },
  {
    id: 'overtaking',
    scenarioTitle: 'Overtaking Collision',
    contributingFactors: ['Visibility', 'Speed', 'Road position', 'Oncoming traffic'],
    partyAFaultPercent: 85,
    partyBFaultPercent: 15,
    rationale:
      'The overtaking driver (Party A) bears primary responsibility for ensuring the manoeuvre is safe. Party B may share fault if they accelerated to prevent the overtake or were travelling at excessive speed.',
    relatedViolationTypes: [],
  },
  {
    id: 'parking-collision',
    scenarioTitle: 'Parking / Reversing Collision',
    contributingFactors: ['Observation', 'Speed', 'Road position'],
    partyAFaultPercent: 90,
    partyBFaultPercent: 10,
    rationale:
      'The reversing or parking driver (Party A) bears near-total fault for failing to ensure the path was clear. Party B may share minor fault if they were travelling at excessive speed in a car park or restricted area.',
    relatedViolationTypes: [],
  },
  {
    id: 'u-turn',
    scenarioTitle: 'Prohibited U-Turn Collision',
    contributingFactors: ['Traffic sign compliance', 'Road position', 'Signalling'],
    partyAFaultPercent: 90,
    partyBFaultPercent: 10,
    rationale:
      'Executing a prohibited U-turn (Party A) places near-total fault on the turning driver. Party B may share minor fault if they failed to take reasonable evasive action when the manoeuvre was visible.',
    relatedViolationTypes: ['U-turn'],
  },
  {
    id: 'pedestrian-crossing',
    scenarioTitle: 'Pedestrian Crossing Incident',
    contributingFactors: ['Crossing signal', 'Speed', 'Pedestrian behaviour'],
    partyAFaultPercent: 80,
    partyBFaultPercent: 20,
    rationale:
      'The driver (Party A) bears primary fault for failing to yield at a pedestrian crossing. The pedestrian (Party B) may share fault if they crossed against a red signal or stepped out without warning.',
    relatedViolationTypes: ['Traffic Signal'],
  },
  {
    id: 'adverse-weather',
    scenarioTitle: 'Adverse Weather — Loss of Control',
    contributingFactors: ['Speed for conditions', 'Tyre condition', 'Following distance'],
    partyAFaultPercent: 70,
    partyBFaultPercent: 30,
    rationale:
      'In adverse weather, both parties have a heightened duty of care. Party A bears primary fault for failing to adjust speed to conditions; Party B may share fault if they also failed to maintain appropriate distance or speed.',
    relatedViolationTypes: ['speeding'],
  },
];

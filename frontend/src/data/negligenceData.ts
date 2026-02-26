// Static UK contributory negligence framework data

export interface FaultSplitScenario {
  id: string;
  title: string;
  description: string;
  partyAPercent: number;
  partyBPercent: number;
}

export interface NegligencePrecedent {
  caseName: string;
  year: string;
  principle: string;
}

export interface NegligenceFramework {
  introduction: string;
  legalBasis: string;
  scenarios: FaultSplitScenario[];
  precedents: NegligencePrecedent[];
}

export const negligenceData: NegligenceFramework = {
  introduction:
    'Contributory negligence is a legal doctrine under UK law that allows courts and insurers to apportion fault between two or more parties involved in an incident. Where a claimant is found to have contributed to their own loss or injury through their own negligence, their damages may be reduced proportionally.',
  legalBasis:
    'The Law Reform (Contributory Negligence) Act 1945 provides the statutory basis for apportioning damages in proportion to each party\'s share of responsibility. Courts assess the relative blameworthiness and causative potency of each party\'s conduct.',
  scenarios: [
    {
      id: 'rear-end-speeding',
      title: 'Rear-End Collision — Speeding Claimant',
      description:
        'Party A rear-ends Party B, but Party B was travelling above the speed limit. Party A bears primary fault for failing to maintain a safe following distance; Party B\'s speed is a contributing factor.',
      partyAPercent: 75,
      partyBPercent: 25,
    },
    {
      id: 'junction-no-seatbelt',
      title: 'Junction Collision — No Seatbelt',
      description:
        'Party A fails to give way at a junction and collides with Party B. Party B was not wearing a seatbelt, increasing their injuries. Fault for the collision rests with Party A; Party B\'s failure to wear a seatbelt reduces their damages.',
      partyAPercent: 75,
      partyBPercent: 25,
    },
    {
      id: 'equal-fault',
      title: 'Mutual Negligence — Equal Fault',
      description:
        'Both parties contributed equally to the incident, for example both failing to observe road markings at an unmarked junction. Damages are split equally between the parties.',
      partyAPercent: 50,
      partyBPercent: 50,
    },
    {
      id: 'red-light-pedestrian',
      title: 'Red Light Violation — Pedestrian Crossing',
      description:
        'Party A runs a red light and strikes Party B (pedestrian) who was crossing on a green signal but was distracted by a mobile phone. Party A bears overwhelming fault; Party B\'s inattention is a minor contributing factor.',
      partyAPercent: 85,
      partyBPercent: 15,
    },
    {
      id: 'lane-change-blind-spot',
      title: 'Lane Change — Blind Spot Failure',
      description:
        'Party A changes lanes without checking mirrors and collides with Party B, who was travelling in Party A\'s blind spot at excessive speed. Both parties share fault.',
      partyAPercent: 60,
      partyBPercent: 40,
    },
    {
      id: 'overtaking-oncoming',
      title: 'Overtaking — Oncoming Vehicle',
      description:
        'Party A overtakes on a bend and collides with Party B travelling in the opposite direction. Party A bears primary fault for the dangerous overtaking manoeuvre.',
      partyAPercent: 90,
      partyBPercent: 10,
    },
  ],
  precedents: [
    {
      caseName: 'Froom v Butcher [1976] QB 286',
      year: '1976',
      principle:
        'Failure to wear a seatbelt constitutes contributory negligence. Where injuries would have been avoided or significantly reduced by wearing a seatbelt, damages may be reduced by 25% (full avoidance) or 15% (partial reduction).',
    },
    {
      caseName: 'Davies v Swan Motor Co [1949] 2 KB 291',
      year: '1949',
      principle:
        'Established the principle that contributory negligence requires both a causal contribution to the accident and a failure to take reasonable care for one\'s own safety. The court must assess both the causative potency and the blameworthiness of each party\'s conduct.',
    },
    {
      caseName: 'Stapley v Gypsum Mines Ltd [1953] AC 663',
      year: '1953',
      principle:
        'The House of Lords confirmed that apportionment of damages under the 1945 Act requires the court to consider what is "just and equitable" having regard to the claimant\'s share in the responsibility for the damage.',
    },
    {
      caseName: 'Owens v Brimmell [1977] QB 859',
      year: '1977',
      principle:
        'A passenger who knowingly accepts a lift from a driver who is drunk may be found contributorily negligent. The court reduced the claimant\'s damages by 20% for voluntarily accepting the risk of injury.',
    },
    {
      caseName: 'Jackson v Murray [2015] UKSC 5',
      year: '2015',
      principle:
        'The Supreme Court confirmed that apportionment of contributory negligence is a matter of judgment for the trial court, and appellate courts should only interfere where the apportionment is plainly wrong. The case involved a child pedestrian struck by a car.',
    },
  ],
};

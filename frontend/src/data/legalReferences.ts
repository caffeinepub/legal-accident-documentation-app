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

export interface LegalReference {
  highwayCode: HighwayCodeReference[];
  rta1988: RTAReference[];
}

// Violation type keys used in the backend
export const VIOLATION_LEGAL_REFERENCES: Record<string, LegalReference> = {
  'Stop Sign': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 103',
        description: 'You MUST obey all traffic signs and traffic light signals. A stop sign (octagonal red sign with "STOP") requires you to stop completely before the line.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 176',
        description: 'At a junction controlled by a stop sign, you must stop at the line and give way to all traffic on the road you are entering.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.36',
        description: 'Failure to comply with traffic signs — it is an offence to fail to comply with the indication given by a traffic sign.',
      },
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — driving without due care and attention or without reasonable consideration for other road users.',
      },
    ],
  },

  'U-turn': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 188',
        description: 'Do not make a U-turn where there is a "No U-turn" sign. You should not make a U-turn unless you can do so safely and without inconveniencing other road users.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 103',
        description: 'You MUST obey all traffic signs, including "No U-turn" signs which are legally enforceable.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.36',
        description: 'Failure to comply with traffic signs — performing a U-turn where prohibited by a traffic sign is a criminal offence.',
      },
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — an unsafe U-turn that endangers other road users may constitute careless driving.',
      },
    ],
  },

  'Traffic Signal': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 109',
        description: 'You MUST stop behind the white stop line across your side of the road unless the light is green. Do not move forward over the stop line when the signal is red.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 110',
        description: 'The amber light means stop at the stop line. You may only proceed if the amber appears after you have crossed the stop line or are so close to it that stopping might cause an accident.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 111',
        description: 'You MUST NOT move forward over the stop line when the traffic lights are red. Doing so is a criminal offence.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.36',
        description: 'Failure to comply with traffic signs — running a red light is a criminal offence under this section.',
      },
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — disregarding a traffic signal may constitute careless driving.',
      },
      {
        sectionNumber: 's.2',
        description: 'Dangerous driving — in severe cases, deliberately running a red light at speed may be charged as dangerous driving.',
      },
    ],
  },

  'speeding': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 124',
        description: 'You MUST NOT exceed the maximum speed limit for the road and for your vehicle. Speed limits are the absolute maximum and do not mean it is safe to drive at that speed in all conditions.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 125',
        description: 'The speed limit is the absolute maximum. You should always drive at a speed that allows you to stop safely, smoothly and promptly.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rule 126',
        description: 'Drive at a speed that will allow you to stop well within the distance you can see to be clear. Leave enough space between you and the vehicle in front.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.89',
        description: 'Speeding — it is an offence to drive a motor vehicle on a road at a speed exceeding the limit imposed for that road.',
      },
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — excessive speed that falls short of dangerous driving may still constitute careless driving.',
      },
      {
        sectionNumber: 's.2',
        description: 'Dangerous driving — driving at a grossly excessive speed that falls far below the standard expected of a competent and careful driver.',
      },
    ],
  },

  'dangerous_driving': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 144',
        description: 'You MUST NOT drive dangerously. Dangerous driving includes driving in a way that falls far below what would be expected of a competent and careful driver.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 148',
        description: 'Safe driving and riding needs concentration. Avoid distractions when driving or riding such as loud music, using a mobile phone, or eating and drinking.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.2',
        description: 'Dangerous driving — driving in a way that falls far below what would be expected of a competent and careful driver, and it would be obvious to a competent and careful driver that driving in that way would be dangerous.',
      },
      {
        sectionNumber: 's.1',
        description: 'Causing death by dangerous driving — where dangerous driving results in the death of another person.',
      },
    ],
  },

  'careless_driving': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 144',
        description: 'You MUST NOT drive without due care and attention, or without reasonable consideration for other road users.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 147',
        description: 'Be considerate. Always drive in a manner that shows consideration for other road users.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — driving on a road or other public place without due care and attention, or without reasonable consideration for other persons using the road.',
      },
      {
        sectionNumber: 's.3A',
        description: 'Causing death by careless driving when under the influence of drink or drugs.',
      },
    ],
  },

  'mobile_phone_use': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 149',
        description: 'You MUST NOT use a hand-held mobile phone, or similar device, when driving or when supervising a learner driver. This applies even when stopped at traffic lights.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 148',
        description: 'Safe driving needs concentration. Avoid distractions when driving, including using a mobile phone.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.41D',
        description: 'Breach of requirements as to mobile telephones — it is an offence to use a hand-held mobile telephone while driving a motor vehicle on a road.',
      },
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — using a mobile phone while driving may constitute driving without due care and attention.',
      },
    ],
  },

  'no_seatbelt': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 99',
        description: 'You MUST wear a seat belt in cars, vans and other goods vehicles if one is fitted. Adults and children over 14 years of age are responsible for ensuring they wear a seat belt.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 100',
        description: 'You MUST ensure that all children under 14 years of age in cars, vans and other goods vehicles wear a seat belt or sit in an approved child restraint.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.14',
        description: 'Seat belts — wearing of seat belts. It is an offence to drive or ride in a motor vehicle without wearing a seat belt where one is fitted.',
      },
      {
        sectionNumber: 's.15',
        description: 'Restriction on carrying children not wearing seat belts in motor vehicles.',
      },
    ],
  },

  'wrong_lane': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 163',
        description: 'Keep to the left unless overtaking. If you are overtaking, you should return to the left-hand lane as soon as it is safe to do so.',
        isEnforceable: false,
      },
      {
        ruleNumber: 'HC Rules 204–210',
        description: 'On motorways, you MUST NOT drive in the right-hand lane if the two left-hand lanes are free, unless overtaking or directed otherwise.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 133',
        description: 'When you change lanes, you should use your mirrors and signal before moving. Make sure it is safe to do so.',
        isEnforceable: false,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.3',
        description: 'Careless and inconsiderate driving — improper lane use that endangers other road users may constitute careless driving.',
      },
      {
        sectionNumber: 's.36',
        description: 'Failure to comply with traffic signs — lane markings and road signs indicating lane restrictions are legally enforceable.',
      },
    ],
  },

  'failed_to_stop': {
    highwayCode: [
      {
        ruleNumber: 'HC Rule 286',
        description: 'If you are involved in a collision, you MUST stop. If you do not stop, you are committing a criminal offence.',
        isEnforceable: true,
      },
      {
        ruleNumber: 'HC Rule 287',
        description: 'If another person is injured, you must give your name and address and the vehicle registration number to anyone who has reasonable grounds for requiring them.',
        isEnforceable: true,
      },
    ],
    rta1988: [
      {
        sectionNumber: 's.170',
        description: 'Duty of driver to stop, report accident and give information or documents — a driver involved in an accident must stop and, if required, give their name and address.',
      },
      {
        sectionNumber: 's.170(4)',
        description: 'Failure to report an accident to the police within 24 hours where injury has occurred is a criminal offence.',
      },
    ],
  },
};

// General references that apply to all incidents regardless of violation type
export const GENERAL_LEGAL_REFERENCES: LegalReference = {
  highwayCode: [
    {
      ruleNumber: 'HC Rule 285',
      description: 'If you are involved in a collision, you should remain calm. Do not move injured people unless they are in immediate danger. Call 999 if anyone is injured.',
      isEnforceable: false,
    },
    {
      ruleNumber: 'HC Rule 288',
      description: 'If you are involved in a collision which causes damage or injury to any other person, vehicle, animal or property, you MUST give your details to anyone who has reasonable grounds for requiring them.',
      isEnforceable: true,
    },
  ],
  rta1988: [
    {
      sectionNumber: 's.170',
      description: 'Duty of driver to stop, report accident and give information — applies to all road traffic accidents involving injury or damage.',
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
} {
  const seenHC = new Set<string>();
  const seenRTA = new Set<string>();
  const highwayCode: HighwayCodeReference[] = [];
  const rta1988: RTAReference[] = [];

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
    }
  }

  return { highwayCode, rta1988 };
}

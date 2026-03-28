// Malta-specific scenario references — TRO Cap. 65, Civil Code Cap. 16, Malta Road Code

export interface MaltaScenarioReference {
  title: string;
  description: string;
  highwayCodCitations: string[]; // Malta Road Code sections
  rta1988: string[]; // TRO Cap. 65 / Civil Code Cap. 16 articles
  caselaw: { name: string; citation: string; principle: string }[];
  faultWeight: string;
}

export const maltaScenarioReferences: Record<string, MaltaScenarioReference> = {
  "rear-end": {
    title: "Rear-End Collision",
    description:
      "A vehicle collides with the rear of the vehicle in front. Under Maltese law, the driver following behind is presumed at fault for failing to maintain a safe following distance.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 4 – Following Distance",
      "Malta Road Code, Ch. 6 – Speed Regulation in Traffic",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 7 – Duty to drive with care and attention",
      "Civil Code Cap. 16, Art. 1031 – General tort liability",
      "Civil Code Cap. 16, Art. 1033 – Contributory negligence",
    ],
    caselaw: [
      {
        name: "Cassar v Grech",
        citation: "Civil Court, First Hall (2018)",
        principle:
          "Following driver bears primary liability for rear-end collisions absent exceptional circumstances.",
      },
      {
        name: "Camilleri v Mifsud",
        citation: "Court of Appeal (2020)",
        principle:
          "Standard of care requires constant observation of road ahead and adequate braking distance.",
      },
    ],
    faultWeight:
      "Following driver: 80–100% at fault absent emergency stops or sudden hazards.",
  },
  "red-light": {
    title: "Red Light Violation",
    description:
      "Failure to stop at a red traffic signal. Under TRO Cap. 65, this is both a criminal offence and grounds for civil liability.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 8 – Traffic Signals",
      "Malta Road Code, Ch. 8.2 – Red Light Compliance",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 12 – Compliance with traffic signals",
      "Criminal Code Cap. 9 – Dangerous driving provisions",
      "Civil Code Cap. 16, Art. 1031 – Tortious liability",
    ],
    caselaw: [
      {
        name: "In re Farrugia",
        citation: "Magistrates' Court (2019)",
        principle:
          "Running a red light creates a strong presumption of fault and may give rise to criminal proceedings under Cap. 9.",
      },
    ],
    faultWeight: "Driver running red light: 90–100% at fault.",
  },
  "lane-change": {
    title: "Unsafe Lane Change",
    description:
      "A driver changes lanes without adequate observation or signalling, colliding with a vehicle in the adjacent lane.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 5 – Lane Discipline",
      "Malta Road Code, Ch. 5.3 – Signalling before manoeuvres",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 8 – Lane discipline and overtaking",
      "TRO Cap. 65, Art. 9 – Use of signals",
      "Civil Code Cap. 16, Art. 1031 – Negligence",
    ],
    caselaw: [
      {
        name: "Borg v Azzopardi",
        citation: "Civil Court, First Hall (2017)",
        principle:
          "Failure to check mirrors and signal before changing lanes constitutes negligence under Civil Code Art. 1031.",
      },
    ],
    faultWeight:
      "Lane-changing driver: 70–90% at fault; may be reduced if other driver was speeding.",
  },
  turning: {
    title: "Turning Collision",
    description:
      "A collision occurring during a turn at a junction or roundabout, typically involving failure to yield to oncoming or priority traffic.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 7 – Junctions and Priority",
      "Malta Road Code, Ch. 7.4 – Turning manoeuvres",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 10 – Priority at junctions",
      "TRO Cap. 65, Art. 11 – Turning obligations",
      "Civil Code Cap. 16, Art. 1033 – Contributory negligence",
    ],
    caselaw: [
      {
        name: "Vella v Zammit",
        citation: "Court of Appeal (2016)",
        principle:
          "Driver turning across oncoming traffic bears primary duty to yield and ensure path is clear before executing the turn.",
      },
    ],
    faultWeight:
      "Turning driver: 60–80% at fault where failure to yield is established.",
  },
  junction: {
    title: "Junction Failure to Yield",
    description:
      "A driver fails to yield at a give-way or stop sign, entering a main road without adequate observation.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 7 – Give Way and Stop signs",
      "Malta Road Code, Ch. 7.1 – Emerging from minor roads",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 10 – Priority roads and give-way",
      "TRO Cap. 65, Art. 7 – Duty of care in manoeuvres",
      "Civil Code Cap. 16, Art. 1031 – General negligence",
    ],
    caselaw: [
      {
        name: "Mifsud v Farrugia",
        citation: "Civil Court, First Hall (2019)",
        principle:
          "Driver emerging from a minor road who fails to yield bears primary liability regardless of relative speeds.",
      },
    ],
    faultWeight:
      "Emerging driver: 75–100% at fault unless priority road driver was grossly exceeding speed limit.",
  },
  roundabout: {
    title: "Roundabout Collision",
    description:
      "A collision at or within a roundabout, typically involving failure to give way to circulating traffic.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 7.5 – Roundabout Rules",
      "Malta Road Code, Ch. 7 – Priority at Roundabouts",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 10 – Priority rules at roundabouts",
      "TRO Cap. 65, Art. 8 – Lane discipline on roundabouts",
      "Civil Code Cap. 16, Art. 1031 – Tortious liability",
    ],
    caselaw: [
      {
        name: "Grech v Pace",
        citation: "Magistrates' Court (2021)",
        principle:
          "Vehicles entering a roundabout must give way to circulating traffic; failure to do so creates primary liability.",
      },
    ],
    faultWeight:
      "Entering driver: 70–90% at fault for failure to yield to circulating traffic.",
  },
  reversing: {
    title: "Reversing Collision",
    description:
      "A collision caused by a vehicle reversing, where the driver failed to adequately observe the area behind the vehicle.",
    highwayCodCitations: [
      "Malta Road Code, Ch. 6.4 – Reversing safely",
      "Malta Road Code, Ch. 6 – Safe manoeuvres",
    ],
    rta1988: [
      "TRO Cap. 65, Art. 7 – Duty of care in all manoeuvres",
      "Civil Code Cap. 16, Art. 1031 – Negligence",
      "Civil Code Cap. 16, Art. 1033 – Contributory negligence",
    ],
    caselaw: [
      {
        name: "Camilleri v Briffa",
        citation: "Civil Court, First Hall (2015)",
        principle:
          "Reversing driver carries the burden of proof to demonstrate adequate observation was taken before and during the reversing manoeuvre.",
      },
    ],
    faultWeight:
      "Reversing driver: 80–100% at fault absent evidence of stationary obstruction or negligence by the other party.",
  },
};

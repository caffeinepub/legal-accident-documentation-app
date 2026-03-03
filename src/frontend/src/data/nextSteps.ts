// Next steps guidance data for post-incident actions

export interface NextStep {
  title: string;
  description: string;
  reference?: string;
}

export interface NextStepsCategory {
  id: string;
  categoryTitle: string;
  icon: string;
  steps: NextStep[];
}

export const nextStepsData: NextStepsCategory[] = [
  {
    id: "immediate-actions",
    categoryTitle: "Immediate Actions",
    icon: "AlertCircle",
    steps: [
      {
        title: "Stop and Stay at the Scene",
        description:
          "You are legally required to stop after any road traffic accident involving injury, damage to another vehicle, or damage to property. Failure to stop is a criminal offence under s.170 Road Traffic Act 1988.",
        reference: "Road Traffic Act 1988, s.170",
      },
      {
        title: "Exchange Details",
        description:
          "Exchange your name, address, vehicle registration number, and insurance details with any other driver involved. If you are the vehicle owner, you must also provide the owner's details if different.",
        reference: "Road Traffic Act 1988, s.170(2)",
      },
      {
        title: "Photograph the Scene",
        description:
          "Take photographs of all vehicles involved, their positions, any damage, road markings, traffic signs, skid marks, and the surrounding environment. Photographs taken immediately are valuable evidence.",
      },
      {
        title: "Note Witnesses",
        description:
          "Obtain the names and contact details of any independent witnesses. Note the time, date, weather conditions, road conditions, and visibility. Write down your account of events as soon as possible while memory is fresh.",
      },
      {
        title: "Seek Medical Attention",
        description:
          "If anyone is injured, call 999 immediately. Even if injuries appear minor, seek medical assessment promptly. Some injuries (e.g. whiplash) may not be immediately apparent. Medical records are important evidence in any subsequent claim.",
        reference: "Emergency Services: 999",
      },
    ],
  },
  {
    id: "reporting-obligations",
    categoryTitle: "Reporting Obligations",
    icon: "FileText",
    steps: [
      {
        title: "Report to the Police",
        description:
          "If anyone is injured and you did not exchange details at the scene, you must report the accident to a police station within 24 hours. You must also produce your insurance certificate within 7 days.",
        reference: "Road Traffic Act 1988, s.170(3)",
      },
      {
        title: "Notify Your Insurer",
        description:
          "You must notify your insurer of any accident, even if you do not intend to make a claim. Most policies require notification within a specified period (often 24–48 hours). Failure to notify may invalidate your cover.",
        reference: "Your insurance policy terms and conditions",
      },
      {
        title: "DVLA Notification",
        description:
          "If the accident results in a vehicle being written off or if you suffer a medical condition affecting your ability to drive, you may need to notify the DVLA. Check your specific circumstances.",
        reference: "DVLA — gov.uk/contact-the-dvla",
      },
      {
        title: "Dashcam and Telematics Data",
        description:
          "If your vehicle is fitted with a dashcam or telematics device, preserve the footage immediately. This data can be crucial evidence. Notify your insurer of its existence; some policies require you to share it.",
      },
    ],
  },
  {
    id: "claims-process",
    categoryTitle: "Claims Process",
    icon: "ClipboardList",
    steps: [
      {
        title: "Personal Injury Claims — Time Limits",
        description:
          "Personal injury claims arising from road traffic accidents must generally be brought within 3 years of the date of the accident (or date of knowledge of injury). Claims involving children must be brought within 3 years of their 18th birthday.",
        reference: "Limitation Act 1980, s.11",
      },
      {
        title: "Property Damage Claims",
        description:
          "Claims for vehicle damage and other property damage must be brought within 6 years of the date of the accident. Contact your insurer promptly to begin the claims process and obtain repair estimates.",
        reference: "Limitation Act 1980, s.2",
      },
      {
        title: "Documentation Required",
        description:
          "Gather: accident report, photographs, witness statements, police report number (if applicable), medical records, repair estimates, receipts for any out-of-pocket expenses, and evidence of loss of earnings if applicable.",
      },
      {
        title: "Pre-Action Protocol",
        description:
          "Before issuing court proceedings, parties must follow the Pre-Action Protocol for Low Value Personal Injury Claims in Road Traffic Accidents (RTA Protocol) for claims up to £25,000. This involves submitting a Claim Notification Form (CNF) via the Official Injury Claim portal.",
        reference: "Official Injury Claim — officialinjuryclaim.org.uk",
      },
    ],
  },
  {
    id: "legal-options",
    categoryTitle: "Legal Options",
    icon: "Scale",
    steps: [
      {
        title: "Small Claims Track",
        description:
          "For straightforward claims up to £10,000 (or £1,000 for personal injury), you may be able to use the small claims track in the County Court without needing a solicitor. The process is designed to be accessible to litigants in person.",
        reference:
          "HM Courts & Tribunals Service — gov.uk/make-court-claim-for-money",
      },
      {
        title: "Instruct a Solicitor",
        description:
          "For more complex claims, serious injuries, or disputed liability, consider instructing a specialist road traffic accident solicitor. Many operate on a Conditional Fee Agreement (no win, no fee) basis. The Law Society can help you find a qualified solicitor.",
        reference: "Law Society — solicitors.lawsociety.org.uk",
      },
      {
        title: "ABI Voluntary Agreements",
        description:
          'The Association of British Insurers (ABI) has voluntary agreements between insurers to handle certain types of claims efficiently, including the "knock-for-knock" arrangement for uninsured loss recovery. Your insurer can advise on applicable agreements.',
        reference: "Association of British Insurers — abi.org.uk",
      },
      {
        title: "Alternative Dispute Resolution",
        description:
          "Consider mediation or arbitration as alternatives to court proceedings. These can be faster and less costly. The Civil Mediation Council maintains a register of accredited mediators.",
        reference: "Civil Mediation Council — civilmediation.org",
      },
    ],
  },
  {
    id: "useful-contacts",
    categoryTitle: "Useful Contacts & Resources",
    icon: "Phone",
    steps: [
      {
        title: "Motor Insurers Bureau (MIB)",
        description:
          "If the other driver was uninsured or fled the scene (hit and run), you may be able to claim compensation through the Motor Insurers Bureau. The MIB handles claims against uninsured and untraced drivers.",
        reference: "Motor Insurers Bureau — mib.org.uk | Tel: 01908 830001",
      },
      {
        title: "Citizens Advice",
        description:
          "Citizens Advice provides free, independent guidance on your rights and options following a road traffic accident, including advice on insurance disputes, claiming compensation, and dealing with insurers.",
        reference:
          "Citizens Advice — citizensadvice.org.uk | Tel: 0800 144 8848",
      },
      {
        title: "Financial Ombudsman Service (FOS)",
        description:
          "If you have a dispute with your insurer that cannot be resolved through their complaints process, you can refer the matter to the Financial Ombudsman Service free of charge. The FOS can award compensation and direct insurers to take action.",
        reference:
          "Financial Ombudsman Service — financial-ombudsman.org.uk | Tel: 0800 023 4567",
      },
      {
        title: "DVLA — Driver & Vehicle Licensing Agency",
        description:
          "Contact the DVLA for matters relating to driving licences, vehicle registration, and medical fitness to drive. You can check whether another vehicle is insured using the Motor Insurance Database.",
        reference: "DVLA — gov.uk/contact-the-dvla | Tel: 0300 790 6801",
      },
      {
        title: "Victim Support",
        description:
          "If you have been injured or traumatised as a result of a road traffic incident, Victim Support provides free, confidential support regardless of whether the incident was reported to the police.",
        reference: "Victim Support — victimsupport.org.uk | Tel: 0808 168 9111",
      },
    ],
  },
];

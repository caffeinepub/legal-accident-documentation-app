// Malta-specific legal outputs: prescription periods, court tracks, compensation table, demand letter

export interface MaltaPrescriptionEntry {
  id: number;
  name: string;
  period: string;
  periodDays: number;
  statute: string;
  notes: string;
}

export const MALTA_PRESCRIPTION_ENTRIES: MaltaPrescriptionEntry[] = [
  {
    id: 1,
    name: "Personal Injury Claim",
    period: "2 years",
    periodDays: 2 * 365,
    statute: "Civil Code Cap. 16, Art. 2153",
    notes:
      "Prescription runs from the date the claimant became aware of the damage and of the person responsible. The court has limited discretion to extend in exceptional circumstances.",
  },
  {
    id: 2,
    name: "Property Damage Claim",
    period: "2 years",
    periodDays: 2 * 365,
    statute: "Civil Code Cap. 16, Art. 2153",
    notes:
      "Runs from the date of the accident causing property damage. Includes vehicle repair costs, damage to personal property, and consequential economic losses.",
  },
  {
    id: 3,
    name: "Fatal Accident Claim",
    period: "2 years from death",
    periodDays: 2 * 365,
    statute: "Civil Code Cap. 16, Art. 2153",
    notes:
      "The two-year prescription period runs from the date of death. Dependants and the deceased's estate may each have separate claims. Always seek legal advice promptly.",
  },
  {
    id: 4,
    name: "Fond tal-Kumpens (Uninsured Driver)",
    period: "2 years",
    periodDays: 2 * 365,
    statute: "Motor Vehicles Insurance (Third-Party Risks) Ordinance Cap. 104",
    notes:
      "Claims against the Maltese Motor Insurers' Bureau (Fond tal-Kumpens) for uninsured or untraced drivers must be filed within two years. Police reporting is required promptly after the incident.",
  },
  {
    id: 5,
    name: "Claim Against Public Authority",
    period: "2 years",
    periodDays: 2 * 365,
    statute: "Government Proceedings Act Cap. 481, s.5",
    notes:
      "Claims against the Maltese government, Transport Malta, or other public bodies must be filed within two years. This includes accidents caused by defective public roads, government vehicles, or public employees acting in the course of duty.",
  },
];

export interface MaltaCourtTrack {
  name: string;
  threshold: string;
  description: string;
  reference: string;
  features: string[];
  color?: string;
  badgeColor?: string;
  timeline?: string;
}

export const MALTA_COURT_TRACKS: MaltaCourtTrack[] = [
  {
    name: "Magistrates' Court",
    threshold: "Claims up to €5,000",
    description:
      "Minor road traffic claims and property damage disputes. Procedure is simplified; representation by a lawyer is advisable but not mandatory for individuals.",
    reference: "Code of Organisation and Civil Procedure Cap. 12",
    features: [
      "Simplified procedure",
      "Lower court fees",
      "Decisions usually within 12–18 months",
      "Enforceable judgments",
    ],
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-800",
    timeline: "6–12 months",
  },
  {
    name: "Civil Court, First Hall",
    threshold: "Claims €5,000 – €50,000",
    description:
      "Handles substantial personal injury claims and complex liability disputes. Legal representation is strongly recommended. The Civil Court applies Civil Code Cap. 16 and COCP Cap. 12 rules of procedure.",
    reference: "Code of Organisation and Civil Procedure Cap. 12, Art. 795",
    features: [
      "Full disclosure and evidence",
      "Expert witnesses permitted",
      "Interim injunctions available",
      "Costs may be awarded to the successful party",
    ],
    color: "bg-amber-50 border-amber-200",
    badgeColor: "bg-amber-100 text-amber-800",
    timeline: "12–24 months",
  },
  {
    name: "Court of Appeal",
    threshold: "Claims over €50,000 or appeals",
    description:
      "Hears appeals from the Civil Court (First Hall) and original jurisdiction for very high-value claims. Reserved for serious injury, fatal accidents, and complex liability disputes. Legal representation is mandatory.",
    reference: "Code of Organisation and Civil Procedure Cap. 12, Art. 227",
    features: [
      "Full appellate review on fact and law",
      "Reserved for serious/fatal injury cases",
      "Legal representation mandatory",
      "Significant costs exposure",
    ],
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800",
    timeline: "18–36 months",
  },
];

export type MaltaSeverityKey = "Minor" | "Moderate" | "Severe" | "Very Severe";
export type MaltaInjuryKey =
  | "Neck / Soft Tissue"
  | "Back"
  | "Head / Brain"
  | "Psychiatric / PTSD"
  | "Shoulder"
  | "Lower Limb"
  | "Upper Limb"
  | "Multiple Injuries";

export const MALTA_INJURY_CATEGORIES: MaltaInjuryKey[] = [
  "Neck / Soft Tissue",
  "Back",
  "Head / Brain",
  "Psychiatric / PTSD",
  "Shoulder",
  "Lower Limb",
  "Upper Limb",
  "Multiple Injuries",
];

export const MALTA_SEVERITY_BANDS: MaltaSeverityKey[] = [
  "Minor",
  "Moderate",
  "Severe",
  "Very Severe",
];

// Note: These are indicative reference bands based on Maltese court practice, NOT an official published tariff.
export const MALTA_COMPENSATION_TABLE: Partial<
  Record<MaltaInjuryKey, Partial<Record<MaltaSeverityKey, [number, number]>>>
> = {
  "Neck / Soft Tissue": {
    Minor: [1500, 4000],
    Moderate: [4000, 12000],
    Severe: [12000, 40000],
    "Very Severe": [40000, 100000],
  },
  Back: {
    Minor: [1500, 5000],
    Moderate: [5000, 18000],
    Severe: [18000, 55000],
    "Very Severe": [55000, 120000],
  },
  "Head / Brain": {
    Minor: [2000, 8000],
    Moderate: [15000, 60000],
    Severe: [60000, 150000],
    "Very Severe": [150000, 300000],
  },
  "Psychiatric / PTSD": {
    Minor: [1000, 4000],
    Moderate: [4000, 14000],
    Severe: [20000, 65000],
    "Very Severe": [65000, 130000],
  },
  Shoulder: {
    Minor: [2000, 5000],
    Moderate: [5000, 15000],
    Severe: [15000, 40000],
  },
  "Lower Limb": {
    Minor: [3000, 8000],
    Moderate: [8000, 25000],
    Severe: [25000, 90000],
  },
  "Upper Limb": {
    Minor: [2500, 7000],
    Moderate: [7000, 22000],
    Severe: [22000, 80000],
  },
  "Multiple Injuries": {
    Minor: [5000, 12000],
    Moderate: [12000, 35000],
    Severe: [35000, 120000],
    "Very Severe": [120000, 350000],
  },
};

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("mt-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface MaltaDemandLetterFields {
  claimantName?: string;
  defendantName?: string;
  accidentDate?: Date;
  accidentLocation?: string;
  claimantVehicle?: string;
  defendantVehicle?: string;
  defendantInsurer?: string;
  defendantPolicy?: string;
  incidentDescription?: string;
  partyBFaultPct?: string;
  speedNote?: string;
  weatherNote?: string;
  violationsNote?: string;
  injuryDescription?: string;
  claimId?: string;
}

export function buildMaltaDemandLetter(
  fields: MaltaDemandLetterFields,
): string {
  const todayDate = new Date();
  const responseDeadline = new Date(todayDate);
  responseDeadline.setDate(responseDeadline.getDate() + 21);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-MT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const accidentDateStr = fields.accidentDate
    ? formatDate(fields.accidentDate)
    : "[Date of Incident]";

  return `MINGĦAJR PREĠUDIZZJU — WITHOUT PREJUDICE

${formatDate(todayDate)}

TO:
${fields.defendantName || "The Defendant"}
[Address of Defendant]

CLAIM REFERENCE: ${fields.claimId || "[Claim ID]"}

Dear Sir / Madam,

RE: ROAD TRAFFIC ACCIDENT — ${accidentDateStr} — TALBA GĦALL-KUMPENS (CIVIL CODE CAP. 16)

We write on behalf of ${fields.claimantName || "our client"} ("the Claimant") in relation to a road traffic accident that occurred on ${accidentDateStr} at or near ${fields.accidentLocation || "[Location]"}.

1. ĊIRKOSTANZI TAL-INĊIDENT / CIRCUMSTANCES OF THE INCIDENT

1.1 On ${accidentDateStr}, a collision occurred between ${fields.claimantVehicle || "the Claimant's vehicle"} and ${fields.defendantVehicle || "your vehicle"} at the above location.

1.2 ${fields.incidentDescription || "The full circumstances are documented in the accompanying accident report."}

1.3 ${fields.speedNote || ""}${fields.weatherNote || ""}${fields.violationsNote || ""}

2. RESPONSABBILTÀ / LIABILITY

2.1 It is the Claimant's position that the accident was caused wholly or substantially by the negligence and/or breach of statutory duty of the Defendant, in breach of:
  — Civil Code (Cap. 16), Arts. 1031–1033 (general duty of care and negligence)
  — Traffic Regulation Ordinance (Cap. 65), relevant Articles
  — EU Motor Insurance Directive 2009/103/EC

2.2 Fault analysis indicates the Defendant bears ${fields.partyBFaultPct || "the primary"} responsibility for the collision.

${
  fields.injuryDescription
    ? `3. DANNI U KORRIMENTI / DAMAGE AND INJURIES

3.1 As a direct result of the Defendant's negligence, the Claimant has suffered the following:
  ${fields.injuryDescription}

`
    : ""
}4. TALBA / DEMAND

4.1 The Claimant hereby formally demands that the Defendant and/or their insurer (${fields.defendantInsurer || "[Insurer Name]"}, Policy No. ${fields.defendantPolicy || "[Policy No.]"}) acknowledge liability and agree to compensate the Claimant in full for all losses suffered.

4.2 Kindly confirm within 21 days of this letter (by ${formatDate(responseDeadline)}) whether liability is admitted or disputed. Failure to respond will result in proceedings being commenced in the competent Maltese court without further notice, and an application for costs.

5. AVVIŻ DWAR IL-PRESKRIZZJONI / PRESCRIPTION WARNING

5.1 This letter is given without prejudice to any rights of the Claimant. Please note that civil claims in Malta prescribe within two (2) years of the accident date under Civil Code Cap. 16, Art. 2153.

Yours faithfully,

${fields.claimantName || "[Claimant Name]"}
Claimant

────────────────────────────────────────
This letter has been prepared using iamthe.law. It does not constitute legal advice under Maltese law. The Claimant is strongly advised to seek independent legal representation from an advocate enrolled with the Chamber of Advocates of Malta before commencing legal proceedings.`;
}

export function buildMaltaLiabilityDisputeTemplate(fields: {
  claimantName: string;
  claimantAddress: string;
  defendantName: string;
  defendantInsurer: string;
  accidentDate: string;
  claimId: string;
  faultPercent: number;
  settlementValue: number;
}): string {
  const todayDate = new Date().toLocaleDateString("en-MT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return `MINGĦAJR PREĠUDIZZJU / WITHOUT PREJUDICE

${todayDate}

TO: ${fields.defendantInsurer || "[Insurer Name]"}
    RE: ${fields.defendantName || "[Defendant Full Name]"}

CLAIM REFERENCE: ${fields.claimId}
ACCIDENT DATE: ${fields.accidentDate}

RE: RESPONSE TO DENIAL OF LIABILITY — CIVIL CODE CAP. 16

Dear Sir/Madam,

We write in response to your denial of liability in respect of the above-referenced road traffic accident.

We dispute your client's position on liability and maintain that the evidence supports the following fault apportionment: our client bears no more than ${100 - fields.faultPercent}% responsibility for the collision, with the balance attributable to your insured.

Our position is founded upon the following:

1. DUTY OF CARE
   Under Civil Code (Cap. 16), Article 1031, every person is bound to exercise the standard of care of a reasonable and prudent driver. The evidence demonstrates that your insured fell below this standard.

2. BREACH OF TRAFFIC REGULATIONS
   The conduct of your insured constitutes a breach of the Traffic Regulation Ordinance (Cap. 65) and the Malta Road Code as published by Transport Malta.

3. CONTRIBUTORY NEGLIGENCE
   Even if any contributory negligence is established against our client (which is denied), such apportionment under Civil Code Art. 1033 does not extinguish liability entirely and does not justify a blanket denial.

4. EVIDENCE
   We are in possession of photographic and documentary evidence supporting our position. We are prepared to disclose this evidence in the context of any court proceedings or alternative dispute resolution.

5. QUANTUM
   Our client's claim is valued at approximately €${fields.settlementValue.toLocaleString("en-MT")} inclusive of general and special damages. We remain open to without-prejudice discussions.

PRESCRIPTION WARNING: Please note that the applicable prescription period under Civil Code Art. 2153 is two (2) years from the date of the accident. We reserve the right to issue proceedings without further notice should this matter not be resolved within that period.

We invite your client's insurer to reconsider its position within 21 days of the date of this letter. Failure to do so will result in this matter being referred to the competent Maltese court without further notice.

Yours faithfully,

${fields.claimantName || "[Claimant Name]"}
[Claimant Address / Avukat Details]

---
DISCLAIMER: This letter is generated for informational purposes only and does not constitute legal advice. Please consult a qualified avukat (advocate) before sending or relying on this document.`;
}

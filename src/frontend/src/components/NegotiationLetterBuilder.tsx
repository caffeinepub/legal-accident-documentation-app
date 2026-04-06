import type { AccidentReport } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Handshake,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { usePlan } from "../hooks/usePlan";
import { formatClaimId } from "../utils/claimId";
import PaywallModal from "./PaywallModal";

interface NegotiationLetterBuilderProps {
  report: AccidentReport & { id?: bigint };
  reportId?: bigint;
}

function generateUKNegotiationLetter(
  report: AccidentReport,
  settlementOffer: number,
  claimId: string,
): string {
  const accidentDate = new Date(Number(report.timestamp));
  const todayDate = new Date();
  const responseDeadline = new Date(todayDate);
  responseDeadline.setDate(responseDeadline.getDate() + 14);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const claimantVehicle = report.vehicleInfo
    ? [
        report.vehicleInfo.make,
        report.vehicleInfo.model,
        report.vehicleInfo.licencePlate
          ? `(${report.vehicleInfo.licencePlate})`
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "the claimant's vehicle";

  const defendantVehicle = report.otherVehicle
    ? [
        report.otherVehicle.make,
        report.otherVehicle.model,
        report.otherVehicle.licencePlate
          ? `(${report.otherVehicle.licencePlate})`
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "the defendant's vehicle";

  const defendantName = report.otherVehicle?.ownerName || "The Defendant";
  const defendantInsurer =
    report.otherVehicle?.insurer || "[Defendant's Insurer]";
  const defendantPolicy =
    report.otherVehicle?.insurancePolicyNumber || "[Policy Reference]";
  const incidentLocation =
    report.accidentMarker || report.stopLocation || "[Location of Incident]";

  const faultAssessment = report.faultLikelihoodAssessment;
  const partyAFault = faultAssessment
    ? `${Number(faultAssessment.partyAPercentage)}%`
    : "[Party A %]";
  const partyBFault = faultAssessment
    ? `${Number(faultAssessment.partyBPercentage)}%`
    : "[Party B %]";
  const faultReasoning =
    faultAssessment?.reasoning || report.faultReasoning || "";
  const weatherNote = report.surroundings?.weather
    ? ` Prevailing conditions: ${report.surroundings.weather}.`
    : "";

  const formattedOffer = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(settlementOffer);

  return `WITHOUT PREJUDICE SAVE AS TO COSTS

Claim Reference: ${claimId}
Date: ${formatDate(todayDate)}

TO:
${defendantName}
[Address of Defendant / Defendant's Solicitors]

Insurer: ${defendantInsurer}
Policy Reference: ${defendantPolicy}

Dear ${defendantName},

RE: ROAD TRAFFIC ACCIDENT DATED ${formatDate(accidentDate).toUpperCase()}
     CLAIMANT'S VEHICLE: ${claimantVehicle.toUpperCase()}
     DEFENDANT'S VEHICLE: ${defendantVehicle.toUpperCase()}
     CLAIM REFERENCE: ${claimId}

1. INTRODUCTION

We write on behalf of our client (the "Claimant") in connection with a road traffic accident that occurred on ${formatDate(accidentDate)} at or near ${incidentLocation}.${weatherNote} This letter is written on a Without Prejudice Save As To Costs basis and constitutes a Calderbank offer pursuant to CPR Part 36 and relevant case law.

2. STATEMENT OF FACTS

On ${formatDate(accidentDate)}, the Claimant's vehicle (${claimantVehicle}) was involved in a road traffic collision with ${defendantVehicle} operated by the Defendant.

Vehicle details:
   Claimant's vehicle:   ${claimantVehicle}
   Defendant's vehicle:  ${defendantVehicle}
   Location:             ${incidentLocation}
   Date of incident:     ${formatDate(accidentDate)}

${report.damageDescription ? `The following damage and loss was sustained: ${report.damageDescription}` : "Particulars of damage and loss are set out in the accompanying claim documentation."}

3. LIABILITY AND FAULT ASSESSMENT

Our client's position is that the Defendant was wholly or substantially liable for the collision by reason of negligent driving. The fault assessment is as follows:

   Claimant's contributory fault:   ${partyAFault}
   Defendant's fault:                ${partyBFault}

${faultReasoning ? `Assessment reasoning: ${faultReasoning}` : "Full fault analysis is available in the accompanying claim documentation."}

The Defendant's driving fell below the standard expected of a competent and careful driver, in breach of the duty of care established under Donoghue v Stevenson [1932] AC 562 and as particularised by the Caparo three-part test (Caparo Industries plc v Dickman [1990] 2 AC 605). Any contributory negligence on the part of the Claimant has been taken into account in formulating the offer below, in accordance with the Law Reform (Contributory Negligence) Act 1945.

4. CALDERBANK SETTLEMENT OFFER

Notwithstanding the Claimant's full entitlement to damages, and in the interests of avoiding litigation, the Claimant hereby makes the following offer in full and final settlement of all claims arising from the above incident:

   SETTLEMENT OFFER: ${formattedOffer}

This offer is made in full and final settlement of all heads of claim, including:
   (a) General damages for pain, suffering and loss of amenity;
   (b) Special damages including vehicle repair or diminution in value;
   (c) Consequential losses (hire, alternative transport, out-of-pocket expenses);
   (d) Any future losses or medical treatment costs arising from the incident.

This offer is intended to operate as a Calderbank offer and the Claimant reserves the right to draw it to the attention of the court on the question of costs, should this offer not be accepted.

5. RESPONSE REQUIRED

This offer will remain open for FOURTEEN (14) DAYS from the date of this letter (i.e., until ${formatDate(responseDeadline)}). If not accepted, it will be deemed withdrawn and the Claimant reserves the right to issue proceedings and seek indemnity costs.

Yours faithfully,

[Claimant's Solicitor / Claimant's Authorised Representative]
[Address]
[Reference: ${claimId}]

---
IMPORTANT NOTICE: This is a draft letter for documentation purposes only and does not constitute legal advice. Always seek independent legal advice from a qualified solicitor before issuing this letter. Time limits apply — please act promptly.`;
}

function generateMaltaNegotiationLetter(
  report: AccidentReport,
  settlementOffer: number,
  claimId: string,
): string {
  const accidentDate = new Date(Number(report.timestamp));
  const todayDate = new Date();
  const responseDeadline = new Date(todayDate);
  responseDeadline.setDate(responseDeadline.getDate() + 21);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-MT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const claimantVehicle = report.vehicleInfo
    ? [
        report.vehicleInfo.make,
        report.vehicleInfo.model,
        report.vehicleInfo.licencePlate
          ? `(${report.vehicleInfo.licencePlate})`
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "the claimant's vehicle";

  const defendantVehicle = report.otherVehicle
    ? [
        report.otherVehicle.make,
        report.otherVehicle.model,
        report.otherVehicle.licencePlate
          ? `(${report.otherVehicle.licencePlate})`
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "the defendant's vehicle";

  const defendantName = report.otherVehicle?.ownerName || "The Defendant";
  const defendantInsurer =
    report.otherVehicle?.insurer || "[Defendant's Insurer]";
  const defendantPolicy =
    report.otherVehicle?.insurancePolicyNumber || "[Policy Reference]";
  const incidentLocation =
    report.accidentMarker || report.stopLocation || "[Location of Incident]";

  const faultAssessment = report.faultLikelihoodAssessment;
  const partyAFault = faultAssessment
    ? `${Number(faultAssessment.partyAPercentage)}%`
    : "[Party A %]";
  const partyBFault = faultAssessment
    ? `${Number(faultAssessment.partyBPercentage)}%`
    : "[Party B %]";
  const faultReasoning =
    faultAssessment?.reasoning || report.faultReasoning || "";
  const weatherNote = report.surroundings?.weather
    ? ` Prevailing conditions: ${report.surroundings.weather}.`
    : "";

  const formattedOffer = new Intl.NumberFormat("mt-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(settlementOffer);

  return `MINGĦAJR PREĠUDIZZJU — WITHOUT PREJUDICE

Claim Reference: ${claimId}
Date: ${formatDate(todayDate)}

TO:
${defendantName}
[Address of Defendant / Defendant's Advocate]

Insurer: ${defendantInsurer}
Policy Reference: ${defendantPolicy}

Dear Sir / Madam (${defendantName}),

RE: ROAD TRAFFIC ACCIDENT — ${formatDate(accidentDate).toUpperCase()}
     CLAIMANT'S VEHICLE: ${claimantVehicle.toUpperCase()}
     DEFENDANT'S VEHICLE: ${defendantVehicle.toUpperCase()}
     CLAIM REFERENCE: ${claimId}

1. INTRODUZZJONI / INTRODUCTION

We write on behalf of our client (the "Claimant") in connection with a road traffic accident that occurred on ${formatDate(accidentDate)} at or near ${incidentLocation}.${weatherNote} This letter is written on a Without Prejudice (Mingħajr Preġudizzju) basis and constitutes a formal offer of settlement under Maltese civil law.

2. ĊIRKOSTANZI / FACTS

On ${formatDate(accidentDate)}, the Claimant's vehicle (${claimantVehicle}) was involved in a road traffic collision with ${defendantVehicle} operated by the Defendant.

Vehicle details:
   Claimant's vehicle:   ${claimantVehicle}
   Defendant's vehicle:  ${defendantVehicle}
   Location:             ${incidentLocation}
   Date of incident:     ${formatDate(accidentDate)}

${report.damageDescription ? `The following damage and loss was sustained: ${report.damageDescription}` : "Particulars of damage and loss are set out in the accompanying claim documentation."}

3. RESPONSABBILTÀ / LIABILITY

The Claimant's position is that the Defendant was wholly or substantially liable for the collision by reason of negligent driving, in breach of:
   — Civil Code (Cap. 16), Arts. 1031–1033 (general duty of care and negligence)
   — Traffic Regulation Ordinance (Cap. 65), relevant Articles
   — EU Motor Insurance Directive 2009/103/EC

Fault assessment:
   Claimant's contributory fault:   ${partyAFault}
   Defendant's fault:                ${partyBFault}

${faultReasoning ? `Assessment reasoning: ${faultReasoning}` : "Full fault analysis is available in the accompanying claim documentation."}

The Defendant's driving fell below the standard of a reasonably careful driver, giving rise to liability under Civil Code Cap. 16, Art. 1031. Any contributory negligence on the part of the Claimant has been taken into account in accordance with Civil Code Art. 1033 (Camilleri v Mifsud, Court of Appeal, Malta).

4. OFFERTA TA' FTEHIM / SETTLEMENT OFFER

Notwithstanding the Claimant's full entitlement to damages, the Claimant hereby makes the following offer in full and final settlement:

   SETTLEMENT OFFER: ${formattedOffer}

This offer covers:
   (a) Ħsara ġenerali — general damages for pain, suffering and loss of amenity;
   (b) Ħsara speċjali — vehicle repair costs and property damage;
   (c) Spejjeż mediċi — medical treatment costs, past and future;
   (d) Telf ta' qligħ — loss of earnings where applicable.

5. RISPOSTA MEĦTIEĠA / RESPONSE REQUIRED

This offer will remain open for TWENTY-ONE (21) DAYS (i.e., until ${formatDate(responseDeadline)}). If not accepted, the Claimant reserves the right to file a sworn application (rikors) in the court of appropriate jurisdiction without further notice.

Please note that civil claims in Malta prescribe within two (2) years under Civil Code Cap. 16, Art. 2153.

Yours faithfully,

[Claimant's Advocate / Claimant]
[Address]
[Reference: ${claimId}]

---
AVVIŻ IMPORTANTI: Din l-ittra hija abbozz għal finijiet ta' dokumentazzjoni biss u ma tikkostitwixxix parir legali taħt il-liġi Maltija. Fittex parir legali indipendenti minn avukat elenkat mal-Kamra tal-Avukati ta' Malta.`;
}

export default function NegotiationLetterBuilder({
  report,
  reportId,
}: NegotiationLetterBuilderProps) {
  const { isPro } = usePlan();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState("");
  const [letterText, setLetterText] = useState("");
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { country } = useCountry();
  const isMalta = country === "mt";

  const claimId = formatClaimId(reportId ?? 0n, report.timestamp ?? undefined);

  const handleGenerate = () => {
    const amount = Number.parseFloat(settlementAmount) || 0;
    const letter = isMalta
      ? generateMaltaNegotiationLetter(report, amount, claimId)
      : generateUKNegotiationLetter(report, amount, claimId);
    setLetterText(letter);
    setGenerated(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback silent
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${isMalta ? "Offerta ta' Ftehim" : "Without Prejudice Negotiation Letter"} — ${claimId}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 2cm; color: #000; }
            pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }
          </style>
        </head>
        <body><pre>${letterText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => {
          if (open && !isPro) {
            setShowPaywall(true);
          } else {
            setIsOpen(open);
          }
        }}
      >
        <Card className="border-emerald-200/60 dark:border-emerald-800/30">
          <CardHeader className="py-3 px-4">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-between w-full text-left group"
              >
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-sm font-semibold">
                    {isMalta
                      ? "Offerta ta' Ftehim — Without-Prejudice Settlement Letter"
                      : "Without-Prejudice Negotiation Letter"}
                  </CardTitle>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </button>
            </CollapsibleTrigger>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0 pb-4 px-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-md px-3 py-2">
                {isMalta ? (
                  <>
                    <strong>Abbozz ta&apos; offerta ta&apos; ftehim</strong> —
                    auto-populated from report data. Marked{" "}
                    <em>Mingħajr Preġudizzju</em> (Without Prejudice).
                    References Maltese law:{" "}
                    <em>Civil Code Cap. 16, Arts. 1031–1033</em> and{" "}
                    <em>Camilleri v Mifsud</em>. Settlement offer is in EUR.
                    Edit all details before use. Always seek legal advice from a
                    Maltese advocate.
                  </>
                ) : (
                  <>
                    <strong>Calderbank offer template</strong> — auto-populated
                    from report data. Marked Without Prejudice Save As To Costs.
                    References <em>Donoghue v Stevenson</em> and{" "}
                    <em>Caparo v Dickman</em> and the Law Reform (Contributory
                    Negligence) Act 1945. Edit all details before use. Always
                    seek independent legal advice.
                  </>
                )}
              </p>

              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label
                    htmlFor="settlement-offer"
                    className="text-xs font-medium"
                  >
                    Settlement Offer Amount ({isMalta ? "€" : "£"})
                  </Label>
                  <Input
                    id="settlement-offer"
                    data-ocid="negotiation.input"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="e.g. 5000"
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button
                  data-ocid="negotiation.primary_button"
                  onClick={handleGenerate}
                  size="sm"
                  className="gap-2 text-xs bg-emerald-700 hover:bg-emerald-800 text-white shrink-0"
                >
                  <Handshake className="h-3.5 w-3.5" />
                  Generate Letter
                </Button>
              </div>

              {generated && (
                <>
                  <Textarea
                    data-ocid="negotiation.textarea"
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                    className="font-mono text-xs leading-relaxed min-h-[520px] resize-y bg-card border-border"
                    spellCheck
                  />

                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    <Button
                      data-ocid="negotiation.secondary_button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2 text-xs"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="gap-2 text-xs"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName="Negotiation Letter Builder"
      />
    </>
  );
}

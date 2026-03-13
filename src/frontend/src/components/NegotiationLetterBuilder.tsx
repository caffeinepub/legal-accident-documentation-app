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
import { formatClaimId } from "../utils/claimId";

interface NegotiationLetterBuilderProps {
  report: AccidentReport & { id?: bigint };
  reportId?: bigint;
}

function generateNegotiationLetter(
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

On ${formatDate(accidentDate)}, the Claimant's vehicle (${claimantVehicle}) was involved in a road traffic collision with ${defendantVehicle} operated by the Defendant. The incident arose from the circumstances detailed in the Claimant's accident documentation (Claim Reference: ${claimId}).

Vehicle details:
   Claimant's vehicle:   ${claimantVehicle}
   Defendant's vehicle:  ${defendantVehicle}
   Location:             ${incidentLocation}
   Date of incident:     ${formatDate(accidentDate)}

${report.damageDescription ? `The following damage and loss was sustained: ${report.damageDescription}` : "Particulars of damage and loss are set out in the accompanying claim documentation."}

3. LIABILITY AND FAULT ASSESSMENT

Our client's position is that the Defendant was wholly or substantially liable for the collision by reason of negligent driving. Based on the evidence gathered, including photographic evidence, dash cam footage (where available), and circumstantial analysis, the fault assessment is as follows:

   Claimant's contributory fault:   ${partyAFault}
   Defendant's fault:                ${partyBFault}

${faultReasoning ? `Assessment reasoning: ${faultReasoning}` : "Full fault analysis is available in the accompanying claim documentation."}

The Defendant's driving fell below the standard expected of a competent and careful driver, in breach of the duty of care established under Donoghue v Stevenson [1932] AC 562 and as particularised by the Caparo three-part test (Caparo Industries plc v Dickman [1990] 2 AC 605). Any contributory negligence on the part of the Claimant has been taken into account in formulating the offer below, in accordance with the Law Reform (Contributory Negligence) Act 1945.

4. CALDERBANK SETTLEMENT OFFER

Notwithstanding the Claimant's full entitlement to damages, and in the interests of avoiding the cost, delay and uncertainty of litigation, the Claimant hereby makes the following offer in full and final settlement of all claims arising from the above incident:

   SETTLEMENT OFFER: ${formattedOffer}

This offer is made in full and final settlement of all heads of claim, including:
   (a) General damages for pain, suffering and loss of amenity;
   (b) Special damages including vehicle repair or diminution in value;
   (c) Consequential losses (hire, alternative transport, out-of-pocket expenses);
   (d) Any future losses or medical treatment costs arising from the incident.

This offer is intended to operate as a Calderbank offer and the Claimant reserves the right to draw it to the attention of the court on the question of costs at the conclusion of any proceedings, should this offer not be accepted.

5. RESPONSE REQUIRED

This offer will remain open for acceptance for FOURTEEN (14) DAYS from the date of this letter (i.e., until ${formatDate(responseDeadline)}). If the offer is not accepted within that period, it will be deemed withdrawn without further notice, and the Claimant reserves the right to issue proceedings and to seek indemnity costs.

Please acknowledge receipt of this letter within 21 days in accordance with the Pre-Action Protocol for Personal Injury Claims (CPR Practice Direction — Pre-Action Conduct).

Yours faithfully,

[Claimant's Solicitor / Claimant's Authorised Representative]
[Address]
[Reference: ${claimId}]

---
IMPORTANT NOTICE: This is a draft letter generated for documentation purposes only and does not constitute legal advice. The Claimant should obtain independent legal advice from a qualified solicitor before issuing or relying upon this letter. Time limits apply — please act promptly. This document has been prepared using the iamthe.law accident documentation system.`;
}

export default function NegotiationLetterBuilder({
  report,
  reportId,
}: NegotiationLetterBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState("");
  const [letterText, setLetterText] = useState("");
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const claimId = formatClaimId(reportId ?? 0n, report.timestamp ?? undefined);

  const handleGenerate = () => {
    const amount = Number.parseFloat(settlementAmount) || 0;
    const letter = generateNegotiationLetter(report, amount, claimId);
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
          <title>Without Prejudice Negotiation Letter — ${claimId}</title>
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
                  Without-Prejudice Negotiation Letter
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
              <strong>Calderbank offer template</strong> — auto-populated from
              report data. This letter is marked Without Prejudice Save As To
              Costs and incorporates the fault assessment and relevant case law
              (including <em>Donoghue v Stevenson</em> and{" "}
              <em>Caparo v Dickman</em>) and contributory negligence principles
              under the Law Reform (Contributory Negligence) Act 1945. Edit all
              details before use. Always seek independent legal advice.
            </p>

            {/* Settlement offer input */}
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <Label
                  htmlFor="settlement-offer"
                  className="text-xs font-medium"
                >
                  Settlement Offer Amount (£)
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
  );
}

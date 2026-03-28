import type { AccidentReport } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Printer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { buildMaltaDemandLetter } from "../data/maltaLegalOutputs";

interface DemandLetterPanelProps {
  report: AccidentReport;
}

function generateDemandLetter(report: AccidentReport): string {
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
    : "the subject vehicle";

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
    : "your vehicle";

  const defendantName = report.otherVehicle?.ownerName || "The Defendant";
  const defendantInsurer = report.otherVehicle?.insurer || "[Insurer Name]";
  const defendantPolicy =
    report.otherVehicle?.insurancePolicyNumber || "[Policy Number]";

  const incidentLocation =
    report.accidentMarker || report.stopLocation || "[Location of Incident]";
  const incidentDescription =
    report.damageDescription ||
    "a road traffic incident resulting in vehicle damage and losses to the Claimant.";

  const faultAssessment = report.faultLikelihoodAssessment;
  const partyBFault = faultAssessment
    ? `${Number(faultAssessment.partyBPercentage)}%`
    : "entirely";

  const faultReasoning = faultAssessment?.reasoning || report.faultReasoning;

  const speedNote =
    report.vehicleSpeed && Number(report.vehicleSpeed) > 0
      ? `The Defendant's vehicle was travelling at a speed of ${Number(report.vehicleSpeed)} mph at the time of the collision. `
      : "";

  const weatherNote = report.surroundings?.weather
    ? `Prevailing conditions at the time of the incident were: ${report.surroundings.weather}. `
    : "";

  const violationsNote =
    report.violations && report.violations.length > 0
      ? `The following violations were recorded: ${report.violations.map((v) => v.description).join("; ")}. `
      : "";

  return `WITHOUT PREJUDICE SAVE AS TO COSTS

${formatDate(todayDate)}

TO:
${defendantName}
[Address of Defendant]

Insurer: ${defendantInsurer}
Policy Reference: ${defendantPolicy}

Dear ${defendantName},

RE: FORMAL LETTER OF CLAIM — ROAD TRAFFIC ACCIDENT DATED ${formatDate(accidentDate).toUpperCase()}
     CLAIMANT'S VEHICLE: ${claimantVehicle.toUpperCase()}
     DEFENDANT'S VEHICLE: ${defendantVehicle.toUpperCase()}

We write on behalf of our client (the "Claimant") in connection with a road traffic accident that occurred on ${formatDate(accidentDate)} at or near ${incidentLocation}.

FACTS OF THE INCIDENT

On ${formatDate(accidentDate)}, the Claimant was involved in a road traffic accident with your vehicle, ${defendantVehicle}. ${incidentDescription} ${speedNote}${weatherNote}${violationsNote}

It is our client's case that the accident was caused wholly or in ${partyBFault} by your negligence in the driving, management, and control of your vehicle.${faultReasoning ? ` ${faultReasoning}` : ""}

BREACH OF DUTY

By reason of your negligence, you were in breach of the following duties:

   (a) To drive with reasonable care and skill;
   (b) To comply with applicable provisions of the Highway Code and Road Traffic Act 1988;
   (c) To maintain proper control of your vehicle at all times;
   (d) To keep a proper lookout and avoid a foreseeable collision.

LOSS AND DAMAGE

As a direct result of your negligence, the Claimant has suffered the following loss and damage:

   (a) Damage to the Claimant's vehicle ${claimantVehicle};
   (b) Consequential losses including vehicle hire, alternative transport costs;
   (c) Personal injury to the Claimant (further details to follow subject to medical evidence);
   (d) Financial losses, including loss of earnings, where applicable.

Full particulars of special damages will be provided in due course. The Claimant reserves the right to amend this letter as further evidence and medical reports become available.

LEGAL PROCEEDINGS

We hereby give you formal notice of the Claimant's intention to pursue a claim for all losses arising from this incident. Unless we receive satisfactory proposals for settlement within FOURTEEN (14) DAYS of the date of this letter (i.e., by ${formatDate(responseDeadline)}), our client reserves the right to issue proceedings in the appropriate court without further notice to you.

The Claimant further reserves the right to rely upon this letter and to seek indemnity costs pursuant to CPR Part 44 and relevant Pre-Action Protocols.

RESPONSE REQUIRED

Please acknowledge receipt of this letter within 21 days, pursuant to the Pre-Action Protocol for Personal Injury Claims and/or the Pre-Action Protocol for Low Value Personal Injury Claims in Road Traffic Accidents.

Yours faithfully,

[Claimant's Solicitor / Claimant's Name]
[Address]
[Reference Number]

---
DISCLAIMER: This is a draft letter generated for documentation purposes only. It does not constitute legal advice. You should seek independent legal advice from a qualified solicitor before sending this letter. Time limits apply — please act promptly.`;
}

export default function DemandLetterPanel({ report }: DemandLetterPanelProps) {
  const { country } = useCountry();
  const isMalta = country === "mt";
  const [isOpen, setIsOpen] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !letterText) {
      if (isMalta) {
        const accidentDate = report.timestamp
          ? new Date(Number(report.timestamp))
          : undefined;
        const faultAssessment = report.faultLikelihoodAssessment;
        const partyBFault = faultAssessment
          ? `${Number(faultAssessment.partyBPercentage)}%`
          : "primarily";
        const maltaLetter = buildMaltaDemandLetter({
          claimantName: undefined,
          defendantName: report.otherVehicle?.ownerName || undefined,
          accidentDate,
          accidentLocation:
            report.accidentMarker || report.stopLocation || undefined,
          claimantVehicle: report.vehicleInfo
            ? [
                report.vehicleInfo.make,
                report.vehicleInfo.model,
                report.vehicleInfo.licencePlate
                  ? `(${report.vehicleInfo.licencePlate})`
                  : "",
              ]
                .filter(Boolean)
                .join(" ")
            : undefined,
          defendantVehicle: report.otherVehicle
            ? [
                report.otherVehicle.make,
                report.otherVehicle.model,
                report.otherVehicle.licencePlate
                  ? `(${report.otherVehicle.licencePlate})`
                  : "",
              ]
                .filter(Boolean)
                .join(" ")
            : undefined,
          defendantInsurer: report.otherVehicle?.insurer || undefined,
          defendantPolicy:
            report.otherVehicle?.insurancePolicyNumber || undefined,
          incidentDescription: report.damageDescription || undefined,
          partyBFaultPct: partyBFault,
          injuryDescription: report.damageDescription || undefined,
        });
        setLetterText(maltaLetter);
      } else {
        setLetterText(generateDemandLetter(report));
      }
    }
  }, [isOpen, report, letterText, isMalta]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select all
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Formal Demand Letter</title>
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
      <Card className="border-amber-200/60 dark:border-amber-800/30">
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-sm font-semibold">
                  Formal Demand Letter (Draft)
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
            <p className="text-xs text-muted-foreground leading-relaxed bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/30 rounded-md px-3 py-2">
              <strong>Auto-generated draft</strong> based on report data. Review
              and edit all details before sending.{" "}
              {isMalta ? (
                <>
                  This letter follows Maltese civil law format (Civil Code Cap.
                  16, TRO Cap. 65). Review all details before use. Always seek
                  advice from a qualified <strong>avukat (advocate)</strong>.
                </>
              ) : (
                "This letter follows standard UK pre-action protocol formatting. Always seek qualified legal advice before issuing."
              )}
            </p>

            <Textarea
              data-ocid="demand_letter.textarea"
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              className="font-mono text-xs leading-relaxed min-h-[480px] resize-y bg-card border-border"
              spellCheck
            />

            <div className="flex items-center gap-2 justify-end flex-wrap">
              <Button
                data-ocid="demand_letter.copy_button"
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
                data-ocid="demand_letter.print_button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2 text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

import type { AccidentReport } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  FileDown,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { useLanguage } from "../contexts/LanguageContext";
import { formatClaimId } from "../utils/claimId";
import QRCodeDisplay from "./QRCodeDisplay";

interface ExportReportPanelProps {
  reportId: bigint;
  report: AccidentReport;
  witnessSignatureDate?: string;
}

const PREVIEW_LENGTH = 500;
const POLICE_INFO_DELIMITER = "---POLICE_INFO---\n";

function parsePoliceInfoForExport(
  accidentMarker: string,
): { policeRef: string; officerName: string } | null {
  const idx = accidentMarker.indexOf(POLICE_INFO_DELIMITER);
  if (idx === -1) return null;
  try {
    const json = accidentMarker
      .slice(idx + POLICE_INFO_DELIMITER.length)
      .trim();
    return JSON.parse(json) as { policeRef: string; officerName: string };
  } catch {
    return null;
  }
}

function stripPoliceInfoForExport(accidentMarker: string): string {
  const idx = accidentMarker.indexOf(POLICE_INFO_DELIMITER);
  if (idx === -1) return accidentMarker;
  const trimIdx = accidentMarker.lastIndexOf("\n", idx - 1);
  return trimIdx > 0
    ? accidentMarker.slice(0, trimIdx).trim()
    : accidentMarker.slice(0, idx).trim();
}

function compileReport(
  reportId: bigint,
  report: AccidentReport,
  witnessSignatureDate?: string,
  isMalta?: boolean,
): string {
  const generated = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  const claimId = formatClaimId(reportId, report.timestamp);

  const lines: string[] = [
    isMalta
      ? "RAPPORT TAL-IN\u010aIDENT \u2014 MALTA JURISDICTION"
      : "ACCIDENT CLAIM REPORT",
    `Report Reference: ${claimId}`,
    `Generated: ${generated}`,
    "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550",
    "",
  ];

  // DISCLAIMER NOTICE
  lines.push("IMPORTANT NOTICE");
  lines.push(
    "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
  );
  lines.push(
    "This report and any analysis it contains does not constitute legal advice.",
  );
  lines.push(
    "It is provided for informational and insurance documentation purposes only.",
  );
  lines.push(
    `You should seek independent legal advice from a qualified ${isMalta ? "avukat (advocate)" : "solicitor"} before`,
  );
  lines.push("taking any legal action arising from this incident.");
  lines.push(
    "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
  );
  lines.push("");

  // 1. INCIDENT NARRATIVE
  lines.push("1. INCIDENT NARRATIVE");
  const narrativeText = report.accidentNarrative?.narrativeText;
  lines.push(narrativeText ? narrativeText : "Not yet generated.");
  lines.push("");

  // 2. DAMAGE ASSESSMENT
  const ds = report.damageSeverity;
  lines.push("2. DAMAGE ASSESSMENT");
  if (ds) {
    lines.push(
      `Severity: ${ds.severityLabel} (${Number(ds.priorityScore)}/10)`,
    );
    lines.push(`Total Loss Probability: ${Number(ds.totalLossProbability)}%`);
    if (ds.vehicleZones && ds.vehicleZones.length > 0) {
      lines.push("Vehicle Zones:");
      for (const zone of ds.vehicleZones) {
        lines.push(
          `  - ${zone.zone}: ${Number(zone.score)}/10 \u2014 ${zone.damageType} \u2014 ${zone.description}`,
        );
      }
    }
  } else {
    lines.push("Damage assessment not yet generated.");
  }
  lines.push("");

  // 3. FAULT LIKELIHOOD ASSESSMENT
  const fla = report.faultLikelihoodAssessment;
  lines.push("3. FAULT LIKELIHOOD ASSESSMENT");
  if (fla) {
    lines.push(`Party A (Subject): ${Number(fla.partyAPercentage)}%`);
    lines.push(`Party B (Other): ${Number(fla.partyBPercentage)}%`);
    lines.push(`Confidence: ${Number(fla.confidenceLevel)}%`);
    if (fla.reasoning) lines.push(`Basis: ${fla.reasoning}`);
    if (fla.roadPositionImpact)
      lines.push(`Road Position Impact: ${fla.roadPositionImpact}`);
    if (fla.supportingFactors && fla.supportingFactors.length > 0) {
      lines.push("Supporting Factors:");
      for (const f of fla.supportingFactors) lines.push(`  + ${f}`);
    }
    if (fla.conflictingFactors && fla.conflictingFactors.length > 0) {
      lines.push("Conflicting Factors:");
      for (const f of fla.conflictingFactors) lines.push(`  - ${f}`);
    }
  } else {
    lines.push("Fault likelihood assessment not yet generated.");
  }
  lines.push("");

  // 4. PHOTO EVIDENCE ANALYSIS
  const photoAnalysis = report.aiAnalysisResult?.photoAnalysis;
  if (photoAnalysis) {
    lines.push("4. PHOTO EVIDENCE ANALYSIS");
    lines.push(photoAnalysis);
    lines.push("");
  }

  // 5. DASH CAM ANALYSIS
  const dashCamAnalysis = report.aiAnalysisResult?.dashCamAnalysis;
  if (dashCamAnalysis) {
    lines.push("5. DASH CAM ANALYSIS");
    lines.push(dashCamAnalysis);
    lines.push("");
  }

  // 6. TRAFFIC VIOLATIONS
  if (report.violations && report.violations.length > 0) {
    lines.push("6. TRAFFIC VIOLATIONS");
    for (const v of report.violations) {
      lines.push(`  \u2022 [${v.violationType}] ${v.description}`);
    }
    lines.push("");
  }

  // 7. VEHICLE DETAILS
  lines.push("7. VEHICLE DETAILS");
  const vi = report.vehicleInfo;
  if (vi) {
    if (vi.make || vi.model)
      lines.push(
        `  Make/Model: ${[vi.make, vi.model].filter(Boolean).join(" ")}`,
      );
    if (vi.licencePlate) lines.push(`  Licence Plate: ${vi.licencePlate}`);
    if (vi.colour) lines.push(`  Colour: ${vi.colour}`);
    if (vi.year) lines.push(`  Year: ${Number(vi.year)}`);
    if (vi.mot) lines.push(`  ${isMalta ? "VRT" : "MOT"}: ${vi.mot}`);
  } else {
    lines.push("  No vehicle details recorded.");
  }
  lines.push("");

  // 8. THIRD PARTY VEHICLE
  const ov = report.otherVehicle;
  if (ov) {
    lines.push("8. THIRD PARTY VEHICLE");
    if (ov.make || ov.model)
      lines.push(
        `  Make/Model: ${[ov.make, ov.model].filter(Boolean).join(" ")}`,
      );
    if (ov.licencePlate) lines.push(`  Licence Plate: ${ov.licencePlate}`);
    if (ov.ownerName) lines.push(`  Owner: ${ov.ownerName}`);
    if (ov.phone) lines.push(`  Phone: ${ov.phone}`);
    if (ov.email) lines.push(`  Email: ${ov.email}`);
    if (ov.insurer) lines.push(`  Insurer: ${ov.insurer}`);
    if (ov.insurancePolicyNumber)
      lines.push(`  Policy Number: ${ov.insurancePolicyNumber}`);
    if (ov.claimReference)
      lines.push(`  Claim Reference: ${ov.claimReference}`);
    lines.push("");
  }

  // 9. CONDITIONS
  const sur = report.surroundings;
  if (sur) {
    lines.push("9. CONDITIONS");
    if (sur.weather) lines.push(`  Weather: ${sur.weather}`);
    if (sur.roadCondition) lines.push(`  Road: ${sur.roadCondition}`);
    if (sur.visibility) lines.push(`  Visibility: ${sur.visibility}`);
    if (report.vehicleSpeed != null)
      lines.push(
        `  Recorded Speed: ${Number(report.vehicleSpeed)} ${isMalta ? "km/h" : "mph"}`,
      );
    if (report.stopLocation)
      lines.push(`  Stop Location: ${report.stopLocation}`);
    if (report.accidentMarker) {
      const cleanMarker = stripPoliceInfoForExport(report.accidentMarker);
      if (cleanMarker) lines.push(`  Accident Marker: ${cleanMarker}`);
    }
    lines.push("");
  }

  // 9a. POLICE INFORMATION
  if (report.accidentMarker) {
    const policeInfo = parsePoliceInfoForExport(report.accidentMarker);
    if (policeInfo && (policeInfo.policeRef || policeInfo.officerName)) {
      lines.push("9a. POLICE INFORMATION");
      if (policeInfo.policeRef)
        lines.push(`  Police Reference No.: ${policeInfo.policeRef}`);
      if (policeInfo.officerName)
        lines.push(`  Attending Officer: ${policeInfo.officerName}`);
      lines.push("");
    }
  }

  // 10. EVIDENCE GAPS
  const gaps =
    report.accidentNarrative?.evidenceGaps ??
    report.aiAnalysisResult?.evidenceGaps ??
    [];
  if (gaps.length > 0) {
    lines.push("10. EVIDENCE GAPS");
    for (const gap of gaps) {
      lines.push(
        `  [${gap.evidenceType.toUpperCase()}] ${gap.description} (Confidence: ${Number(gap.confidenceLevel)}%)`,
      );
    }
    lines.push("");
  }

  if (witnessSignatureDate) {
    lines.push("");
    lines.push(`Witness Signature: Captured on ${witnessSignatureDate}`);
  }

  lines.push(
    "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
  );
  lines.push(
    "DISCLAIMER: This report does not constitute legal advice. Consult a",
  );
  lines.push(
    `qualified ${isMalta ? "avukat (advocate)" : "solicitor"} before taking legal action.`,
  );
  lines.push(
    "Generated by AccidentReport \u2014 for informational purposes only.",
  );

  return lines.join("\n");
}

export default function ExportReportPanel({
  reportId,
  report,
  witnessSignatureDate,
}: ExportReportPanelProps) {
  const [copied, setCopied] = useState(false);
  const { country } = useCountry();
  const isMalta = country === "mt";
  const { t } = useLanguage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const claimId = formatClaimId(reportId, report.timestamp);
  const reportText = compileReport(
    reportId,
    report,
    witnessSignatureDate,
    isMalta,
  );
  const previewText = showFullPreview
    ? reportText
    : reportText.slice(0, PREVIEW_LENGTH) +
      (reportText.length > PREVIEW_LENGTH ? "\u2026" : "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = reportText;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const printDiv = document.getElementById("__export_print_target__");
    if (printDiv) {
      printDiv.textContent = reportText;
    } else {
      const div = document.createElement("div");
      div.id = "__export_print_target__";
      div.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999;padding:2rem;font-family:monospace;white-space:pre-wrap;font-size:12px;display:none;";
      div.textContent = reportText;
      document.body.appendChild(div);
    }

    const styleId = "__export_print_style__";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @media print {
        body > *:not(#__export_print_target__) { display: none !important; }
        #__export_print_target__ { display: block !important; position: static !important; }
      }
    `;

    window.print();

    setTimeout(() => {
      if (style) style.textContent = "";
    }, 1000);
  };

  return (
    <Card className="border-primary/30 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileDown size={16} className="text-primary" />
          {t("export.title")}
          <Badge
            variant="outline"
            className="text-xs border-primary/40 text-primary ml-auto"
          >
            Insurance Ready
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground pt-1">
          {t("export.description")}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap" data-print-hide>
          <Button
            size="sm"
            className="gap-2 flex-1 sm:flex-none"
            onClick={handleCopy}
            data-ocid="export.primary_button"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-300" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardCopy size={14} />
                Copy to Clipboard
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 flex-1 sm:flex-none"
            onClick={handlePrint}
            data-ocid="export.secondary_button"
          >
            <Printer size={14} />
            {t("export.print")}
          </Button>
        </div>

        {/* QR Code for claim verification */}
        <div className="flex justify-center py-2">
          <QRCodeDisplay value={claimId} size={96} />
        </div>

        <Separator />

        {/* Collapsible preview */}
        <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
              data-ocid="export.toggle"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide group-hover:text-foreground transition-colors">
                {t("export.preview")}
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {previewOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </span>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mt-3 space-y-2" data-ocid="export.panel">
              <div className="p-3 bg-muted/40 border border-border rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground max-h-64 overflow-y-auto">
                {previewText}
              </div>

              {reportText.length > PREVIEW_LENGTH && (
                <button
                  type="button"
                  onClick={() => setShowFullPreview((v) => !v)}
                  className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  data-ocid="export.toggle"
                >
                  {showFullPreview
                    ? t("export.show_less")
                    : t("export.show_more")}
                </button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

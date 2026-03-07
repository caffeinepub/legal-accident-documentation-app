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

interface ExportReportPanelProps {
  reportId: bigint;
  report: AccidentReport;
}

const PREVIEW_LENGTH = 500;

function compileReport(reportId: bigint, report: AccidentReport): string {
  const generated = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  const lines: string[] = [
    "ACCIDENT CLAIM REPORT",
    `Report Reference: #${reportId.toString()}`,
    `Generated: ${generated}`,
    "═══════════════════════════════════════",
    "",
  ];

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
          `  - ${zone.zone}: ${Number(zone.score)}/10 — ${zone.damageType} — ${zone.description}`,
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
      lines.push(`  • [${v.violationType}] ${v.description}`);
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
    if (vi.mot) lines.push(`  MOT: ${vi.mot}`);
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
      lines.push(`  Recorded Speed: ${Number(report.vehicleSpeed)} mph`);
    if (report.stopLocation)
      lines.push(`  Stop Location: ${report.stopLocation}`);
    if (report.accidentMarker)
      lines.push(`  Accident Marker: ${report.accidentMarker}`);
    lines.push("");
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

  lines.push("─────────────────────────────────────");
  lines.push(
    "This report was generated by the Legal Accident Documentation App.",
  );
  lines.push("For legal advice, consult a qualified solicitor.");

  return lines.join("\n");
}

export default function ExportReportPanel({
  reportId,
  report,
}: ExportReportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const reportText = compileReport(reportId, report);
  const previewText = showFullPreview
    ? reportText
    : reportText.slice(0, PREVIEW_LENGTH) +
      (reportText.length > PREVIEW_LENGTH ? "…" : "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that deny clipboard
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

    // Apply print-only styles via a style tag, then print
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

    // Clean up after print dialog closes
    setTimeout(() => {
      if (style) style.textContent = "";
    }, 1000);
  };

  return (
    <Card className="border-primary/30 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileDown size={16} className="text-primary" />
          Export Claim Report
          <Badge
            variant="outline"
            className="text-xs border-primary/40 text-primary ml-auto"
          >
            Insurance Ready
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground pt-1">
          Compile all report data into a formal insurance claim document.
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
            Print Report
          </Button>
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
                Preview Report
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
              <div className="p-3 bg-muted/40 border border-border rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/80 max-h-64 overflow-y-auto">
                {previewText}
              </div>

              {reportText.length > PREVIEW_LENGTH && (
                <button
                  type="button"
                  onClick={() => setShowFullPreview((v) => !v)}
                  className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  data-ocid="export.toggle"
                >
                  {showFullPreview ? "Show less" : "Show full preview"}
                </button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

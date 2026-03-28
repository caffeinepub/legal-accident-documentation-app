import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { AccidentReport } from "../backend";
import { getReportStatus } from "../utils/reportStatus";

type Severity = "critical" | "warning" | "tip";

interface GapItem {
  key: string;
  message: string;
  severity: Severity;
}

function detectGaps(report: AccidentReport): GapItem[] {
  const gaps: GapItem[] = [];

  // ── Basic evidence gaps ────────────────────────────────────────────────────
  if (!report.photos || report.photos.length === 0) {
    gaps.push({
      key: "no-photos",
      message:
        "No photos uploaded — photo evidence significantly strengthens your claim.",
      severity: "critical",
    });
  }

  if (!report.dashCamFootage || report.dashCamFootage.length === 0) {
    gaps.push({
      key: "no-dashcam",
      message:
        "No dash cam footage — dash cam evidence can be decisive for fault determination.",
      severity: "warning",
    });
  }

  if (!report.witnessStatement || report.witnessStatement.trim() === "") {
    gaps.push({
      key: "no-witness",
      message:
        "No witness statement — an independent witness account can support your claim.",
      severity: "warning",
    });
  }

  const policeInfo = (() => {
    try {
      if (!report.accidentMarker) return null;
      const json = report.accidentMarker.includes("__POLICE__")
        ? report.accidentMarker.split("__POLICE__")[1]
        : null;
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  })();

  if (!policeInfo?.policeRef || policeInfo.policeRef.trim() === "") {
    gaps.push({
      key: "no-police-ref",
      message:
        "No police reference number — obtaining one improves insurer credibility.",
      severity: "tip",
    });
  }

  if (!report.faultAnalysis && !report.faultLikelihoodAssessment) {
    gaps.push({
      key: "no-fault",
      message:
        "Fault split not calculated — run the fault likelihood assessment to strengthen your report.",
      severity: "warning",
    });
  }

  if (
    !report.accidentNarrative ||
    (typeof (report.accidentNarrative as { narrative?: string }).narrative ===
      "string" &&
      (
        (report.accidentNarrative as { narrative?: string }).narrative ?? ""
      ).trim() === "")
  ) {
    gaps.push({
      key: "no-narrative",
      message:
        "No accident narrative — generate an AI narrative to complete your report.",
      severity: "warning",
    });
  }

  // ── Smarter contextual checks ──────────────────────────────────────────────

  // Disputed fault + no witness
  const fla = report.faultLikelihoodAssessment;
  if (fla) {
    const partyA = Number(fla.partyAPercentage);
    const partyB = Number(fla.partyBPercentage);
    const isDisputed =
      partyA >= 30 && partyA <= 70 && partyB >= 30 && partyB <= 70;
    if (
      isDisputed &&
      (!report.witnessStatement || report.witnessStatement.trim() === "")
    ) {
      // Avoid duplicate no-witness message
      const hasWitness = gaps.find((g) => g.key === "no-witness");
      if (hasWitness) {
        hasWitness.message =
          "Disputed fault with no witness statement — this significantly weakens your claim position. An independent witness is critical when fault is contested between 30–70%.";
        hasWitness.severity = "critical";
      } else {
        gaps.push({
          key: "disputed-no-witness",
          message:
            "Disputed fault with no witness statement — this significantly weakens your claim position. An independent witness is critical when fault is contested between 30–70%.",
          severity: "critical",
        });
      }
    }

    // No dash cam for contested fault
    if (
      isDisputed &&
      (!report.dashCamFootage || report.dashCamFootage.length === 0)
    ) {
      const hasDashcam = gaps.find((g) => g.key === "no-dashcam");
      if (hasDashcam) {
        hasDashcam.message =
          "No dash cam evidence for a contested fault case — dash cam footage can be decisive in resolving disputed liability. Consider obtaining CCTV or witness corroboration.";
      } else {
        gaps.push({
          key: "contested-no-dashcam",
          message:
            "No dash cam evidence for a contested fault case — dash cam footage can be decisive in resolving disputed liability.",
          severity: "warning",
        });
      }
    }
  }

  // Injury description but no injury photos
  const hasInjuryDescription =
    report.damageDescription && report.damageDescription.trim() !== "";
  const hasInjuryPhotos =
    (report.imageData && report.imageData.length > 0) ||
    (report.photos && report.photos.length > 0);
  if (hasInjuryDescription && !hasInjuryPhotos) {
    gaps.push({
      key: "injury-no-photos",
      message:
        "Injury photos missing — insurers may challenge injury severity without visual evidence. Upload photos of visible injuries to support your claim.",
      severity: "warning",
    });
  }

  // (demand letter check handled at component level via reportId prop)

  return gaps;
}

const SEVERITY_STYLES: Record<
  Severity,
  {
    icon: React.ElementType;
    iconClass: string;
    rowClass: string;
    label: string;
  }
> = {
  critical: {
    icon: XCircle,
    iconClass: "text-red-500",
    rowClass: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    rowClass:
      "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",
    label: "Warning",
  },
  tip: {
    icon: Info,
    iconClass: "text-blue-500",
    rowClass:
      "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
    label: "Tip",
  },
};

interface EvidenceGapPanelProps {
  report: AccidentReport;
  reportId?: string;
}

export default function EvidenceGapPanel({
  report,
  reportId,
}: EvidenceGapPanelProps) {
  const [open, setOpen] = useState(true);

  // Add demand letter check if reportId is provided
  const extraGaps: GapItem[] = [];
  if (reportId) {
    const claimStatus = getReportStatus(reportId);
    const hasDemandLetter =
      localStorage.getItem(`demand_letter_generated_${reportId}`) === "1";
    if (claimStatus !== "draft" && !hasDemandLetter) {
      extraGaps.push({
        key: "submitted-no-demand",
        message:
          "No demand letter created yet — consider generating a formal demand letter before contacting your insurer to set out your position clearly.",
        severity: "tip",
      });
    }
  }

  const gaps = [...detectGaps(report), ...extraGaps];
  const criticalCount = gaps.filter((g) => g.severity === "critical").length;
  const warningCount = gaps.filter((g) => g.severity === "warning").length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card data-ocid="evidence-gap.panel">
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full gap-2"
            >
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Search className="w-4 h-4 text-muted-foreground" />
                Evidence Strength Check
              </CardTitle>
              <div className="flex items-center gap-2">
                {gaps.length === 0 ? (
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-300 text-emerald-700 dark:text-emerald-400"
                  >
                    Complete
                  </Badge>
                ) : (
                  <>
                    {criticalCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {criticalCount} critical
                      </Badge>
                    )}
                    {warningCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-amber-300 text-amber-700 dark:text-amber-400"
                      >
                        {warningCount} warning{warningCount > 1 ? "s" : ""}
                      </Badge>
                    )}
                    {gaps.length - criticalCount - warningCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-300 text-blue-700 dark:text-blue-400"
                      >
                        {gaps.length - criticalCount - warningCount} tip
                        {gaps.length - criticalCount - warningCount > 1
                          ? "s"
                          : ""}
                      </Badge>
                    )}
                  </>
                )}
                {open ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-4">
            {gaps.length === 0 ? (
              <div
                className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-400"
                data-ocid="evidence-gap.success_state"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-medium">
                  Evidence Complete — your report has all key evidence
                  components.
                </span>
              </div>
            ) : (
              <ul className="space-y-2">
                {gaps.map((gap, idx) => {
                  const cfg = SEVERITY_STYLES[gap.severity];
                  const IconComp = cfg.icon;
                  return (
                    <li
                      key={gap.key}
                      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${cfg.rowClass}`}
                      data-ocid={`evidence-gap.item.${idx + 1}`}
                    >
                      <IconComp
                        className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.iconClass}`}
                      />
                      <span className="text-foreground">{gap.message}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

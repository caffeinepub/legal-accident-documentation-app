import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Activity,
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import React, { useState } from "react";
import type { AIAnalysisResult } from "../backend";
import { getSimpleCorrelationsForRegions } from "../data/injuryCorrelation";

interface ClaimSummaryPanelProps {
  reportId: bigint;
  aiAnalysisResult?: AIAnalysisResult | null;
}

function SeverityBadge({ severity }: { severity: string }) {
  const lower = severity.toLowerCase();
  if (lower.includes("severe") && !lower.includes("moderate")) {
    return <Badge variant="destructive">{severity}</Badge>;
  }
  if (lower.includes("moderate")) {
    return (
      <Badge
        variant="secondary"
        className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30"
      >
        {severity}
      </Badge>
    );
  }
  return <Badge variant="outline">{severity}</Badge>;
}

export default function ClaimSummaryPanel({
  aiAnalysisResult,
}: ClaimSummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Show a sample of rule-based correlations for reference context
  const sampleRegionIds = ["HEAD_FACE", "NECK_WHIPLASH", "CHEST_STERNUM"];
  const ruleBasedCorrelations = getSimpleCorrelationsForRegions(
    sampleRegionIds,
  ).slice(0, 3);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">
                AI Incident Analysis &amp; Claim Summary
              </h3>
              <p className="text-sm text-muted-foreground">
                {aiAnalysisResult
                  ? `${aiAnalysisResult.inferredCrashType} — ${aiAnalysisResult.severity}`
                  : "Upload photos to generate AI-powered claim insights"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {aiAnalysisResult ? (
              <Badge variant="default" className="bg-primary">
                Analysis Available
              </Badge>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 p-4 bg-card border border-border rounded-lg space-y-6">
          {/* No analysis yet */}
          {!aiAnalysisResult && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="p-3 bg-muted rounded-full">
                <Brain className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  No AI Analysis Yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the <strong>Injury &amp; Damage Photo Analysis</strong>{" "}
                  panel below to upload photos and generate an AI-powered
                  incident analysis. The results will appear here as part of
                  your claim summary.
                </p>
              </div>
            </div>
          )}

          {/* AI Analysis Results */}
          {aiAnalysisResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">
                  AI-Generated Incident Analysis
                </h4>
                <Badge variant="secondary" className="text-xs">
                  Multimodal Vision
                </Badge>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                    Inferred Crash Type
                  </p>
                  <p className="font-semibold text-foreground">
                    {aiAnalysisResult.inferredCrashType}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 border border-border rounded-md flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                      Severity Assessment
                    </p>
                    <SeverityBadge severity={aiAnalysisResult.severity} />
                  </div>
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Narrative */}
              <div className="p-4 bg-muted/30 border border-border rounded-md">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Incident Narrative
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {aiAnalysisResult.narrativeText}
                </p>
              </div>

              {/* Correlation Summary */}
              <div className="p-4 bg-muted/30 border border-border rounded-md">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Injury–Damage Correlation
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {aiAnalysisResult.correlationSummary}
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  This AI analysis is generated from photographic evidence and
                  is intended to support — not replace — professional medical
                  and legal assessment. Always consult qualified professionals
                  for formal injury and liability determinations.
                </p>
              </div>
            </div>
          )}

          {/* Rule-Based Reference */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-foreground text-sm">
                Biomechanical Reference Data
              </h4>
              <Badge variant="outline" className="text-xs">
                Rule-Based
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Standard injury-to-crash-type correlations from biomechanical
              research, shown for reference alongside the AI analysis.
            </p>
            <div className="space-y-2">
              {ruleBasedCorrelations.map((corr) => (
                <div
                  key={corr.crashType}
                  className="p-3 bg-muted/20 border border-border rounded-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-foreground">
                      {corr.crashType}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        corr.severity === "high"
                          ? "border-destructive/50 text-destructive"
                          : corr.severity === "medium"
                            ? "border-amber-500/50 text-amber-600"
                            : "border-green-500/50 text-green-600"
                      }`}
                    >
                      {corr.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {corr.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

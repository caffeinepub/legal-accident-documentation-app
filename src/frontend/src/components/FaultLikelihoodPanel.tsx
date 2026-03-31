import type { AccidentReport, FaultLikelihoodAssessment } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useUpdateAccidentAssessment } from "@/hooks/useQueries";
import { calculateFaultLikelihood } from "@/utils/faultLikelihoodCalculator";
import {
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Scale,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const ADDITIONAL_PARTIES_DELIMITER = "---ADDITIONAL_PARTIES---";

function parseAdditionalPartyCount(witnessStatement: string): number {
  if (!witnessStatement.includes(ADDITIONAL_PARTIES_DELIMITER)) return 0;
  try {
    const jsonPart = witnessStatement.split(ADDITIONAL_PARTIES_DELIMITER)[1];
    const parsed = JSON.parse(jsonPart.trim());
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

interface FaultLikelihoodPanelProps {
  reportId: bigint;
  report: AccidentReport;
  faultLikelihoodAssessment?: FaultLikelihoodAssessment;
}

function hasAIEvidence(report: AccidentReport): boolean {
  return !!(
    report.aiAnalysisResult?.photoAnalysis ||
    report.aiAnalysisResult?.inferredCrashType ||
    report.aiAnalysisResult?.correlationSummary
  );
}

function getFaultColor(percent: number): string {
  if (percent >= 70) return "#ef4444";
  if (percent >= 50) return "#f97316";
  return "#22c55e";
}

function getFaultLabel(percent: number): string {
  if (percent >= 80) return "Primary Fault";
  if (percent >= 60) return "Majority Fault";
  if (percent >= 40) return "Shared Fault";
  if (percent >= 20) return "Minor Fault";
  return "Minimal Fault";
}

export default function FaultLikelihoodPanel({
  reportId,
  report,
  faultLikelihoodAssessment,
}: FaultLikelihoodPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localAssessment, setLocalAssessment] =
    useState<FaultLikelihoodAssessment | null>(
      faultLikelihoodAssessment ?? null,
    );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateAssessment = useUpdateAccidentAssessment();
  const { t } = useLanguage();

  useEffect(() => {
    if (faultLikelihoodAssessment)
      setLocalAssessment(faultLikelihoodAssessment);
  }, [faultLikelihoodAssessment]);

  const handleGenerate = async () => {
    const calculated = calculateFaultLikelihood(report);
    setLocalAssessment(calculated);
    await updateAssessment.mutateAsync({
      reportId,
      accidentNarrative: report.accidentNarrative ?? null,
      damageSeverity: report.damageSeverity ?? null,
      faultLikelihoodAssessment: calculated,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const partyA = localAssessment
    ? Number(localAssessment.partyAPercentage)
    : 50;
  const partyB = localAssessment
    ? Number(localAssessment.partyBPercentage)
    : 50;
  const confidence = localAssessment
    ? Number(localAssessment.confidenceLevel)
    : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-blue-200/50 dark:border-blue-800/30">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
            >
              <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
                <Scale size={16} className="text-blue-500" />
                Fault Likelihood Assessment
                {localAssessment && (
                  <Badge
                    variant="outline"
                    className="text-xs text-blue-600 border-blue-400"
                  >
                    Party A: {partyA}% | Party B: {partyB}%
                  </Badge>
                )}
                {localAssessment && hasAIEvidence(report) && (
                  <Badge
                    variant="outline"
                    className="text-xs text-violet-600 border-violet-400 flex items-center gap-1"
                  >
                    <Bot size={10} />
                    AI-Informed
                  </Badge>
                )}
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} /> Saved
                  </span>
                )}
              </CardTitle>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-5 pt-0">
            {/* Multi-party notice */}
            {(() => {
              const extraCount = parseAdditionalPartyCount(
                report.witnessStatement ?? "",
              );
              const totalExtra = (report.otherVehicle ? 1 : 0) + extraCount;
              if (totalExtra <= 1) return null;
              return (
                <div className="flex items-start gap-2 rounded-md bg-blue-50 border border-blue-200 px-3 py-2.5 dark:bg-blue-900/10 dark:border-blue-800/40">
                  <Users
                    size={14}
                    className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    <strong>
                      This incident involves {totalExtra} additional{" "}
                      {totalExtra === 1 ? "party" : "parties"}.
                    </strong>{" "}
                    Fault assessment reflects the primary two parties only. Full
                    multi-party liability requires legal review.
                  </p>
                </div>
              );
            })()}

            {!localAssessment ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Scale size={32} className="text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground max-w-sm">
                  Calculate a percentage-based fault likelihood split using
                  collision type, violations, dash cam signals, road conditions,
                  and AI photo &amp; crash-type analysis.
                  {hasAIEvidence(report) && (
                    <span className="block mt-1 text-violet-600 font-medium text-xs">
                      AI evidence detected — will be used in assessment.
                    </span>
                  )}
                </p>
                <Button
                  onClick={handleGenerate}
                  size="sm"
                  className="gap-2"
                  disabled={updateAssessment.isPending}
                >
                  {updateAssessment.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {t("fault.calculate")}
                </Button>
              </div>
            ) : (
              <>
                {/* Fault split bar */}
                <div className="space-y-3">
                  <div className="flex h-12 rounded-lg overflow-hidden border border-border">
                    {partyA > 0 && (
                      <div
                        className="flex items-center justify-center text-white font-bold text-sm transition-all"
                        style={{
                          width: `${partyA}%`,
                          backgroundColor: getFaultColor(partyA),
                        }}
                      >
                        {partyA}%
                      </div>
                    )}
                    {partyB > 0 && (
                      <div
                        className="flex items-center justify-center text-white font-bold text-sm transition-all"
                        style={{
                          width: `${partyB}%`,
                          backgroundColor: getFaultColor(partyB),
                        }}
                      >
                        {partyB}%
                      </div>
                    )}
                  </div>

                  {/* Party labels */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                        {t("fault.party_a")}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: getFaultColor(partyA) }}
                      >
                        {partyA}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getFaultLabel(partyA)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                        {t("fault.party_b")}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: getFaultColor(partyB) }}
                      >
                        {partyB}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getFaultLabel(partyB)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confidence level */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      {t("fault.confidence")}
                    </span>
                    <span className="font-semibold">{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {confidence >= 70
                      ? "Sufficient evidential basis to support determination"
                      : confidence >= 40
                        ? "Further evidence is recommended to strengthen this determination"
                        : "Evidential basis is insufficient; determination is provisional"}
                  </p>
                </div>

                <Separator />

                {/* Reasoning */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("fault.basis")}
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border text-sm leading-relaxed">
                    {localAssessment.reasoning}
                  </div>
                </div>

                {/* Supporting factors */}
                {localAssessment.supportingFactors &&
                  localAssessment.supportingFactors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <ThumbsUp size={12} className="text-green-500" />
                        {t("fault.supporting")}
                      </p>
                      <ul className="space-y-1.5">
                        {localAssessment.supportingFactors.map((factor) => (
                          <li
                            key={factor}
                            className="flex items-start gap-2 text-xs"
                          >
                            <CheckCircle
                              size={12}
                              className="text-green-500 mt-0.5 shrink-0"
                            />
                            <span className="text-foreground">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Conflicting factors */}
                {localAssessment.conflictingFactors &&
                  localAssessment.conflictingFactors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <ThumbsDown size={12} className="text-amber-500" />
                        {t("fault.mitigating")}
                      </p>
                      <ul className="space-y-1.5">
                        {localAssessment.conflictingFactors.map((factor) => (
                          <li
                            key={factor}
                            className="flex items-start gap-2 text-xs"
                          >
                            <span className="text-amber-500 mt-0.5 shrink-0">
                              ⚠
                            </span>
                            <span className="text-foreground">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Road position impact */}
                {localAssessment.roadPositionImpact && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <MapPin size={12} className="text-blue-500" />
                      {t("fault.road_position")}
                    </p>
                    <p className="text-xs text-foreground leading-relaxed p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                      {localAssessment.roadPositionImpact}
                    </p>
                  </div>
                )}

                {/* Recalculate */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={updateAssessment.isPending}
                    className="gap-1 text-xs h-7"
                  >
                    {updateAssessment.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Recalculate
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

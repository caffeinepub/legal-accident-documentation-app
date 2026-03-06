import type { AccidentReport, DamageSeverity } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useUpdateAccidentAssessment } from "@/hooks/useQueries";
import { calculateDamageSeverity } from "@/utils/damageSeverityCalculator";
import {
  BrainCircuit,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface DamageSeverityPanelProps {
  reportId: bigint;
  report: AccidentReport;
  damageSeverity?: DamageSeverity;
}

const SEVERITY_CONFIG: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Minor: {
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
  },
  Moderate: {
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  Severe: {
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
  },
  Critical: {
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
  },
};

function getScoreColor(score: number): string {
  if (score <= 2) return "#22c55e";
  if (score <= 4) return "#eab308";
  if (score <= 6) return "#f97316";
  if (score <= 8) return "#ef4444";
  return "#7f1d1d";
}

function getScoreBg(score: number): string {
  if (score <= 2) return "bg-green-100 dark:bg-green-900/30";
  if (score <= 4) return "bg-yellow-100 dark:bg-yellow-900/30";
  if (score <= 6) return "bg-orange-100 dark:bg-orange-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

// SVG vehicle diagram with clickable zones
function VehicleDiagramHeatMap({
  heatMap,
}: { heatMap: DamageSeverity["heatMap"] }) {
  const getZoneColor = (zoneName: string): string => {
    const entry = heatMap.find(
      (h) => h.zone.toLowerCase() === zoneName.toLowerCase(),
    );
    if (!entry) return "#e5e7eb";
    const severity = Number(entry.severity);
    return getScoreColor(severity);
  };

  const getZoneOpacity = (zoneName: string): number => {
    const entry = heatMap.find(
      (h) => h.zone.toLowerCase() === zoneName.toLowerCase(),
    );
    if (!entry) return 0.15;
    const severity = Number(entry.severity);
    return severity === 0 ? 0.1 : 0.3 + (severity / 10) * 0.5;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[280px]">
        {/* Top-down vehicle SVG */}
        <svg
          viewBox="0 0 200 320"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Vehicle damage diagram"
          role="img"
        >
          <title>Vehicle damage diagram</title>
          {/* Vehicle body outline */}
          <rect
            x="40"
            y="20"
            width="120"
            height="280"
            rx="30"
            fill="#f3f4f6"
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* FRONT zone */}
          <rect
            x="40"
            y="20"
            width="120"
            height="70"
            rx="30"
            fill={getZoneColor("front")}
            fillOpacity={getZoneOpacity("front")}
            stroke={getZoneColor("front")}
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="62"
            textAnchor="middle"
            fontSize="10"
            fill="#374151"
            fontWeight="600"
          >
            FRONT
          </text>

          {/* REAR zone */}
          <rect
            x="40"
            y="230"
            width="120"
            height="70"
            rx="30"
            fill={getZoneColor("rear")}
            fillOpacity={getZoneOpacity("rear")}
            stroke={getZoneColor("rear")}
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="272"
            textAnchor="middle"
            fontSize="10"
            fill="#374151"
            fontWeight="600"
          >
            REAR
          </text>

          {/* LEFT zone (driver side) */}
          <rect
            x="40"
            y="90"
            width="35"
            height="140"
            fill={getZoneColor("left")}
            fillOpacity={getZoneOpacity("left")}
            stroke={getZoneColor("left")}
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <text
            x="57"
            y="165"
            textAnchor="middle"
            fontSize="9"
            fill="#374151"
            fontWeight="600"
            transform="rotate(-90, 57, 165)"
          >
            LEFT
          </text>

          {/* RIGHT zone (passenger side) */}
          <rect
            x="125"
            y="90"
            width="35"
            height="140"
            fill={getZoneColor("right")}
            fillOpacity={getZoneOpacity("right")}
            stroke={getZoneColor("right")}
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <text
            x="143"
            y="165"
            textAnchor="middle"
            fontSize="9"
            fill="#374151"
            fontWeight="600"
            transform="rotate(90, 143, 165)"
          >
            RIGHT
          </text>

          {/* ROOF zone (centre) */}
          <rect
            x="75"
            y="90"
            width="50"
            height="140"
            fill={getZoneColor("roof")}
            fillOpacity={getZoneOpacity("roof")}
            stroke={getZoneColor("roof")}
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="165"
            textAnchor="middle"
            fontSize="10"
            fill="#374151"
            fontWeight="600"
          >
            ROOF
          </text>

          {/* UNDERCARRIAGE indicator (small strip at bottom of centre) */}
          <rect
            x="80"
            y="240"
            width="40"
            height="20"
            fill={getZoneColor("undercarriage")}
            fillOpacity={getZoneOpacity("undercarriage")}
            stroke={getZoneColor("undercarriage")}
            strokeOpacity="0.6"
            strokeWidth="1"
            rx="3"
          />
          <text
            x="100"
            y="254"
            textAnchor="middle"
            fontSize="7"
            fill="#374151"
            fontWeight="600"
          >
            UNDER
          </text>

          {/* Windscreen */}
          <rect
            x="55"
            y="75"
            width="90"
            height="25"
            rx="5"
            fill="#dbeafe"
            fillOpacity="0.6"
            stroke="#93c5fd"
            strokeWidth="1"
          />
          {/* Rear window */}
          <rect
            x="55"
            y="220"
            width="90"
            height="20"
            rx="5"
            fill="#dbeafe"
            fillOpacity="0.6"
            stroke="#93c5fd"
            strokeWidth="1"
          />
          {/* Wheels */}
          <rect x="22" y="80" width="18" height="35" rx="4" fill="#6b7280" />
          <rect x="160" y="80" width="18" height="35" rx="4" fill="#6b7280" />
          <rect x="22" y="205" width="18" height="35" rx="4" fill="#6b7280" />
          <rect x="160" y="205" width="18" height="35" rx="4" fill="#6b7280" />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap justify-center text-xs text-muted-foreground">
        {[
          { label: "None", color: "#e5e7eb" },
          { label: "Minor", color: "#22c55e" },
          { label: "Moderate", color: "#eab308" },
          { label: "Severe", color: "#f97316" },
          { label: "Critical", color: "#ef4444" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DamageSeverityPanel({
  reportId,
  report,
  damageSeverity,
}: DamageSeverityPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localSeverity, setLocalSeverity] = useState<DamageSeverity | null>(
    damageSeverity ?? null,
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAiInformed, setIsAiInformed] = useState(false);

  const updateAssessment = useUpdateAccidentAssessment();

  useEffect(() => {
    if (damageSeverity) setLocalSeverity(damageSeverity);
  }, [damageSeverity]);

  const handleGenerate = async () => {
    const photoAnalysis = report.aiAnalysisResult?.photoAnalysis;
    const calculated = calculateDamageSeverity(report, photoAnalysis);
    setIsAiInformed(calculated.aiInformed ?? false);
    setLocalSeverity(calculated);
    await updateAssessment.mutateAsync({
      reportId,
      accidentNarrative: report.accidentNarrative ?? null,
      damageSeverity: calculated,
      faultLikelihoodAssessment: report.faultLikelihoodAssessment ?? null,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const score = localSeverity ? Number(localSeverity.priorityScore) : 0;
  const label = localSeverity?.severityLabel ?? "";
  const severityConfig = SEVERITY_CONFIG[label] ?? SEVERITY_CONFIG.Moderate;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-orange-200/50 dark:border-orange-800/30">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
            >
              <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
                <ShieldAlert size={16} className="text-orange-500" />
                Vehicle Damage Assessment
                {localSeverity && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${severityConfig.color} ${severityConfig.border}`}
                  >
                    Damage Rating: {label} ({score}/10)
                  </Badge>
                )}
                {localSeverity && isAiInformed && (
                  <Badge
                    variant="outline"
                    className="text-xs border-violet-400 text-violet-700 dark:text-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20 flex items-center gap-1"
                  >
                    <BrainCircuit size={10} />
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
            {!localSeverity ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <ShieldAlert size={32} className="text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground max-w-sm">
                  Calculate damage severity scores across all vehicle zones
                  using reported damage details and dash cam analysis.
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
                  Calculate Severity
                </Button>
              </div>
            ) : (
              <>
                {/* Score header */}
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border ${severityConfig.bg} ${severityConfig.border}`}
                >
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
                      Assessed Vehicle Damage
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-bold ${severityConfig.color}`}
                      >
                        {score}
                      </span>
                      <span className="text-muted-foreground text-sm">/10</span>
                      <span
                        className={`text-lg font-semibold ${severityConfig.color}`}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Loss Probability
                    </p>
                    <p className={`text-xl font-bold ${severityConfig.color}`}>
                      {Number(localSeverity.totalLossProbability)}%
                    </p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minor (1–3)</span>
                    <span>Moderate (4–6)</span>
                    <span>Severe (7–8)</span>
                    <span>Critical (9–10)</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score * 10}%`,
                        backgroundColor: getScoreColor(score),
                      }}
                    />
                  </div>
                </div>

                <Separator />

                {/* Vehicle diagram heat map */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Vehicle Damage Diagram
                  </p>
                  <VehicleDiagramHeatMap heatMap={localSeverity.heatMap} />
                </div>

                <Separator />

                {/* Zone breakdown */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Damage Particulars by Vehicle Zone
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {localSeverity.vehicleZones.map((zone) => {
                      const zScore = Number(zone.score);
                      return (
                        <div
                          key={zone.zone}
                          className={`p-3 rounded-lg border ${getScoreBg(zScore)} border-border`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold">
                              {zone.zone}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className="text-xs h-5 px-1.5"
                              >
                                {zone.damageType}
                              </Badge>
                              <span
                                className="text-sm font-bold"
                                style={{ color: getScoreColor(zScore) }}
                              >
                                {zScore}/10
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {zone.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

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

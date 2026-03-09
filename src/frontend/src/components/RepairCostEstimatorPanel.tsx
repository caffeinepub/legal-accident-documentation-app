import type { DamageSeverity } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Wrench,
} from "lucide-react";
import { useState } from "react";

interface RepairCostEstimatorPanelProps {
  damageSeverity?: DamageSeverity;
  crashType?: string;
}

type SeverityBand = "minor" | "moderate" | "severe" | "critical";
type CrashTypeKey =
  | "rear_end"
  | "head_on"
  | "side_impact"
  | "sideswipe"
  | "rollover"
  | "multi_vehicle"
  | "low_speed";

const CRASH_TYPE_LABELS: Record<CrashTypeKey, string> = {
  rear_end: "Rear-end",
  head_on: "Head-on",
  side_impact: "Side impact (T-bone)",
  sideswipe: "Sideswipe",
  rollover: "Rollover",
  multi_vehicle: "Multi-vehicle",
  low_speed: "Low-speed / parking",
};

type CostRange = string | null;

const REPAIR_TABLE: Record<CrashTypeKey, Record<SeverityBand, CostRange>> = {
  rear_end: {
    minor: "£500 – £1,500",
    moderate: "£1,500 – £4,000",
    severe: "£4,000 – £8,000",
    critical: "£8,000 – £15,000",
  },
  head_on: {
    minor: "£1,000 – £3,000",
    moderate: "£3,000 – £8,000",
    severe: "£8,000 – £18,000",
    critical: "£18,000 – £35,000+",
  },
  side_impact: {
    minor: "£800 – £2,500",
    moderate: "£2,500 – £6,000",
    severe: "£6,000 – £14,000",
    critical: "£14,000 – £25,000+",
  },
  sideswipe: {
    minor: "£300 – £1,000",
    moderate: "£1,000 – £3,000",
    severe: "£3,000 – £7,000",
    critical: "£7,000 – £15,000",
  },
  rollover: {
    minor: "£2,000 – £5,000",
    moderate: "£5,000 – £12,000",
    severe: "£12,000 – £22,000",
    critical: "£22,000 – £40,000+",
  },
  multi_vehicle: {
    minor: "£1,000 – £3,500",
    moderate: "£3,500 – £9,000",
    severe: "£9,000 – £20,000",
    critical: "£20,000 – £35,000+",
  },
  low_speed: {
    minor: "£200 – £800",
    moderate: "£800 – £2,500",
    severe: null,
    critical: null,
  },
};

const SEVERITY_COLORS: Record<SeverityBand, string> = {
  minor:
    "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/40",
  moderate:
    "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40",
  severe:
    "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/40",
  critical:
    "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/40",
};

function scoreToSeverityBand(score: number): SeverityBand {
  if (score <= 3) return "minor";
  if (score <= 6) return "moderate";
  if (score <= 8) return "severe";
  return "critical";
}

function normaliseCrashType(raw: string): CrashTypeKey | null {
  const lower = raw.toLowerCase();
  if (lower.includes("rear")) return "rear_end";
  if (lower.includes("head")) return "head_on";
  if (lower.includes("side") && lower.includes("swipe")) return "sideswipe";
  if (
    lower.includes("side") ||
    lower.includes("t-bone") ||
    lower.includes("tbone")
  )
    return "side_impact";
  if (lower.includes("roll")) return "rollover";
  if (lower.includes("multi")) return "multi_vehicle";
  if (lower.includes("park") || lower.includes("low")) return "low_speed";
  return null;
}

export default function RepairCostEstimatorPanel({
  damageSeverity,
  crashType,
}: RepairCostEstimatorPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const detectedCrashKey = crashType ? normaliseCrashType(crashType) : null;
  const autoScore = damageSeverity
    ? Number(damageSeverity.priorityScore)
    : null;
  const autoSeverityBand = autoScore ? scoreToSeverityBand(autoScore) : null;

  const [selectedCrash, setSelectedCrash] = useState<CrashTypeKey | "">(
    detectedCrashKey ?? "",
  );
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityBand | "">(
    autoSeverityBand ?? "",
  );

  const costRange =
    selectedCrash && selectedSeverity
      ? REPAIR_TABLE[selectedCrash][selectedSeverity]
      : null;

  const score = autoScore ?? (selectedSeverity ? 5 : null);
  const showWriteOffSCatSN = score !== null && score >= 8;
  const showWriteOffSCatAB = score !== null && score >= 9;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-orange-200/60 dark:border-orange-800/30">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
              data-ocid="repair.open_modal_button"
            >
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench size={16} className="text-orange-500" />
                Repair Cost Estimator
                {(detectedCrashKey || autoSeverityBand) && (
                  <Badge
                    variant="outline"
                    className="text-xs text-orange-600 border-orange-400"
                  >
                    Auto-detected
                  </Badge>
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
            {/* Auto-detected info */}
            {(detectedCrashKey || autoScore) && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 text-xs text-orange-800 dark:text-orange-300">
                <Info size={13} className="shrink-0 mt-0.5" />
                <span>
                  {detectedCrashKey && (
                    <>
                      Crash type{" "}
                      <strong>{CRASH_TYPE_LABELS[detectedCrashKey]}</strong>{" "}
                      auto-detected from AI analysis.{" "}
                    </>
                  )}
                  {autoScore !== null && (
                    <>
                      Damage severity score <strong>{autoScore}/10</strong>{" "}
                      used.
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Crash type selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Crash Type
              </Label>
              <Select
                value={selectedCrash}
                onValueChange={(v) => setSelectedCrash(v as CrashTypeKey)}
              >
                <SelectTrigger data-ocid="repair.select">
                  <SelectValue placeholder="Select crash type…" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CRASH_TYPE_LABELS) as CrashTypeKey[]).map(
                    (k) => (
                      <SelectItem key={k} value={k}>
                        {CRASH_TYPE_LABELS[k]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Severity selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Damage Severity
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ["minor", "moderate", "severe", "critical"] as SeverityBand[]
                ).map((band) => (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setSelectedSeverity(band)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold capitalize transition-all ${
                      selectedSeverity === band
                        ? SEVERITY_COLORS[band]
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60"
                    }`}
                    data-ocid={"repair.toggle"}
                  >
                    {band}
                    <span className="block font-normal text-[10px] mt-0.5 opacity-70">
                      {band === "minor"
                        ? "Score 1–3"
                        : band === "moderate"
                          ? "Score 4–6"
                          : band === "severe"
                            ? "Score 7–8"
                            : "Score 9–10"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {costRange && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40">
                    <div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wide">
                        Estimated Repair Range
                      </p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-0.5">
                        {costRange}
                      </p>
                      <p className="text-xs text-orange-500 mt-0.5">
                        {CRASH_TYPE_LABELS[selectedCrash as CrashTypeKey]} ·{" "}
                        {selectedSeverity} damage
                      </p>
                    </div>
                    <Wrench
                      size={32}
                      className="text-orange-300 dark:text-orange-700"
                    />
                  </div>

                  {/* Write-off guidance */}
                  {showWriteOffSCatSN && (
                    <div
                      className={`flex items-start gap-2 p-3 rounded-lg border text-xs leading-relaxed ${
                        showWriteOffSCatAB
                          ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700/40 text-red-800 dark:text-red-300"
                          : "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/40 text-amber-800 dark:text-amber-300"
                      }`}
                      data-ocid="repair.error_state"
                    >
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>Write-off risk:</strong>{" "}
                        {showWriteOffSCatAB ? (
                          <>
                            Severity score ≥ 9 — Category{" "}
                            <strong>A or B</strong> write-off is possible. The
                            vehicle may be declared unroadworthy.
                          </>
                        ) : (
                          <>
                            Severity score ≥ 8 — vehicle may be declared a
                            Category <strong>S or N</strong> write-off by the
                            insurer.
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedCrash &&
              selectedSeverity &&
              REPAIR_TABLE[selectedCrash as CrashTypeKey][
                selectedSeverity as SeverityBand
              ] === null && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  No standard repair cost data is available for this combination
                  (e.g. low-speed severe/critical). Obtain a professional
                  assessment.
                </div>
              )}

            <Separator />
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border">
              <Info
                size={13}
                className="text-muted-foreground shrink-0 mt-0.5"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Estimates are indicative ranges based on typical UK repair costs
                and are <strong>not a formal quotation</strong>. Always obtain
                quotes from approved repairers. Figures may vary by region,
                vehicle type, and parts availability.
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

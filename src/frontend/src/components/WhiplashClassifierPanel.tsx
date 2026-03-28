import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Brain, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";

interface WhiplashClassifierPanelProps {
  injuryDescription?: string;
  reportId: bigint;
}

type InjuryType = "whiplash_only" | "whiplash_psychological";
type DurationBand =
  | "0_3"
  | "3_6"
  | "6_9"
  | "9_12"
  | "12_15"
  | "15_18"
  | "18_24";

const DURATION_LABELS: Record<DurationBand, string> = {
  "0_3": "0 – 3 months",
  "3_6": "3 – 6 months",
  "6_9": "6 – 9 months",
  "9_12": "9 – 12 months",
  "12_15": "12 – 15 months",
  "15_18": "15 – 18 months",
  "18_24": "18 – 24 months",
};

const WRP_TARIFF: Record<DurationBand, number> = {
  "0_3": 240,
  "3_6": 495,
  "6_9": 840,
  "9_12": 1320,
  "12_15": 2040,
  "15_18": 3005,
  "18_24": 4215,
};

// Malta soft tissue injury compensation bands (EUR)
const MALTA_ST_TARIFF: Record<DurationBand, number> = {
  "0_3": 1500,
  "3_6": 2500,
  "6_9": 4000,
  "9_12": 6000,
  "12_15": 8500,
  "15_18": 11000,
  "18_24": 14000,
};

function roundToNearest5(n: number): number {
  return Math.round(n / 5) * 5;
}

function formatCurrencyGBP(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}
function formatCurrencyEUR(n: number): string {
  return new Intl.NumberFormat("mt-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function WhiplashClassifierPanel({
  injuryDescription,
  reportId: _reportId,
}: WhiplashClassifierPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { country } = useCountry();
  const isMalta = country === "mt";
  const [injuryType, setInjuryType] = useState<InjuryType>("whiplash_only");
  const [duration, setDuration] = useState<DurationBand | "">("");
  const [calculated, setCalculated] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!duration) return;
    const activeTariff = isMalta ? MALTA_ST_TARIFF : WRP_TARIFF;
    const base = activeTariff[duration];
    const result =
      injuryType === "whiplash_psychological"
        ? roundToNearest5(base * 1.1)
        : base;
    setCalculated(result);
  };

  const isAbovePortalThreshold = calculated !== null && calculated > 5000;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-violet-200/60 dark:border-violet-800/30">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
              data-ocid="whiplash.open_modal_button"
            >
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain size={16} className="text-violet-500" />
                {isMalta
                  ? "Soft Tissue Injury Estimator"
                  : "Whiplash Injury Classifier"}
                <Badge
                  variant="outline"
                  className="text-xs text-violet-600 border-violet-400"
                >
                  {isMalta ? "Civil Code Cap. 16" : "WRP 2021"}
                </Badge>
              </CardTitle>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-5 pt-0">
            {injuryDescription && (
              <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border">
                <span className="font-medium">From report:</span>{" "}
                {injuryDescription.slice(0, 120)}
                {injuryDescription.length > 120 ? "…" : ""}
              </div>
            )}

            {/* Injury type */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Injury Type
              </Label>
              <RadioGroup
                value={injuryType}
                onValueChange={(v) => {
                  setInjuryType(v as InjuryType);
                  setCalculated(null);
                }}
                className="space-y-1.5"
                data-ocid="whiplash.radio"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="whiplash_only" id="wh-only" />
                  <Label htmlFor="wh-only" className="text-sm cursor-pointer">
                    Whiplash only
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="whiplash_psychological"
                    id="wh-psych"
                  />
                  <Label htmlFor="wh-psych" className="text-sm cursor-pointer">
                    Whiplash + minor psychological injury
                    <span className="ml-1.5 text-xs text-violet-600 font-medium">
                      (+10% uplift)
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Duration band */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Estimated Injury Duration
              </Label>
              <Select
                value={duration}
                onValueChange={(v) => {
                  setDuration(v as DurationBand);
                  setCalculated(null);
                }}
              >
                <SelectTrigger className="w-full" data-ocid="whiplash.select">
                  <SelectValue placeholder="Select duration band…" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DURATION_LABELS) as DurationBand[]).map(
                    (band) => (
                      <SelectItem key={band} value={band}>
                        {DURATION_LABELS[band]}
                        <span className="ml-2 text-muted-foreground text-xs">
                          —{" "}
                          {isMalta
                            ? formatCurrencyEUR(MALTA_ST_TARIFF[band])
                            : formatCurrencyGBP(WRP_TARIFF[band])}
                        </span>
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              size="sm"
              className="w-full gap-2"
              onClick={handleCalculate}
              disabled={!duration}
              data-ocid="whiplash.primary_button"
            >
              <Brain size={14} />
              {isMalta ? "Calculate Compensation" : "Calculate WRP Tariff"}
            </Button>

            {/* Result */}
            {calculated !== null && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/40">
                    <div>
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-medium uppercase tracking-wide">
                        Indicative Tariff Value
                      </p>
                      <p className="text-3xl font-bold text-violet-700 dark:text-violet-300 mt-0.5">
                        {isMalta
                          ? formatCurrencyEUR(calculated)
                          : formatCurrencyGBP(calculated)}
                      </p>
                      {injuryType === "whiplash_psychological" && (
                        <p className="text-xs text-violet-500 mt-0.5">
                          Includes 10% psychological uplift
                        </p>
                      )}
                    </div>
                    <Brain
                      size={32}
                      className="text-violet-300 dark:text-violet-700"
                    />
                  </div>

                  {isAbovePortalThreshold && !isMalta && (
                    <div
                      className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/40"
                      data-ocid="whiplash.error_state"
                    >
                      <AlertCircle
                        size={14}
                        className="text-amber-600 mt-0.5 shrink-0"
                      />
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        <strong>Note:</strong> Claims above £5,000 exit the OIC
                        portal. This claim may need to be progressed through the
                        Civil Procedure Rules track instead.
                      </p>
                    </div>
                  )}

                  {/* WRP table reference */}
                  <details className="group">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
                      <ChevronDown
                        size={12}
                        className="group-open:rotate-180 transition-transform"
                      />
                      {isMalta
                        ? "View indicative soft tissue injury reference bands (Maltese court practice)"
                        : "View full WRP 2021 tariff table"}
                    </summary>
                    <div className="mt-2 rounded-lg border border-border overflow-hidden text-xs">
                      <table className="w-full">
                        <thead className="bg-muted/60">
                          <tr>
                            <th className="text-left px-2 py-1.5 text-muted-foreground font-medium">
                              Duration
                            </th>
                            <th className="text-right px-2 py-1.5 text-muted-foreground font-medium">
                              Whiplash only
                            </th>
                            <th className="text-right px-2 py-1.5 text-muted-foreground font-medium">
                              + Psych uplift
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(Object.keys(DURATION_LABELS) as DurationBand[]).map(
                            (band, i) => (
                              <tr
                                key={band}
                                className={`${
                                  duration === band
                                    ? "bg-violet-50 dark:bg-violet-950/20"
                                    : i % 2 === 0
                                      ? "bg-background"
                                      : "bg-muted/20"
                                } border-t border-border`}
                              >
                                <td className="px-2 py-1.5 text-foreground">
                                  {DURATION_LABELS[band]}
                                </td>
                                <td className="px-2 py-1.5 text-right font-mono">
                                  {isMalta
                                    ? formatCurrencyEUR(MALTA_ST_TARIFF[band])
                                    : formatCurrencyGBP(WRP_TARIFF[band])}
                                </td>
                                <td className="px-2 py-1.5 text-right font-mono text-violet-600">
                                  {isMalta
                                    ? formatCurrencyEUR(
                                        roundToNearest5(
                                          MALTA_ST_TARIFF[band] * 1.1,
                                        ),
                                      )
                                    : formatCurrencyGBP(
                                        roundToNearest5(WRP_TARIFF[band] * 1.1),
                                      )}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              </>
            )}

            <Separator />
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border">
              <Info
                size={13}
                className="text-muted-foreground shrink-0 mt-0.5"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isMalta ? (
                  <>
                    This tool is <strong>informational only</strong> and
                    provides indicative soft tissue injury compensation bands
                    under Maltese personal injury guidelines (Civil Code Cap.
                    16). Actual awards depend on individual case facts, medical
                    evidence, and judicial assessment. Always consult a Maltese
                    advocate.
                  </>
                ) : (
                  <>
                    This tool is <strong>informational only</strong> and applies
                    the UK Whiplash Reform Protocol (WRP) 2021 fixed tariff
                    under the Civil Liability Act 2018. Actual compensation
                    depends on individual case facts and medical evidence.
                    Always consult a qualified solicitor.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

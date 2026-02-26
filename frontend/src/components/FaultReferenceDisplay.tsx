import React from "react";
import { ScenarioKey, scenarioReferences } from "../data/scenarioReferences";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Scale,
  Gavel,
  AlertTriangle,
  Users,
} from "lucide-react";

interface FaultReferenceDisplayProps {
  scenarioKey: ScenarioKey;
}

function FaultPercentageBar({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: "red" | "blue" | "amber";
}) {
  const barColor =
    color === "red"
      ? "oklch(0.55 0.22 25)"
      : color === "amber"
      ? "oklch(0.65 0.18 55)"
      : "oklch(0.45 0.18 250)";

  const textColor =
    color === "red"
      ? "oklch(0.45 0.22 25)"
      : color === "amber"
      ? "oklch(0.55 0.18 55)"
      : "oklch(0.35 0.18 250)";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground w-36 shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
      <span
        className="text-sm font-bold w-12 text-right"
        style={{ color: textColor }}
      >
        {percentage}%
      </span>
    </div>
  );
}

export default function FaultReferenceDisplay({
  scenarioKey,
}: FaultReferenceDisplayProps) {
  const scenario = scenarioReferences[scenarioKey];
  if (!scenario) return null;

  const { faultData, highwayCode, rta1988, caseLaw } = scenario;

  const partyAColor =
    faultData.partyAFault >= 70
      ? "red"
      : faultData.partyAFault >= 50
      ? "amber"
      : "blue";
  const partyBColor =
    faultData.partyBFault >= 70
      ? "red"
      : faultData.partyBFault >= 50
      ? "amber"
      : "blue";

  return (
    <div className="space-y-5">
      {/* Fault Percentage Breakdown */}
      <Card className="border-2 border-fault-accent/40 bg-fault-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-5 h-5 text-fault-accent" />
            <span>Fault Percentage Breakdown</span>
            <Badge className="ml-auto bg-fault-accent/20 text-fault-accent border-fault-accent/30 text-xs">
              Insurer Assessment
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <FaultPercentageBar
              label={`${faultData.partyALabel} (A)`}
              percentage={faultData.partyAFault}
              color={partyAColor}
            />
            <FaultPercentageBar
              label={`${faultData.partyBLabel} (B)`}
              percentage={faultData.partyBFault}
              color={partyBColor}
            />
          </div>

          {/* Visual stacked bar */}
          <div className="mt-2">
            <div className="flex rounded-full overflow-hidden h-5 w-full">
              <div
                className="flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
                style={{
                  width: `${faultData.partyAFault}%`,
                  backgroundColor: "oklch(0.55 0.22 25)",
                }}
              >
                {faultData.partyAFault >= 20 ? `A: ${faultData.partyAFault}%` : ""}
              </div>
              <div
                className="flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
                style={{
                  width: `${faultData.partyBFault}%`,
                  backgroundColor: "oklch(0.45 0.18 250)",
                }}
              >
                {faultData.partyBFault >= 20 ? `B: ${faultData.partyBFault}%` : ""}
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{faultData.partyALabel}</span>
              <span>{faultData.partyBLabel}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Rationale
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {faultData.rationale}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Contributing Factors
            </p>
            <ul className="space-y-1">
              {faultData.contributingFactors.map((factor, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-fault-accent shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Highway Code */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="w-5 h-5 text-primary" />
            Highway Code Citations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {highwayCode.map((ref, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {ref.rule}
                </Badge>
                <span className="text-sm font-semibold">{ref.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ref.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RTA 1988 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Scale className="w-5 h-5 text-primary" />
            Road Traffic Act 1988
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rta1988.map((ref, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {ref.section}
                </Badge>
                <span className="text-sm font-semibold">{ref.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ref.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Case Law */}
      {caseLaw.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gavel className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-400">
                Landmark Case Law
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseLaw.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40"
              >
                <div className="flex items-start gap-2 mb-1 flex-wrap">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    {c.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs font-mono border-amber-300 text-amber-700 dark:text-amber-400 ml-auto"
                  >
                    {c.citation}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1 ml-6">
                  Principle: {c.principle}
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed ml-6">
                  {c.summary}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

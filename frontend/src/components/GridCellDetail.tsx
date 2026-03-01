import React from "react";
import { FaultMatrixEntry } from "../data/faultMatrix";
import { ScenarioKey, scenarioReferences } from "../data/scenarioReferences";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Scale, Gavel, AlertTriangle, Users, CheckCircle2 } from "lucide-react";

interface Vehicle {
  id: string;
  label: string;
}

interface GridCellDetailProps {
  vehicleA: Vehicle;
  vehicleB: Vehicle;
  scenario: FaultMatrixEntry;
  scenarioKey: ScenarioKey | null;
}

function FaultBar({
  label,
  vehicleLabel,
  percentage,
  color,
}: {
  label: string;
  vehicleLabel: string;
  percentage: number;
  color: "red" | "blue";
}) {
  const barBg = color === "red" ? "oklch(0.55 0.22 25)" : "oklch(0.45 0.18 250)";
  const textColor = color === "red" ? "oklch(0.45 0.22 25)" : "oklch(0.35 0.18 250)";

  return (
    <div className="flex items-center gap-3">
      <div className="w-40 shrink-0">
        <span className="text-sm font-semibold text-foreground">{vehicleLabel}</span>
        <span className="text-xs text-muted-foreground ml-1">({label})</span>
      </div>
      <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: barBg }}
        />
      </div>
      <span className="text-sm font-bold w-12 text-right" style={{ color: textColor }}>
        {percentage}%
      </span>
    </div>
  );
}

export default function GridCellDetail({
  vehicleA,
  vehicleB,
  scenario,
  scenarioKey,
}: GridCellDetailProps) {
  const scenarioRef = scenarioKey ? scenarioReferences[scenarioKey] : null;

  // Determine party labels from scenarioRef if available, else generic
  const partyALabel = scenarioRef?.faultData.partyALabel ?? "Primary Party";
  const partyBLabel = scenarioRef?.faultData.partyBLabel ?? "Secondary Party";

  return (
    <div className="space-y-4 pt-2">
      {/* Fault Percentage Breakdown */}
      <Card className="border-2 border-fault-accent/40 bg-fault-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-fault-accent" />
            Fault Percentage Breakdown
            <Badge className="ml-auto bg-fault-accent/20 text-fault-accent border-fault-accent/30 text-xs">
              Insurer Assessment
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <FaultBar
              label={partyALabel}
              vehicleLabel={vehicleA.label}
              percentage={scenario.partyAFault}
              color="red"
            />
            <FaultBar
              label={partyBLabel}
              vehicleLabel={vehicleB.label}
              percentage={scenario.partyBFault}
              color="blue"
            />
          </div>

          {/* Stacked bar */}
          <div>
            <div className="flex rounded-full overflow-hidden h-5 w-full">
              <div
                className="flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
                style={{
                  width: `${scenario.partyAFault}%`,
                  backgroundColor: "oklch(0.55 0.22 25)",
                }}
              >
                {scenario.partyAFault >= 20 ? `${vehicleA.id}: ${scenario.partyAFault}%` : ""}
              </div>
              <div
                className="flex items-center justify-center text-xs font-bold text-white transition-all duration-700"
                style={{
                  width: `${scenario.partyBFault}%`,
                  backgroundColor: "oklch(0.45 0.18 250)",
                }}
              >
                {scenario.partyBFault >= 20 ? `${vehicleB.id}: ${scenario.partyBFault}%` : ""}
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{vehicleA.label}</span>
              <span>{vehicleB.label}</span>
            </div>
          </div>

          <Separator />

          {/* Rationale */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Rationale
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">{scenario.rationale}</p>
          </div>

          {/* Contributing Factors */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Contributing Factors
            </p>
            <ul className="space-y-1">
              {scenario.contributingFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-fault-accent shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Violation Types */}
          {scenario.relatedViolationTypes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Related Violation Types
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scenario.relatedViolationTypes.map((vt) => (
                  <Badge key={vt} variant="secondary" className="text-xs">
                    {vt.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Highway Code — only if scenarioRef available */}
      {scenarioRef && scenarioRef.highwayCode.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              Highway Code Citations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scenarioRef.highwayCode.map((ref, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-mono">
                    {ref.rule}
                  </Badge>
                  <span className="text-sm font-semibold">{ref.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{ref.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* RTA 1988 — only if scenarioRef available */}
      {scenarioRef && scenarioRef.rta1988.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Scale className="w-4 h-4 text-primary" />
              Road Traffic Act 1988
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scenarioRef.rta1988.map((ref, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-mono">
                    {ref.section}
                  </Badge>
                  <span className="text-sm font-semibold">{ref.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{ref.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Case Law — only if scenarioRef available */}
      {scenarioRef && scenarioRef.caseLaw.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Gavel className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-400">Landmark Case Law</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scenarioRef.caseLaw.map((c, i) => (
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

      {/* Fallback when no scenarioRef */}
      {!scenarioRef && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>
            For detailed Highway Code citations and case law, see the{" "}
            <strong>Fault Reference</strong> tool.
          </span>
        </div>
      )}
    </div>
  );
}

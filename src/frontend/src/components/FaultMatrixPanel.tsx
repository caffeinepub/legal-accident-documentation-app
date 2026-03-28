import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  TableProperties,
} from "lucide-react";
import React, { useState } from "react";
import { type FaultMatrixEntry, faultMatrix } from "../data/faultMatrix";

interface FaultMatrixPanelProps {
  violationType?: string;
}

function getActiveScenario(violationType?: string): string | null {
  if (!violationType) return null;
  const entry = faultMatrix.find((e) =>
    e.relatedViolationTypes.some(
      (v) => v.toLowerCase() === violationType.toLowerCase(),
    ),
  );
  return entry ? entry.scenario : null;
}

function FaultBar({
  partyAFault,
  partyBFault,
}: {
  partyAFault: number;
  partyBFault: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">
          Party A
        </span>
        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${partyAFault}%`,
              backgroundColor:
                partyAFault >= 70
                  ? "oklch(0.55 0.22 25)"
                  : partyAFault >= 50
                    ? "oklch(0.65 0.18 55)"
                    : "oklch(0.55 0.18 145)",
            }}
          />
        </div>
        <span
          className="text-xs font-bold w-10 text-right"
          style={{
            color:
              partyAFault >= 70
                ? "oklch(0.55 0.22 25)"
                : partyAFault >= 50
                  ? "oklch(0.65 0.18 55)"
                  : "oklch(0.55 0.18 145)",
          }}
        >
          {partyAFault}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">
          Party B
        </span>
        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${partyBFault}%`,
              backgroundColor:
                partyBFault >= 70
                  ? "oklch(0.55 0.22 25)"
                  : partyBFault >= 50
                    ? "oklch(0.65 0.18 55)"
                    : "oklch(0.55 0.18 145)",
            }}
          />
        </div>
        <span
          className="text-xs font-bold w-10 text-right"
          style={{
            color:
              partyBFault >= 70
                ? "oklch(0.55 0.22 25)"
                : partyBFault >= 50
                  ? "oklch(0.65 0.18 55)"
                  : "oklch(0.55 0.18 145)",
          }}
        >
          {partyBFault}%
        </span>
      </div>
    </div>
  );
}

function ScenarioRow({
  entry,
  isActive,
}: {
  entry: FaultMatrixEntry;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState(isActive);

  return (
    <div
      className={`rounded-lg border transition-all duration-200 overflow-hidden ${
        isActive
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors"
      >
        {isActive && (
          <div className="w-1 self-stretch rounded-full bg-primary shrink-0 -ml-4 mr-1" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-semibold text-sm text-foreground">
              {entry.scenario}
            </span>
            {isActive && (
              <Badge className="text-xs bg-primary text-primary-foreground gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Scenario
              </Badge>
            )}
          </div>
          <FaultBar
            partyAFault={entry.partyAFault}
            partyBFault={entry.partyBFault}
          />
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Rationale
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {entry.rationale}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Contributing Factors
            </p>
            <ul className="space-y-1">
              {entry.contributingFactors.map((factor) => (
                <li
                  key={factor}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Related Violation Types
            </p>
            <div className="flex flex-wrap gap-1.5">
              {entry.relatedViolationTypes.map((vt) => (
                <Badge key={vt} variant="outline" className="text-xs">
                  {vt}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FaultMatrixPanel({
  violationType,
}: FaultMatrixPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeScenario = getActiveScenario(violationType);

  // Sort so active scenario appears first
  const sortedMatrix = [...faultMatrix].sort((a, b) => {
    if (a.scenario === activeScenario) return -1;
    if (b.scenario === activeScenario) return 1;
    return 0;
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between p-4 bg-fault-header text-fault-header-fg hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <TableProperties className="w-5 h-5" />
              <span className="font-semibold text-base">
                Insurer Fault Matrix
              </span>
              <Badge
                variant="outline"
                className="text-xs border-fault-header-fg/40 text-fault-header-fg"
              >
                {faultMatrix.length} Scenarios
              </Badge>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-3">
            {activeScenario && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Active scenario detected: <strong>{activeScenario}</strong> —
                  based on violation type &ldquo;
                  {violationType}&rdquo;
                </span>
              </div>
            )}

            <div className="space-y-2">
              {sortedMatrix.map((entry) => (
                <ScenarioRow
                  key={entry.scenario}
                  entry={entry}
                  isActive={entry.scenario === activeScenario}
                />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Bike, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { AccidentReport } from "../backend";
import { useCountry } from "../contexts/CountryContext";
import { getLegalReferencesForViolations } from "../data/legalReferences";
import { getMaltaLegalReferencesForViolations } from "../data/maltaLegalReferences";

interface CyclingDetailsCardProps {
  report: AccidentReport;
}

const SCENARIO_LABELS: Record<string, string> = {
  "vs-vehicle": "Cyclist vs Vehicle",
  "vs-pedestrian": "Cyclist vs Pedestrian",
  solo: "Solo / Road Defect",
};

function SafetyBadge({
  worn,
  label,
}: { worn: boolean | null | undefined; label: string }) {
  if (worn == null) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground w-28 shrink-0">
        {label}
      </span>
      <Badge
        className={
          worn
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700"
            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700"
        }
        variant="outline"
      >
        {worn ? "Yes — worn" : "No — not worn"}
      </Badge>
    </div>
  );
}

export default function CyclingDetailsCard({
  report,
}: CyclingDetailsCardProps) {
  const { country } = useCountry();
  const isMalta = country === "mt";

  // Cycling fields stored as JSON in damageDescription or via dedicated fields
  // The AccidentReportForm stores these on the report object directly
  const r = report as AccidentReport & {
    incidentType?: string;
    bikeType?: string;
    helmetWorn?: boolean;
    hiVisWorn?: boolean;
    lightsOn?: boolean;
    cyclingSubScenario?: string;
    roadDefectDescription?: string;
  };

  if (r.incidentType !== "cycling") return null;

  const subScenario = r.cyclingSubScenario ?? "vs-vehicle";
  const helmetWorn = r.helmetWorn;
  const hiVisWorn = r.hiVisWorn;
  const lightsOn = r.lightsOn;

  const helmetNote =
    helmetWorn === false
      ? isMalta
        ? "Not wearing a helmet may be considered contributory negligence under Civil Code Art. 1033 — damages may be apportioned accordingly."
        : "Not wearing a helmet may be treated as contributory negligence under Froom v Butcher [1976] — courts may reduce compensation by up to 15%."
      : null;

  const hiVisNote =
    hiVisWorn === false
      ? isMalta
        ? "Not wearing hi-visibility clothing in low-light conditions may be considered contributory negligence under Civil Code Art. 1033."
        : "Not wearing hi-visibility clothing in poor visibility conditions may be raised as contributory negligence, reducing compensation by up to 10%."
      : null;

  return (
    <Card className="border-blue-200 dark:border-blue-800/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bike className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Cycling Incident Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4 space-y-3">
        {/* Sub-scenario */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-28 shrink-0">
            Scenario
          </span>
          <Badge variant="secondary" className="text-xs">
            {SCENARIO_LABELS[subScenario] ?? subScenario}
          </Badge>
        </div>

        {/* Bike type */}
        {r.bikeType && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-28 shrink-0">
              Bike Type
            </span>
            <span className="text-sm">{r.bikeType}</span>
          </div>
        )}

        {/* Safety items */}
        <SafetyBadge worn={helmetWorn} label="Helmet" />
        <SafetyBadge worn={hiVisWorn} label="Hi-vis" />
        <SafetyBadge worn={lightsOn} label="Lights on" />

        {/* Warnings */}
        {helmetNote && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              ⚠ {helmetNote}
            </p>
          </div>
        )}
        {hiVisNote && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              ⚠ {hiVisNote}
            </p>
          </div>
        )}

        {/* Road defect description (solo scenario) */}
        {subScenario === "solo" && r.roadDefectDescription && (
          <div className="mt-1">
            <p className="text-xs text-muted-foreground mb-1">
              Road Defect Description
            </p>
            <p className="text-sm">{r.roadDefectDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Cycling Legal Panel ──────────────────────────────────────────────────────
export function CyclingLegalPanel({ report }: { report: AccidentReport }) {
  const { country } = useCountry();
  const isMalta = country === "mt";
  const [open, setOpen] = useState(false);

  const r = report as AccidentReport & { incidentType?: string };
  if (r.incidentType !== "cycling") return null;

  const refs = isMalta
    ? getMaltaLegalReferencesForViolations(["Cycling"])
    : getLegalReferencesForViolations(["Cycling"]);

  const hasContent =
    refs.highwayCode.length > 0 ||
    refs.rta1988.length > 0 ||
    refs.caseLaw.length > 0;

  if (!hasContent) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Bike className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Cycling Legal References
                </CardTitle>
              </div>
              {open ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 space-y-4">
            {/* Road Code / Highway Code */}
            {refs.highwayCode.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {isMalta ? "TRO / Road Code" : "Highway Code"}
                </h4>
                {refs.highwayCode.map((hc) => (
                  <div
                    key={hc.ruleNumber}
                    className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm space-y-0.5"
                  >
                    <p className="font-medium">{hc.ruleNumber}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {hc.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Legislation */}
            {refs.rta1988.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {isMalta ? "Legislation" : "Road Traffic Act / Statutes"}
                </h4>
                {refs.rta1988.map((s) => (
                  <div
                    key={s.sectionNumber}
                    className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm space-y-0.5"
                  >
                    <p className="font-medium">{s.sectionNumber}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Case Law */}
            {refs.caseLaw.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Case Law
                </h4>
                {refs.caseLaw.map((c) => (
                  <div
                    key={c.caseName}
                    className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm space-y-1"
                  >
                    <p className="font-medium italic">{c.caseName}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {c.factualSummary}
                    </p>
                    <p className="text-xs leading-relaxed font-medium text-foreground/80">
                      {c.legalPrinciple}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

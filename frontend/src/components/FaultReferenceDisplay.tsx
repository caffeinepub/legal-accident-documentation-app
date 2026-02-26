import React from 'react';
import { BookOpen, Scale, Gavel, Info, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ScenarioKey } from '../data/scenarioReferences';
import {
  SCENARIO_LEGAL_REFERENCES,
  SCENARIO_FAULT_MATRIX,
  SCENARIOS,
} from '../data/scenarioReferences';
import type { HighwayCodeReference, RTAReference, CaseLawEntry } from '../data/legalReferences';

interface FaultReferenceDisplayProps {
  scenarioKey: ScenarioKey;
}

function FaultBar({ partyLabel, percent, isPartyA }: { partyLabel: string; percent: number; isPartyA: boolean }) {
  const getBarColor = (pct: number, isA: boolean) => {
    if (isA) {
      if (pct >= 80) return 'bg-destructive';
      if (pct >= 60) return 'bg-orange-500';
      return 'bg-yellow-500';
    }
    if (pct >= 80) return 'bg-destructive';
    if (pct >= 60) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const getTextColor = (pct: number, isA: boolean) => {
    if (isA) {
      if (pct >= 80) return 'text-destructive';
      if (pct >= 60) return 'text-orange-600 dark:text-orange-400';
      return 'text-yellow-600 dark:text-yellow-400';
    }
    if (pct >= 80) return 'text-destructive';
    if (pct >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{partyLabel}</span>
        <span className={`text-lg font-bold tabular-nums ${getTextColor(percent, isPartyA)}`}>
          {percent}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(percent, isPartyA)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function HighwayCodeCard({ rule }: { rule: HighwayCodeReference }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{rule.ruleNumber}</span>
          <Badge
            variant={rule.isEnforceable ? 'destructive' : 'secondary'}
            className="text-xs px-1.5 py-0"
          >
            {rule.isEnforceable ? 'Legally Enforceable' : 'Advisory'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{rule.description}</p>
      </div>
    </div>
  );
}

function RTACard({ section }: { section: RTAReference }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <Scale className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-sm font-semibold text-foreground">
          Road Traffic Act 1988 — {section.sectionNumber}
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
      </div>
    </div>
  );
}

function CaseLawCard({ entry }: { entry: CaseLawEntry }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20">
      <Gavel className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-2">
        <span className="text-sm font-semibold text-foreground italic">{entry.caseName}</span>
        <p className="text-sm text-muted-foreground leading-relaxed">{entry.factualSummary}</p>
        <div className="rounded-md bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 px-3 py-2">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-0.5">
            Legal Principle
          </p>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            {entry.legalPrinciple}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaultReferenceDisplay({ scenarioKey }: FaultReferenceDisplayProps) {
  const legalRef = SCENARIO_LEGAL_REFERENCES[scenarioKey];
  const faultData = SCENARIO_FAULT_MATRIX[scenarioKey];
  const scenarioMeta = SCENARIOS.find((s) => s.key === scenarioKey);

  if (!legalRef || !faultData || !scenarioMeta) return null;

  return (
    <div className="space-y-6">
      {/* Fault Matrix Card */}
      <Card className="border-fault-accent/30 shadow-sm">
        <CardHeader className="pb-3 bg-fault-header rounded-t-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-fault-accent" />
            <CardTitle className="text-base text-fault-header-fg">
              Insurer Fault Assessment — {scenarioMeta.label}
            </CardTitle>
          </div>
          <p className="text-xs text-fault-header-fg/70 mt-1">
            Typical insurer fault split based on UK industry practice and case law
          </p>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          {/* Fault bars */}
          <div className="space-y-4">
            <FaultBar
              partyLabel="Party A (Primary Driver)"
              percent={faultData.partyAFaultPercent}
              isPartyA={true}
            />
            <FaultBar
              partyLabel="Party B (Other Party)"
              percent={faultData.partyBFaultPercent}
              isPartyA={false}
            />
          </div>

          {/* Visual combined bar */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Combined Fault Split</p>
            <div className="h-4 w-full rounded-full overflow-hidden flex">
              <div
                className="h-full bg-destructive transition-all duration-500"
                style={{ width: `${faultData.partyAFaultPercent}%` }}
                title={`Party A: ${faultData.partyAFaultPercent}%`}
              />
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${faultData.partyBFaultPercent}%` }}
                title={`Party B: ${faultData.partyBFaultPercent}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-destructive" />
                Party A
              </span>
              <span className="flex items-center gap-1">
                Party B
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              </span>
            </div>
          </div>

          <Separator />

          {/* Rationale */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Rationale
            </p>
            <p className="text-sm text-foreground leading-relaxed">{faultData.rationale}</p>
          </div>

          {/* Contributing factors */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Key Contributing Factors
            </p>
            <div className="flex flex-wrap gap-1.5">
              {faultData.contributingFactors.map((factor) => (
                <span
                  key={factor}
                  className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border font-medium"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fault allocations are indicative starting points based on typical insurer practice. Actual determinations depend on the specific facts of each case. Always seek independent legal advice.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Highway Code Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Highway Code Citations</CardTitle>
            <Badge variant="outline" className="text-xs ml-auto">
              {legalRef.highwayCode.length} rules
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Relevant Highway Code rules for this scenario type
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {legalRef.highwayCode.map((rule) => (
            <HighwayCodeCard key={rule.ruleNumber} rule={rule} />
          ))}
        </CardContent>
      </Card>

      {/* Road Traffic Act Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Road Traffic Act 1988</CardTitle>
            <Badge variant="outline" className="text-xs ml-auto">
              {legalRef.rta1988.length} sections
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Applicable statutory provisions under the Road Traffic Act 1988
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {legalRef.rta1988.map((section) => (
            <RTACard key={section.sectionNumber} section={section} />
          ))}
        </CardContent>
      </Card>

      {/* Case Law Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <CardTitle className="text-base">Landmark Case Law</CardTitle>
            <Badge
              variant="outline"
              className="text-xs ml-auto border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
            >
              {legalRef.caseLaw.length} {legalRef.caseLaw.length === 1 ? 'case' : 'cases'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Landmark UK cases establishing the legal principles for this scenario
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {legalRef.caseLaw.map((entry) => (
            <CaseLawCard key={entry.caseName} entry={entry} />
          ))}
        </CardContent>
      </Card>

      {/* Legal disclaimer */}
      <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/40 border text-xs text-muted-foreground leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Legal references are provided for informational purposes only and do not constitute legal advice. Highway Code rules and case law summaries are based on UK law. Always consult a qualified solicitor for advice specific to your circumstances.
        </p>
      </div>
    </div>
  );
}

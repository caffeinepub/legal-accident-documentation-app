import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, Info, BookMarked } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { negligenceData } from '../data/negligenceData';
import type { FaultSplitScenario, NegligencePrecedent } from '../data/negligenceData';

function FaultBar({ partyAPercent, partyBPercent }: { partyAPercent: number; partyBPercent: number }) {
  const getColorA = (pct: number) => {
    if (pct >= 80) return 'bg-destructive';
    if (pct >= 60) return 'bg-orange-500';
    return 'bg-yellow-500';
  };
  const getColorB = (pct: number) => {
    if (pct >= 80) return 'bg-destructive';
    if (pct >= 60) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`${getColorA(partyAPercent)} transition-all`}
          style={{ width: `${partyAPercent}%` }}
        />
        <div
          className={`${getColorB(partyBPercent)} transition-all`}
          style={{ width: `${partyBPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="font-semibold text-foreground">
          Party A: <span className={partyAPercent >= 60 ? 'text-destructive' : 'text-yellow-600'}>{partyAPercent}%</span>
        </span>
        <span className="font-semibold text-foreground">
          Party B: <span className="text-blue-600">{partyBPercent}%</span>
        </span>
      </div>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: FaultSplitScenario }) {
  return (
    <div className="p-3 rounded-lg border bg-card space-y-2">
      <p className="text-sm font-semibold text-foreground">{scenario.title}</p>
      <FaultBar partyAPercent={scenario.partyAPercent} partyBPercent={scenario.partyBPercent} />
      <p className="text-xs text-muted-foreground leading-relaxed">{scenario.description}</p>
    </div>
  );
}

function PrecedentCard({ precedent }: { precedent: NegligencePrecedent }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20">
      <div className="shrink-0 mt-0.5">
        <BookMarked className="w-4 h-4 text-blue-700 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground italic">{precedent.caseName}</span>
          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400">
            {precedent.year}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{precedent.principle}</p>
      </div>
    </div>
  );
}

export default function ContributoryNegligencePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">Contributory Negligence Framework</span>
          <Badge variant="outline" className="text-xs ml-1">
            UK Law
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{isOpen ? 'Hide' : 'Show'} framework</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </Button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-5">
          <Separator />

          {/* Introduction */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground leading-relaxed">{negligenceData.introduction}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{negligenceData.legalBasis}</p>
            </div>
          </div>

          {/* Fault-Split Scenarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Common Fault-Split Scenarios</h3>
              <span className="text-xs text-muted-foreground">({negligenceData.scenarios.length} scenarios)</span>
            </div>
            <div className="space-y-2">
              {negligenceData.scenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </div>
          </div>

          <Separator />

          {/* Legal Precedents */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <h3 className="text-sm font-semibold">Key Legal Precedents</h3>
              <Badge
                variant="outline"
                className="text-xs ml-1 border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400"
              >
                {negligenceData.precedents.length} cases
              </Badge>
            </div>
            <div className="space-y-2">
              {negligenceData.precedents.map((precedent) => (
                <PrecedentCard key={precedent.caseName} precedent={precedent} />
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contributory negligence percentages shown are illustrative examples based on common scenarios. Actual apportionment depends on the specific facts of each case. Always consult a qualified solicitor for advice specific to your circumstances.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

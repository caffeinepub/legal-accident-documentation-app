import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Grid3X3, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { faultMatrix } from '../data/faultMatrix';
import type { FaultMatrixEntry } from '../data/faultMatrix';

interface FaultMatrixPanelProps {
  activeViolationType?: string;
}

function FaultPercentBadge({ percent, party }: { percent: number; party: 'A' | 'B' }) {
  const getColor = (pct: number, p: 'A' | 'B') => {
    if (p === 'A') {
      if (pct >= 80) return 'text-destructive font-bold';
      if (pct >= 60) return 'text-orange-600 font-bold';
      return 'text-yellow-600 font-semibold';
    }
    if (pct >= 80) return 'text-destructive font-bold';
    if (pct >= 60) return 'text-orange-600 font-bold';
    return 'text-blue-600 font-semibold';
  };

  return (
    <span className={`text-sm tabular-nums ${getColor(percent, party)}`}>
      {percent}%
    </span>
  );
}

function MatrixRow({ entry, isActive }: { entry: FaultMatrixEntry; isActive: boolean }) {
  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        isActive
          ? 'border-l-4 border-l-primary bg-primary/5 border-primary/30'
          : 'bg-card border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{entry.scenarioTitle}</span>
          {isActive && (
            <Badge className="text-xs bg-primary text-primary-foreground">
              Active Scenario
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Party A</p>
            <FaultPercentBadge percent={entry.partyAFaultPercent} party="A" />
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Party B</p>
            <FaultPercentBadge percent={entry.partyBFaultPercent} party="B" />
          </div>
        </div>
      </div>

      {/* Contributing factors */}
      <div className="flex flex-wrap gap-1 mb-2">
        {entry.contributingFactors.map((factor) => (
          <span
            key={factor}
            className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground border"
          >
            {factor}
          </span>
        ))}
      </div>

      {/* Rationale */}
      <p className="text-xs text-muted-foreground leading-relaxed">{entry.rationale}</p>
    </div>
  );
}

export default function FaultMatrixPanel({ activeViolationType }: FaultMatrixPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActiveEntry = (entry: FaultMatrixEntry): boolean => {
    if (!activeViolationType) return false;
    return (entry.relatedViolationTypes ?? []).some(
      (vt) => vt.toLowerCase() === activeViolationType.toLowerCase()
    );
  };

  const activeEntry = faultMatrix.find(isActiveEntry);

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">Insurer Fault Matrix</span>
          <Badge variant="outline" className="text-xs ml-1">
            {faultMatrix.length} Scenarios
          </Badge>
          {activeEntry && (
            <Badge className="text-xs bg-primary text-primary-foreground ml-1">
              Match Found
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{isOpen ? 'Hide' : 'Show'} matrix</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </Button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <Separator />

          {/* Contextual note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This matrix reflects typical insurer fault allocations for common road incident scenarios, based on industry practice and UK case law. Fault percentages are indicative starting points; actual determinations depend on the specific facts of each case.
              {activeViolationType && activeEntry && (
                <span className="block mt-1 font-medium text-primary">
                  A scenario matching the detected violation type "{activeViolationType}" has been highlighted below.
                </span>
              )}
            </p>
          </div>

          {/* Matrix entries — active first, then rest */}
          <div className="space-y-2">
            {[
              ...faultMatrix.filter(isActiveEntry),
              ...faultMatrix.filter((e) => !isActiveEntry(e)),
            ].map((entry) => (
              <MatrixRow key={entry.id} entry={entry} isActive={isActiveEntry(entry)} />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fault allocations shown are based on typical insurer practice and are not legally binding determinations. Final liability is determined by insurers, courts, or agreed settlement. Always seek independent legal advice for your specific circumstances.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

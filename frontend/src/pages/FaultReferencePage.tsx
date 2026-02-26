import React, { useState } from 'react';
import { Scale, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScenarioSelector from '../components/ScenarioSelector';
import FaultReferenceDisplay from '../components/FaultReferenceDisplay';
import type { ScenarioKey } from '../data/scenarioReferences';

export default function FaultReferencePage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey | null>(null);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Tools</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Fault Reference</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-fault-header shrink-0">
            <Scale className="w-6 h-6 text-fault-accent" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Fault Reference Tool
              </h1>
              <Badge
                variant="outline"
                className="text-xs border-fault-accent/40 text-fault-accent font-medium"
              >
                UK Law
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Select your accident scenario to see the insurer-style fault assessment, relevant Highway Code rules, Road Traffic Act 1988 provisions, and landmark UK case law — all in plain English.
            </p>
          </div>
        </div>

        {/* Info strip */}
        <div className="flex flex-wrap gap-4 pt-1">
          {[
            { label: '7 Scenario Types', color: 'bg-fault-accent/10 text-fault-accent border-fault-accent/20' },
            { label: 'Highway Code Rules', color: 'bg-primary/10 text-primary border-primary/20' },
            { label: 'RTA 1988 Sections', color: 'bg-primary/10 text-primary border-primary/20' },
            { label: 'Landmark Case Law', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40' },
          ].map((item) => (
            <span
              key={item.label}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium ${item.color}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scenario selector */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <ScenarioSelector selected={selectedScenario} onChange={setSelectedScenario} />
      </div>

      {/* Results */}
      {selectedScenario ? (
        <FaultReferenceDisplay scenarioKey={selectedScenario} />
      ) : (
        <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center space-y-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mx-auto">
            <Scale className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No scenario selected</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Choose one of the accident scenarios above to see the fault assessment, legal references, and case law.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import {
  ArrowRight,
  CircleStop,
  ArrowLeftRight,
  CornerUpRight,
  GitMerge,
  RefreshCw,
  CornerDownLeft,
} from 'lucide-react';
import { SCENARIOS, type ScenarioKey } from '../data/scenarioReferences';

interface ScenarioSelectorProps {
  selected: ScenarioKey | null;
  onChange: (key: ScenarioKey) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowRight,
  CircleStop,
  ArrowLeftRight,
  CornerUpRight,
  GitMerge,
  RefreshCw,
  CornerDownLeft,
};

export default function ScenarioSelector({ selected, onChange }: ScenarioSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-foreground">Select Your Accident Scenario</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose the scenario that best matches your incident to see the relevant fault assessment, Highway Code rules, and case law.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {SCENARIOS.map((scenario) => {
          const Icon = ICON_MAP[scenario.icon];
          const isSelected = selected === scenario.key;

          return (
            <button
              key={scenario.key}
              onClick={() => onChange(scenario.key)}
              className={`
                group relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left
                transition-all duration-150 cursor-pointer
                ${
                  isSelected
                    ? 'border-fault-accent bg-fault-accent/10 shadow-sm ring-2 ring-fault-accent/30'
                    : 'border-border bg-card hover:border-fault-accent/50 hover:bg-fault-accent/5 hover:shadow-sm'
                }
              `}
              aria-pressed={isSelected}
            >
              <div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-lg shrink-0
                  transition-colors duration-150
                  ${isSelected ? 'bg-fault-accent text-white' : 'bg-muted text-muted-foreground group-hover:bg-fault-accent/20 group-hover:text-fault-accent'}
                `}
              >
                {Icon && <Icon className="w-4 h-4" />}
              </div>

              <div className="space-y-0.5 min-w-0">
                <p
                  className={`text-sm font-semibold leading-tight ${
                    isSelected ? 'text-fault-accent' : 'text-foreground'
                  }`}
                >
                  {scenario.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {scenario.description}
                </p>
              </div>

              {isSelected && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-fault-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

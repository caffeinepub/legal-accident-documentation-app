import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, BookOpen, Activity } from 'lucide-react';
import {
  BODY_REGIONS,
  CRASH_TYPES,
  getCorrelationsForRegions,
  getCrashTypeInfo,
  getBodyRegionInfo,
  type BodyRegion,
  type CrashType,
  type CorrelationEntry,
} from '../data/injuryCorrelation';

interface InjuryAnalysisUIProps {
  selectedRegions: BodyRegion[];
  onRegionsChange: (regions: BodyRegion[]) => void;
}

function SeverityBadge({ severity }: { severity: CorrelationEntry['severity'] }) {
  const map = {
    high: 'bg-destructive/10 text-destructive border-destructive/30',
    medium: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-700',
    low: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${map[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)} correlation
    </span>
  );
}

function CrashTypeCard({
  crashType,
  entries,
}: {
  crashType: CrashType;
  entries: CorrelationEntry[];
}) {
  const info = getCrashTypeInfo(crashType);
  if (!info) return null;

  // Use the highest severity entry for the card header
  const primaryEntry = entries.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  })[0];

  return (
    <div className={`rounded-lg border p-3 space-y-2 ${info.color}`}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Activity className={`w-3.5 h-3.5 shrink-0 ${info.textColor}`} />
          <span className={`text-sm font-semibold ${info.textColor}`}>{info.label}</span>
        </div>
        <SeverityBadge severity={primaryEntry.severity} />
      </div>

      {entries.map((entry, i) => (
        <div key={i} className="space-y-1.5">
          {entries.length > 1 && i > 0 && <Separator className="opacity-30" />}
          <p className="text-xs text-foreground/80 leading-relaxed">{entry.explanation}</p>
          <div className="flex items-start gap-1 mt-1">
            <BookOpen className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">{entry.reference}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InjuryAnalysisUI({ selectedRegions, onRegionsChange }: InjuryAnalysisUIProps) {
  const toggleRegion = (region: BodyRegion) => {
    if (selectedRegions.includes(region)) {
      onRegionsChange(selectedRegions.filter((r) => r !== region));
    } else {
      onRegionsChange([...selectedRegions, region]);
    }
  };

  const correlationMap = getCorrelationsForRegions(selectedRegions);
  const sortedCrashTypes = Array.from(correlationMap.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="space-y-5">
      {/* Body Region Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Select Injury Locations</h3>
          {selectedRegions.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedRegions.length} selected
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Select all body regions where injuries were sustained. The analysis will identify likely crash mechanisms based on established biomechanics research.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BODY_REGIONS.map((region) => {
            const isSelected = selectedRegions.includes(region.key);
            return (
              <label
                key={region.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-primary/60 bg-primary/5'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                }`}
              >
                <Checkbox
                  id={`region-${region.key}`}
                  checked={isSelected}
                  onCheckedChange={() => toggleRegion(region.key)}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{region.icon}</span>
                    <Label
                      htmlFor={`region-${region.key}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {region.label}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{region.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Crash Type Correlations */}
      {selectedRegions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Likely Crash Mechanisms</h3>
              <Badge variant="outline" className="text-xs">
                {sortedCrashTypes.length} identified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on the selected injury locations, the following crash types are consistent with the injury pattern. Sorted by number of corroborating injury sites.
            </p>

            {sortedCrashTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No correlations found for selected regions.</p>
            ) : (
              <div className="space-y-2">
                {sortedCrashTypes.map(([crashType, entries]) => (
                  <CrashTypeCard key={crashType} crashType={crashType} entries={entries} />
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border text-xs text-muted-foreground">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
              <p className="leading-relaxed">
                This analysis is based on established crash biomechanics research and is intended to assist with insurance documentation only. It does not constitute a medical diagnosis or legal determination of fault. Always seek medical attention for injuries and consult a qualified solicitor for legal advice.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

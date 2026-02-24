import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Scale, ShieldAlert, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Violation } from '../backend';
import {
  getLegalReferencesForViolations,
  GENERAL_LEGAL_REFERENCES,
  type HighwayCodeReference,
  type RTAReference,
} from '../data/legalReferences';

interface LegalReferencePanelProps {
  violations: Violation[];
}

function HighwayCodeCard({ rule }: { rule: HighwayCodeReference }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <div className="shrink-0 mt-0.5">
        <BookOpen className="w-4 h-4 text-primary" />
      </div>
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
      <div className="shrink-0 mt-0.5">
        <Scale className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-sm font-semibold text-foreground">
          Road Traffic Act 1988 — {section.sectionNumber}
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
      </div>
    </div>
  );
}

export default function LegalReferencePanel({ violations }: LegalReferencePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const violationTypes = violations.map((v) => v.violationType);
  const { highwayCode, rta1988 } = getLegalReferencesForViolations(violationTypes);

  // Merge general references (deduplicated)
  const allHC = [...highwayCode];
  const allRTA = [...rta1988];

  const seenHC = new Set(highwayCode.map((r) => r.ruleNumber));
  const seenRTA = new Set(rta1988.map((r) => r.sectionNumber));

  for (const hc of GENERAL_LEGAL_REFERENCES.highwayCode) {
    if (!seenHC.has(hc.ruleNumber)) {
      allHC.push(hc);
    }
  }
  for (const rta of GENERAL_LEGAL_REFERENCES.rta1988) {
    if (!seenRTA.has(rta.sectionNumber)) {
      allRTA.push(rta);
    }
  }

  const hasViolations = violations.length > 0;

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      {/* Toggle header */}
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">Legal Reference</span>
          <Badge variant="outline" className="text-xs ml-1">
            UK Law
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{isOpen ? 'Hide' : 'Show'} legal details</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </Button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-5">
          <Separator />

          {/* Contextual note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {hasViolations
                ? `The following UK legal references apply to the ${violations.length} violation${violations.length > 1 ? 's' : ''} detected in this report, plus general post-incident obligations.`
                : 'No specific violations were recorded. The following general UK road traffic obligations apply to all incidents.'}
            </p>
          </div>

          {/* Highway Code section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Highway Code Citations</h3>
              <span className="text-xs text-muted-foreground">({allHC.length} rules)</span>
            </div>
            <div className="space-y-2">
              {allHC.map((rule) => (
                <HighwayCodeCard key={rule.ruleNumber} rule={rule} />
              ))}
            </div>
          </div>

          <Separator />

          {/* RTA 1988 section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Road Traffic Act 1988</h3>
              <span className="text-xs text-muted-foreground">({allRTA.length} sections)</span>
            </div>
            <div className="space-y-2">
              {allRTA.map((section) => (
                <RTACard key={section.sectionNumber} section={section} />
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t pt-3">
            This information is provided for reference only and does not constitute legal advice.
            For specific legal guidance, consult a qualified solicitor or visit{' '}
            <a
              href="https://www.gov.uk/browse/driving"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              GOV.UK
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

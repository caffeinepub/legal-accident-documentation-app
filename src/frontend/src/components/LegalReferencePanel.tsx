import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Gavel,
  Info,
  Scale,
  ShieldAlert,
} from "lucide-react";
import React, { useState } from "react";
import type { Violation } from "../backend";
import {
  type CaseLawEntry,
  GENERAL_LEGAL_REFERENCES,
  type HighwayCodeReference,
  type RTAReference,
  getLegalReferencesForViolations,
} from "../data/legalReferences";

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
          <span className="text-sm font-semibold text-foreground">
            {rule.ruleNumber}
          </span>
          <Badge
            variant={rule.isEnforceable ? "destructive" : "secondary"}
            className="text-xs px-1.5 py-0"
          >
            {rule.isEnforceable ? "Legally Enforceable" : "Advisory"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {rule.description}
        </p>
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
        <p className="text-sm text-muted-foreground leading-relaxed">
          {section.description}
        </p>
      </div>
    </div>
  );
}

function CaseLawCard({ entry }: { entry: CaseLawEntry }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="shrink-0 mt-0.5">
        <Gavel className="w-4 h-4 text-amber-700 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <span className="text-sm font-semibold text-foreground italic">
          {entry.caseName}
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {entry.factualSummary}
        </p>
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

export default function LegalReferencePanel({
  violations,
}: LegalReferencePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const violationTypes = violations.map((v) => v.violationType);
  const { highwayCode, rta1988, caseLaw } =
    getLegalReferencesForViolations(violationTypes);

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
  const hasCaseLaw = caseLaw.length > 0;

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
          <span>{isOpen ? "Hide" : "Show"} legal details</span>
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
                ? `The following UK legal references apply to the ${violations.length} violation${violations.length > 1 ? "s" : ""} detected in this report, plus general post-incident obligations.`
                : "No specific violations were recorded. The following general UK road traffic obligations apply to all incidents."}
            </p>
          </div>

          {/* Highway Code section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Highway Code Citations</h3>
              <span className="text-xs text-muted-foreground">
                ({allHC.length} rules)
              </span>
            </div>
            <div className="space-y-2">
              {allHC.map((rule) => (
                <HighwayCodeCard key={rule.ruleNumber} rule={rule} />
              ))}
            </div>
          </div>

          <Separator />

          {/* Road Traffic Act section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Road Traffic Act 1988</h3>
              <span className="text-xs text-muted-foreground">
                ({allRTA.length} sections)
              </span>
            </div>
            <div className="space-y-2">
              {allRTA.map((section) => (
                <RTACard key={section.sectionNumber} section={section} />
              ))}
            </div>
          </div>

          {/* Landmark Case Law section — only shown when violations are detected and case law exists */}
          {hasViolations && hasCaseLaw && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <h3 className="text-sm font-semibold">Landmark Case Law</h3>
                  <Badge
                    variant="outline"
                    className="text-xs ml-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                  >
                    {caseLaw.length} {caseLaw.length === 1 ? "case" : "cases"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The following landmark cases establish the legal principles
                  relevant to the violations detected in this report.
                </p>
                <div className="space-y-2">
                  {caseLaw.map((entry) => (
                    <CaseLawCard key={entry.caseName} entry={entry} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* GOV.UK disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Legal references are provided for informational purposes only and
              do not constitute legal advice. Always consult a qualified
              solicitor for advice specific to your circumstances. Highway Code
              rules and case law summaries are based on UK law.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

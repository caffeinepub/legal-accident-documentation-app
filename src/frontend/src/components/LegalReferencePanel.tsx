import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Gavel,
  Info,
  Scale,
  ShieldAlert,
} from "lucide-react";
import React, { useState } from "react";
import type { Violation } from "../backend";
import { useCountry } from "../contexts/CountryContext";
import {
  type CaseLawEntry,
  GENERAL_LEGAL_REFERENCES,
  type HighwayCodeReference,
  type OtherLegislationEntry,
  type RTAReference,
  getLegalReferencesForViolations,
} from "../data/legalReferences";
import {
  MALTA_GENERAL_LEGAL_REFERENCES,
  getMaltaLegalReferencesForViolations,
} from "../data/maltaLegalReferences";

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

function RTACard({
  section,
  isMalta,
}: { section: RTAReference; isMalta: boolean }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <div className="shrink-0 mt-0.5">
        <Scale className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-sm font-semibold text-foreground">
          {isMalta
            ? section.sectionNumber
            : `Road Traffic Act 1988 — ${section.sectionNumber}`}
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {section.description}
        </p>
      </div>
    </div>
  );
}

function OtherLegislationCard({ entry }: { entry: OtherLegislationEntry }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-teal-200 bg-teal-50/60 dark:border-teal-900/40 dark:bg-teal-950/20">
      <div className="shrink-0 mt-0.5">
        <BookMarked className="w-4 h-4 text-teal-700 dark:text-teal-400" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {entry.actName}
          </span>
          <Badge
            variant="outline"
            className="text-xs px-1.5 py-0 border-teal-400 text-teal-700 dark:border-teal-600 dark:text-teal-400"
          >
            {entry.sectionReference}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {entry.description}
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

function MaltaRoadCodeCard() {
  return (
    <div className="rounded-lg border border-teal-300 bg-teal-50/70 dark:border-teal-700/50 dark:bg-teal-950/30 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 p-1.5 rounded-md bg-teal-100 dark:bg-teal-900/50">
          <BookOpen className="w-4 h-4 text-teal-700 dark:text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-teal-900 dark:text-teal-100">
              Malta Road Code
            </span>
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0 border-teal-500 text-teal-700 dark:border-teal-500 dark:text-teal-300"
            >
              Official Reference
            </Badge>
          </div>
          <p className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">
            Published by Transport Malta — Last updated July 2025
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
      </div>
      <p className="text-sm text-teal-800 dark:text-teal-200 leading-relaxed">
        The official practical guidance document for road users in Malta,
        covering speed limits, road signs, right of way, and safe driving rules.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href="https://www.transport.gov.mt/RoadCodeEN.pdf-f10821"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          data-ocid="road_code.download_button"
        >
          <Download className="w-3.5 h-3.5" />
          Download (English)
        </a>
        <a
          href="https://www.transport.gov.mt/RoadCodeMT.pdf-f10820"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-800/50 dark:text-teal-200 dark:hover:bg-teal-700/60 transition-colors border border-teal-300 dark:border-teal-600"
          data-ocid="road_code_mt.download_button"
        >
          <Download className="w-3.5 h-3.5" />
          Download (Malti)
        </a>
      </div>
    </div>
  );
}

export default function LegalReferencePanel({
  violations,
}: LegalReferencePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { country } = useCountry();
  const isMalta = country === "mt";

  const violationTypes = violations.map((v) => v.violationType);

  const violationRefs = isMalta
    ? getMaltaLegalReferencesForViolations(violationTypes)
    : getLegalReferencesForViolations(violationTypes);

  const generalRefs = isMalta
    ? MALTA_GENERAL_LEGAL_REFERENCES
    : GENERAL_LEGAL_REFERENCES;

  const { highwayCode, rta1988, caseLaw } = violationRefs;

  const allHC = [...highwayCode];
  const allRTA = [...rta1988];

  const seenHC = new Set(highwayCode.map((r) => r.ruleNumber));
  const seenRTA = new Set(rta1988.map((r) => r.sectionNumber));

  for (const hc of generalRefs.highwayCode) {
    if (!seenHC.has(hc.ruleNumber)) allHC.push(hc);
  }
  for (const rta of generalRefs.rta1988) {
    if (!seenRTA.has(rta.sectionNumber)) allRTA.push(rta);
  }

  const allCaseLaw = [...caseLaw];
  const seenCases = new Set(caseLaw.map((c) => c.caseName));
  for (const cl of generalRefs.caseLaw ?? []) {
    if (!seenCases.has(cl.caseName)) allCaseLaw.push(cl);
  }

  const otherLegislation = generalRefs.otherLegislation ?? [];
  const hasViolations = violations.length > 0;
  const hasCaseLaw = allCaseLaw.length > 0;

  const jurisdictionLabel = isMalta ? "Maltese Law" : "UK Law";
  const trafficCodeLabel = isMalta
    ? "Road Code & Traffic Regulation Ordinance (Cap. 65)"
    : "Highway Code Citations";
  const primaryLawLabel = isMalta
    ? "Civil Code Cap. 16 / TRO Cap. 65"
    : "Road Traffic Act 1988";

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
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
            {jurisdictionLabel}
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

      {isOpen && (
        <div className="px-4 pb-4 space-y-5">
          <Separator />

          {isMalta && <MaltaRoadCodeCard />}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {hasViolations
                ? `The following ${jurisdictionLabel} references apply to the ${violations.length} violation${
                    violations.length > 1 ? "s" : ""
                  } detected in this report, plus general post-incident obligations.`
                : `No specific violations were recorded. The following general ${jurisdictionLabel} road traffic obligations apply to all incidents.`}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">{trafficCodeLabel}</h3>
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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">{primaryLawLabel}</h3>
              <span className="text-xs text-muted-foreground">
                ({allRTA.length} sections)
              </span>
            </div>
            <div className="space-y-2">
              {allRTA.map((section) => (
                <RTACard
                  key={section.sectionNumber}
                  section={section}
                  isMalta={isMalta}
                />
              ))}
            </div>
          </div>

          {otherLegislation.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <h3 className="text-sm font-semibold">Other Legislation</h3>
                  <Badge
                    variant="outline"
                    className="text-xs ml-1 border-teal-400 text-teal-700 dark:border-teal-600 dark:text-teal-400"
                  >
                    {otherLegislation.length}{" "}
                    {otherLegislation.length === 1 ? "Act" : "Acts"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isMalta
                    ? "Additional Maltese legislation relevant to road traffic accident claims and civil proceedings."
                    : "Additional UK statutes relevant to road traffic accident claims and personal injury proceedings."}
                </p>
                <div className="space-y-2">
                  {otherLegislation.map((entry) => (
                    <OtherLegislationCard key={entry.actName} entry={entry} />
                  ))}
                </div>
              </div>
            </>
          )}

          {hasCaseLaw && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <h3 className="text-sm font-semibold">
                    {isMalta ? "Maltese Case Law" : "Landmark Case Law"}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs ml-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                  >
                    {allCaseLaw.length}{" "}
                    {allCaseLaw.length === 1 ? "case" : "cases"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isMalta
                    ? "The following Maltese cases establish the legal principles relevant to this report."
                    : "The following landmark cases establish the legal principles relevant to the violations detected in this report."}
                </p>
                <div className="space-y-2">
                  {allCaseLaw.map((entry) => (
                    <CaseLawCard key={entry.caseName} entry={entry} />
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isMalta
                ? "Legal references are provided for informational purposes only and do not constitute legal advice. Always consult a qualified Maltese advocate (avukat) for advice specific to your circumstances. References are based on Maltese law (Civil Code Cap. 16, TRO Cap. 65, Malta Road Code)."
                : "Legal references are provided for informational purposes only and do not constitute legal advice. Always consult a qualified solicitor for advice specific to your circumstances. Highway Code rules and case law summaries are based on UK law."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

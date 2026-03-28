import type { FaultLikelihoodAssessment } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BookMarked,
  ChevronDown,
  ChevronUp,
  Info,
  PoundSterling,
  Scale,
} from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { negligenceData } from "../data/negligenceData";
import type {
  FaultSplitScenario,
  NegligencePrecedent,
} from "../data/negligenceData";

const MALTA_INTRO = {
  introduction:
    "Under Maltese law, where a claimant's own negligence contributed to their injuries or loss, the court reduces the compensation awarded in proportion to the claimant's share of fault. This principle — known as contributory negligence — is codified in the Civil Code (Cap. 16) and applied by Maltese courts in all road traffic and personal injury matters.",
  legalBasis:
    "Civil Code (Cap. 16), Arts. 1031–1033 provide that where both parties contributed to the damage, the court shall apportion liability in proportion to the respective fault of each party. Where the Claimant's own negligence is a contributing cause, damages are reduced accordingly.",
};

const MALTA_SCENARIOS: FaultSplitScenario[] = [
  {
    id: "mt-1",
    title: "Rear-end collision — following driver at fault",
    partyAPercent: 10,
    partyBPercent: 90,
    description:
      "The following driver (Party B) is typically found substantially at fault for failing to maintain a safe following distance under TRO Cap. 65. Party A may bear minor responsibility if braking was sudden without cause.",
  },
  {
    id: "mt-2",
    title: "Failure to yield at junction — equal awareness",
    partyAPercent: 70,
    partyBPercent: 30,
    description:
      "A driver who failed to yield at a junction or roundabout under TRO Cap. 65 generally bears the higher share of fault. The court may apportion a smaller percentage to the other driver if they had opportunity to avoid the collision.",
  },
  {
    id: "mt-3",
    title: "Pedestrian crossing mid-road — shared fault",
    partyAPercent: 30,
    partyBPercent: 70,
    description:
      "Where a pedestrian crossed outside a designated crossing and was struck by a driver travelling at reasonable speed, the Maltese courts have apportioned a contributory share to the pedestrian, with the majority of fault retained by the vehicle driver under the duty of care owed to vulnerable road users.",
  },
  {
    id: "mt-4",
    title: "Seatbelt not worn — personal injury claim",
    partyAPercent: 25,
    partyBPercent: 75,
    description:
      "The Maltese courts have consistently reduced personal injury awards where the claimant was not wearing a seatbelt, following the principle established in Azzopardi v Farrugia [2019]. A deduction of 15–25% is commonly applied.",
  },
];

const MALTA_PRECEDENTS = [
  {
    caseName: "Cassar v Grech [2018]",
    year: "2018",
    principle:
      "Contributory fault apportionment under Civil Code Arts. 1031–1033: where both parties contributed to the collision, damages are reduced in proportion to the claimant's share of responsibility.",
  },
  {
    caseName: "Camilleri v Mifsud [2015]",
    year: "2015",
    principle:
      "Shared liability where both parties contributed to the collision through negligent driving; court apportioned fault equitably between the parties.",
  },
  {
    caseName: "Azzopardi v Farrugia [2019]",
    year: "2019",
    principle:
      "Reduction of damages where claimant failed to wear a seatbelt, contributing to the severity of their own injuries; damages reduced accordingly.",
  },
];

function FaultBar({
  partyAPercent,
  partyBPercent,
}: { partyAPercent: number; partyBPercent: number }) {
  const getColorA = (pct: number) => {
    if (pct >= 80) return "bg-destructive";
    if (pct >= 60) return "bg-orange-500";
    return "bg-yellow-500";
  };
  const getColorB = (pct: number) => {
    if (pct >= 80) return "bg-destructive";
    if (pct >= 60) return "bg-orange-500";
    return "bg-blue-500";
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
          Party A:{" "}
          <span
            className={
              partyAPercent >= 60 ? "text-destructive" : "text-yellow-600"
            }
          >
            {partyAPercent}%
          </span>
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
      <FaultBar
        partyAPercent={scenario.partyAPercent}
        partyBPercent={scenario.partyBPercent}
      />
      <p className="text-xs text-muted-foreground leading-relaxed">
        {scenario.description}
      </p>
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
          <span className="text-sm font-semibold text-foreground italic">
            {precedent.caseName}
          </span>
          <Badge
            variant="outline"
            className="text-xs border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400"
          >
            {precedent.year}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {precedent.principle}
        </p>
      </div>
    </div>
  );
}

function formatCurrencyGBP(n: number): string {
  return `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatCurrencyEUR(n: number): string {
  return new Intl.NumberFormat("mt-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

function CompensationCalculator({
  faultLikelihoodAssessment,
  isMalta,
}: {
  faultLikelihoodAssessment?: FaultLikelihoodAssessment;
  isMalta: boolean;
}) {
  const initialPartyA = faultLikelihoodAssessment
    ? Number(faultLikelihoodAssessment.partyAPercentage)
    : 50;

  const [totalClaim, setTotalClaim] = useState("");
  const [partyAFault, setPartyAFault] = useState(String(initialPartyA));

  const partyANum = Math.max(0, Math.min(100, Number(partyAFault) || 0));
  const partyBNum = 100 - partyANum;
  const totalNum = Number(totalClaim.replace(/,/g, "")) || 0;

  // Under contributory negligence, a party's compensation is reduced by their own fault %
  const partyAReceives = totalNum * ((100 - partyANum) / 100);
  const partyBReceives = totalNum * ((100 - partyBNum) / 100);
  const showResult = totalNum > 0;

  return (
    <div className="space-y-4" data-ocid="negligence.panel">
      <div className="flex items-center gap-2">
        {isMalta ? (
          <span className="text-lg font-bold text-primary leading-none">€</span>
        ) : (
          <PoundSterling className="w-4 h-4 text-primary" />
        )}
        <h3 className="text-sm font-semibold">Compensation Calculator</h3>
        <Badge variant="outline" className="text-xs">
          Illustrative
        </Badge>
      </div>

      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
        {isMalta ? (
          <>
            Under <strong>Civil Code (Cap. 16), Art. 1045</strong>, each party’s
            compensation is reduced in proportion to their own contributory
            fault as apportioned by the court.
          </>
        ) : (
          <>
            Under the{" "}
            <strong>Law Reform (Contributory Negligence) Act 1945</strong>, each
            party’s compensation is reduced in proportion to their own
            contributory fault.
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="total-claim"
            className="text-xs font-medium text-muted-foreground"
          >
            Total Claim Value ({isMalta ? "€" : "£"})
          </Label>
          <Input
            id="total-claim"
            type="number"
            min="0"
            placeholder="e.g. 10000"
            value={totalClaim}
            onChange={(e) => setTotalClaim(e.target.value)}
            className="h-8 text-sm"
            data-ocid="negligence.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="party-a-fault"
            className="text-xs font-medium text-muted-foreground"
          >
            Party A fault %
            {faultLikelihoodAssessment && (
              <span className="ml-1 text-[10px] text-violet-500">
                (pre-filled)
              </span>
            )}
          </Label>
          <Input
            id="party-a-fault"
            type="number"
            min="0"
            max="100"
            value={partyAFault}
            onChange={(e) => setPartyAFault(e.target.value)}
            className="h-8 text-sm"
            data-ocid="negligence.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Party B fault %
          </Label>
          <div className="h-8 flex items-center px-3 rounded-md border border-border bg-muted/40 text-sm font-medium">
            {partyBNum}%
          </div>
        </div>
      </div>

      {showResult && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-1">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
              Party A receives
            </p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {isMalta
                ? formatCurrencyEUR(partyAReceives)
                : formatCurrencyGBP(partyAReceives)}
            </p>
            <p className="text-[10px] text-blue-500">
              Reduced by {partyANum}% own fault
            </p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 space-y-1">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wide">
              Party B receives
            </p>
            <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
              {isMalta
                ? formatCurrencyEUR(partyBReceives)
                : formatCurrencyGBP(partyBReceives)}
            </p>
            <p className="text-[10px] text-orange-500">
              Reduced by {partyBNum}% own fault
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border">
        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          This calculator is <strong>illustrative only</strong>. Actual
          compensation depends on specific case facts, medical evidence, and
          judicial assessment. Consult a qualified{" "}
          {isMalta ? "avukat (advocate)" : "solicitor"}.
        </p>
      </div>
    </div>
  );
}

interface ContributoryNegligencePanelProps {
  faultLikelihoodAssessment?: FaultLikelihoodAssessment;
}

export default function ContributoryNegligencePanel({
  faultLikelihoodAssessment,
}: ContributoryNegligencePanelProps) {
  const { country } = useCountry();
  const isMalta = country === "mt";
  const [isOpen, setIsOpen] = useState(false);

  const activeIntro = isMalta ? MALTA_INTRO : negligenceData;
  const activeScenarios = isMalta ? MALTA_SCENARIOS : negligenceData.scenarios;
  const activePrecedents = isMalta
    ? MALTA_PRECEDENTS
    : negligenceData.precedents;

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        data-ocid="negligence.open_modal_button"
      >
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">
            Contributory Negligence Framework
          </span>
          <Badge variant="outline" className="text-xs ml-1">
            {isMalta ? "Maltese Law" : "UK Law"}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{isOpen ? "Hide" : "Show"} framework</span>
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

          {/* Introduction */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeIntro.introduction}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeIntro.legalBasis}
              </p>
            </div>
          </div>

          {/* Fault-Split Scenarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">
                Common Fault-Split Scenarios
              </h3>
              <span className="text-xs text-muted-foreground">
                ({activeScenarios.length} scenarios)
              </span>
            </div>
            <div className="space-y-2">
              {activeScenarios.map((scenario) => (
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
                {activePrecedents.length} cases
              </Badge>
            </div>
            <div className="space-y-2">
              {activePrecedents.map((precedent) => (
                <PrecedentCard key={precedent.caseName} precedent={precedent} />
              ))}
            </div>
          </div>

          <Separator />

          {/* Compensation Calculator */}
          <CompensationCalculator
            faultLikelihoodAssessment={faultLikelihoodAssessment}
            isMalta={isMalta}
          />

          <Separator />

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isMalta ? (
                <>
                  Contributory negligence percentages shown are illustrative
                  examples based on common Maltese scenarios. Actual
                  apportionment depends on the specific facts of each case and
                  the judicial assessment of the Civil Court. Always consult a
                  qualified <strong>avukat (advocate)</strong> enrolled with the
                  Chamber of Advocates of Malta.
                </>
              ) : (
                <>
                  Contributory negligence percentages shown are illustrative
                  examples based on common scenarios. Actual apportionment
                  depends on the specific facts of each case. Always consult a
                  qualified <strong>solicitor</strong> for advice specific to
                  your circumstances.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

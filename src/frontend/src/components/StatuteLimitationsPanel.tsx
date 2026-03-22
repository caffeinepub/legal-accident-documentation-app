import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlarmClock, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { MALTA_PRESCRIPTION_ENTRIES } from "../data/maltaLegalOutputs";

interface LimitationEntry {
  id: number;
  name: string;
  period: string;
  periodDays: number;
  statute: string;
  notes: string;
}

const LIMITATION_ENTRIES: LimitationEntry[] = [
  {
    id: 1,
    name: "Personal Injury Claim",
    period: "3 years",
    periodDays: 3 * 365,
    statute: "Limitation Act 1980, s.11",
    notes:
      "Runs from date of accident or date of knowledge. Court has discretion to disapply under s.33.",
  },
  {
    id: 2,
    name: "Property Damage Claim",
    period: "6 years",
    periodDays: 6 * 365,
    statute: "Limitation Act 1980, s.5",
    notes:
      "Runs from date of damage. Includes vehicle repair, personal property loss and consequential losses.",
  },
  {
    id: 3,
    name: "Fatal Accidents Act Claim",
    period: "3 years",
    periodDays: 3 * 365,
    statute: "Fatal Accidents Act 1976 / Limitation Act 1980, s.12",
    notes:
      "Runs from date of death or date of knowledge of dependant. Separate period may apply to the estate.",
  },
  {
    id: 4,
    name: "MIB Uninsured Driver Claim",
    period: "3 years",
    periodDays: 3 * 365,
    statute: "Motor Insurers' Bureau Uninsured Drivers Agreement 2015",
    notes:
      "Incident must be reported to police promptly. Failure to report may bar recovery. Notify MIB as early as possible.",
  },
  {
    id: 5,
    name: "MIB Untraced Driver Claim",
    period: "3 years",
    periodDays: 3 * 365,
    statute: "Motor Insurers' Bureau Untraced Drivers Agreement 2017",
    notes:
      "Application must be made to MIB within 3 years of the accident date. Police report required within 14 days of incident.",
  },
  {
    id: 6,
    name: "Claim Against Public Authority",
    period: "6 years (general) / may be shorter",
    periodDays: 6 * 365,
    statute: "Limitation Act 1980, s.5 / Public Authorities Protection",
    notes:
      "Highways Act claims (e.g. road defect) may have a shorter limitation. Human Rights Act claims: 1 year. Always seek specific advice.",
  },
];

type CountdownStatus = "green" | "amber" | "red" | "expired" | "unknown";

interface Countdown {
  elapsed: number;
  remaining: number;
  status: CountdownStatus;
}

function computeCountdown(
  accidentDate: Date,
  periodDays: number,
): Countdown | null {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const elapsed = Math.floor(
    (now.getTime() - accidentDate.getTime()) / msPerDay,
  );
  const remaining = periodDays - elapsed;
  let status: CountdownStatus;

  if (remaining < 0) {
    status = "expired";
  } else if (remaining < 90) {
    status = "red";
  } else if (remaining < 365) {
    status = "amber";
  } else {
    status = "green";
  }

  return { elapsed, remaining, status };
}

const STATUS_STYLES: Record<CountdownStatus, string> = {
  green:
    "border-emerald-400 text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-700",
  amber:
    "border-amber-400 text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-700",
  red: "border-red-400 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 dark:border-red-700",
  expired:
    "border-red-600 text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-950/40 dark:border-red-600",
  unknown: "border-border text-muted-foreground",
};

function CountdownBadge({ countdown }: { countdown: Countdown }) {
  if (countdown.status === "expired") {
    return (
      <Badge
        variant="outline"
        className={`text-xs font-semibold shrink-0 ${STATUS_STYLES.expired}`}
      >
        ⚠ EXPIRED — seek legal advice immediately
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`text-xs shrink-0 ${STATUS_STYLES[countdown.status]}`}
    >
      {countdown.elapsed}d elapsed · {countdown.remaining}d remaining
    </Badge>
  );
}

interface StatuteLimitationsPanelProps {
  accidentDate?: Date;
}

export default function StatuteLimitationsPanel({
  accidentDate,
}: StatuteLimitationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { country } = useCountry();
  const isMalta = country === "mt";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-violet-200/60 dark:border-violet-800/30">
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-2">
                <AlarmClock className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <CardTitle className="text-sm font-semibold">
                  {isMalta
                    ? "Prescription Periods (Malta)"
                    : "Statute of Limitations (UK)"}
                </CardTitle>
                {accidentDate && (
                  <Badge
                    variant="outline"
                    className="text-xs border-violet-400 text-violet-700 dark:text-violet-400"
                  >
                    Live countdowns active
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 space-y-3">
            {/* Info note */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-50/50 dark:bg-violet-950/10 border border-violet-200/60 dark:border-violet-800/30">
              <Info className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isMalta ? (
                  <>
                    Maltese prescription periods under{" "}
                    <strong className="text-foreground">
                      Civil Code Cap. 16, Art. 2153
                    </strong>
                    . Missing a prescription deadline extinguishes your right to
                    claim.
                    {accidentDate
                      ? " Countdowns are calculated from the reported accident date."
                      : " Enter the accident date in the report to see live countdowns."}
                  </>
                ) : (
                  <>
                    UK limitation periods under the{" "}
                    <strong className="text-foreground">
                      Limitation Act 1980
                    </strong>
                    . Missing a limitation deadline will ordinarily bar your
                    claim.
                    {accidentDate
                      ? " Countdowns are calculated from the reported accident date."
                      : " Enter the accident date in the report to see live countdowns."}
                  </>
                )}
              </p>
            </div>

            {/* Limitation entries */}
            <div className="space-y-2">
              {(isMalta ? MALTA_PRESCRIPTION_ENTRIES : LIMITATION_ENTRIES).map(
                (entry, index) => {
                  const countdown = accidentDate
                    ? computeCountdown(accidentDate, entry.periodDays)
                    : null;
                  const dataIndex = index + 1;

                  return (
                    <div
                      key={entry.id}
                      data-ocid={`limitations.item.${dataIndex}`}
                      className={`p-3 rounded-lg border transition-colors ${
                        countdown?.status === "expired"
                          ? "bg-red-50/60 border-red-300/60 dark:bg-red-950/10 dark:border-red-800/30"
                          : countdown?.status === "red"
                            ? "bg-red-50/30 border-red-200/50 dark:bg-red-950/5 dark:border-red-900/20"
                            : "bg-card border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {entry.name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="text-xs font-semibold"
                            >
                              {entry.period}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {entry.statute}
                            </span>
                          </div>
                        </div>
                        {countdown && <CountdownBadge countdown={countdown} />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                        {entry.notes}
                      </p>
                    </div>
                  );
                },
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isMalta ? (
                  <>
                    Prescription periods may be interrupted or suspended in
                    certain circumstances, including claims involving minors,
                    lack of capacity, or fraud. This tool provides general
                    guidance only and does not constitute legal advice. Always
                    consult a qualified <strong>avukat (advocate)</strong>{" "}
                    enrolled with the Chamber of Advocates of Malta before
                    prescription expires.
                  </>
                ) : (
                  <>
                    Limitation periods may be extended or varied in certain
                    circumstances, including claims involving minors, lack of
                    mental capacity, fraud, or deliberate concealment. This tool
                    provides general guidance only and does not constitute legal
                    advice. Always consult a qualified{" "}
                    <strong>solicitor</strong> before limitation expires.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

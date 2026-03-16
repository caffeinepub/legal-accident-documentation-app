import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import type React from "react";
import type { FaultLikelihoodAssessment } from "../backend.d";

interface AIConsistencyCheckerProps {
  inferredCrashType?: string;
  faultLikelihoodAssessment?: FaultLikelihoodAssessment;
}

type ConsistencyResult =
  | { status: "consistent"; message: string }
  | { status: "inconsistent"; message: string; rule?: string }
  | { status: "unknown"; message: string }
  | { status: "no_data" };

function checkConsistency(
  crashType: string | undefined,
  assessment: FaultLikelihoodAssessment | undefined,
): ConsistencyResult {
  if (!crashType || !assessment) {
    return { status: "no_data" };
  }

  const type = crashType.toLowerCase();
  const partyA = Number(assessment.partyAPercentage);
  const partyB = Number(assessment.partyBPercentage);

  if (/rear[- ]end|tailgating|rear end/.test(type)) {
    if (partyA > 50) {
      return {
        status: "inconsistent",
        message: `Rear-end collisions typically assign majority fault (≥60%) to the following vehicle (Party B). Current assessment assigns ${partyA}% to Party A — this may warrant legal review.`,
        rule: "Highway Code Rule 126 (safe following distances)",
      };
    }
    return {
      status: "consistent",
      message: `Fault split aligns with expected liability pattern for a rear-end collision. Party B (${partyB}%) bears the majority, consistent with Highway Code Rule 126.`,
    };
  }

  if (/head[- ]on/.test(type)) {
    if (partyA < 20 || partyB < 20) {
      return {
        status: "inconsistent",
        message: `Head-on collisions typically involve shared high fault. A split of ${partyA}% / ${partyB}% is unusual and warrants legal review to confirm road position and intent.`,
        rule: "Highway Code Rule 163 (overtaking)",
      };
    }
    return {
      status: "consistent",
      message: `Fault split reflects the shared liability typically seen in head-on collisions (${partyA}% / ${partyB}%).`,
    };
  }

  if (/side[- ]impact|t[- ]bone|junction|intersection/.test(type)) {
    if (partyA > 60) {
      return {
        status: "inconsistent",
        message: `Side-impact collisions typically assign majority fault (≥55%) to the striking vehicle (Party B). Current assessment assigns ${partyA}% to Party A — review junction priority rules.`,
        rule: "Highway Code Rules 170–178 (junctions)",
      };
    }
    return {
      status: "consistent",
      message: `Fault split aligns with expected liability for a side-impact collision. Party B (${partyB}%) bears the majority consistent with junction priority rules.`,
    };
  }

  if (/lane[- ]change|merging/.test(type)) {
    if (partyB < 55) {
      return {
        status: "inconsistent",
        message: `Lane-change collisions typically assign ≥55% fault to the merging vehicle (Party B). Current assessment shows Party B at ${partyB}% — check mirror and signal compliance.`,
        rule: "Highway Code Rule 133 (lane discipline)",
      };
    }
    return {
      status: "consistent",
      message: `Fault split is consistent with lane-change liability expectations. Party B (${partyB}%) bears majority fault.`,
    };
  }

  if (/parking|stationary/.test(type)) {
    if (partyB < 70) {
      return {
        status: "inconsistent",
        message: `Collisions with stationary/parked vehicles typically assign ≥70% fault to the moving vehicle (Party B). Current assessment shows Party B at ${partyB}%.`,
        rule: "Highway Code Rule 239 (parking)",
      };
    }
    return {
      status: "consistent",
      message: `Fault split is consistent — the moving vehicle (Party B at ${partyB}%) bears majority liability for a parking/stationary collision.`,
    };
  }

  return {
    status: "unknown",
    message:
      "Unable to verify consistency — crash type not recognised in the liability rule set.",
  };
}

const AIConsistencyChecker: React.FC<AIConsistencyCheckerProps> = ({
  inferredCrashType,
  faultLikelihoodAssessment,
}) => {
  const result = checkConsistency(inferredCrashType, faultLikelihoodAssessment);

  return (
    <Card data-ocid="ai_consistency.panel" className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BrainCircuit className="h-4 w-4 text-primary" />
          AI Consistency Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result.status === "no_data" && (
          <p className="text-sm text-muted-foreground italic">
            Run fault assessment and photo analysis to enable consistency check.
          </p>
        )}

        {result.status === "consistent" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-700">
                Consistent
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.message}
            </p>
          </div>
        )}

        {result.status === "inconsistent" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                Review Recommended
              </Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {result.message}
            </p>
            {result.rule && (
              <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md border border-border/40">
                <span className="font-medium">Reference:</span> {result.rule}
              </p>
            )}
          </div>
        )}

        {result.status === "unknown" && (
          <div className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIConsistencyChecker;

import { Fingerprint, Hash, ShieldCheck, UserCheck } from "lucide-react";
import { formatClaimId } from "../utils/claimId";

const TRUST_SEAL_DELIMITER = "---TRUST_SEAL---\n";

interface TrustSeal {
  signatory: string;
  hash: string;
  submittedAt: string;
}

function parseTrustSeal(witnessStatement: string): TrustSeal | null {
  const idx = witnessStatement.indexOf(TRUST_SEAL_DELIMITER);
  if (idx === -1) return null;
  try {
    const json = witnessStatement
      .slice(idx + TRUST_SEAL_DELIMITER.length)
      .trim();
    return JSON.parse(json) as TrustSeal;
  } catch {
    return null;
  }
}

interface SubmissionCredibilityBadgeProps {
  witnessStatement: string;
  timestamp: bigint;
  reportId?: bigint;
}

export default function SubmissionCredibilityBadge({
  witnessStatement,
  timestamp,
  reportId,
}: SubmissionCredibilityBadgeProps) {
  const seal = parseTrustSeal(witnessStatement);
  if (!seal) return null;

  const formattedDate = (() => {
    try {
      return new Date(seal.submittedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return seal.submittedAt;
    }
  })();

  const shortHash = `${seal.hash.slice(0, 16)}\u2026`;
  const claimId = reportId ? formatClaimId(reportId, timestamp) : null;

  return (
    <div
      className="rounded-xl border-2 border-trust-border bg-trust-surface px-4 py-3.5 space-y-3"
      data-ocid="report.trust.panel"
    >
      {/* Badge row */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-trust-accent/15">
          <ShieldCheck className="h-4 w-4 text-trust-accent" />
        </div>
        <span className="text-sm font-semibold text-trust-fg">
          Verified Submission
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          Trust Seal Active
        </span>
      </div>

      {/* Details grid */}
      <div
        className={`grid grid-cols-1 gap-1.5 ${claimId ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}
      >
        {/* Submitted at */}
        <div className="flex items-start gap-2 rounded-lg bg-background/60 px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5 text-trust-accent" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Submitted
            </p>
            <p className="text-xs text-foreground font-medium truncate">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Signed by */}
        <div className="flex items-start gap-2 rounded-lg bg-background/60 px-3 py-2">
          <UserCheck className="h-3.5 w-3.5 shrink-0 mt-0.5 text-trust-accent" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Signed by
            </p>
            <p className="text-xs text-foreground font-medium truncate">
              {seal.signatory}
            </p>
          </div>
        </div>

        {/* Fingerprint */}
        <div className="flex items-start gap-2 rounded-lg bg-background/60 px-3 py-2">
          <Fingerprint className="h-3.5 w-3.5 shrink-0 mt-0.5 text-trust-accent" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Fingerprint
            </p>
            <p className="text-xs text-foreground font-mono truncate">
              {shortHash}
            </p>
          </div>
        </div>

        {/* Claim ID */}
        {claimId && (
          <div className="flex items-start gap-2 rounded-lg bg-background/60 px-3 py-2">
            <Hash className="h-3.5 w-3.5 shrink-0 mt-0.5 text-trust-accent" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Claim ID
              </p>
              <p className="text-xs text-foreground font-mono truncate">
                {claimId}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Clock,
  Fingerprint,
  Lock,
  ShieldCheck,
} from "lucide-react";

interface SubmissionTrustPanelProps {
  signatoryName: string;
  onSignatoryNameChange: (name: string) => void;
  agreed: boolean;
  onAgreedChange: (v: boolean) => void;
}

export default function SubmissionTrustPanel({
  signatoryName,
  onSignatoryNameChange,
  agreed,
  onAgreedChange,
}: SubmissionTrustPanelProps) {
  const declarationText = signatoryName.trim()
    ? `I, ${signatoryName.trim()}, confirm that the information in this report is accurate and complete to the best of my knowledge.`
    : "I confirm that the information in this report is accurate and complete to the best of my knowledge.";

  return (
    <div
      className="rounded-xl border-2 border-trust-border bg-trust-surface p-5 space-y-5"
      data-ocid="trust.submit_panel"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust-accent/15">
          <ShieldCheck className="h-4 w-4 text-trust-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-tight">
            Declaration &amp; Trust Seal
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Applied at the moment of submission
          </p>
        </div>
      </div>

      {/* Signatory name input */}
      <div className="space-y-1.5">
        <Label
          htmlFor="trust-signatory-name"
          className="text-sm font-medium text-foreground"
        >
          Full Name
        </Label>
        <Input
          id="trust-signatory-name"
          type="text"
          value={signatoryName}
          onChange={(e) => onSignatoryNameChange(e.target.value)}
          placeholder="Enter your full legal name"
          autoComplete="name"
          className="bg-background"
          data-ocid="trust.signatory.input"
        />
      </div>

      {/* Agreement checkbox */}
      <div className="flex items-start gap-3 rounded-lg border border-trust-border bg-background/60 p-3.5">
        <Checkbox
          id="trust-agreement"
          checked={agreed}
          onCheckedChange={(checked) => onAgreedChange(checked === true)}
          className="mt-0.5 shrink-0"
          data-ocid="trust.agreement.checkbox"
        />
        <Label
          htmlFor="trust-agreement"
          className="text-sm leading-relaxed text-foreground cursor-pointer"
        >
          {declarationText}
        </Label>
      </div>

      {/* Info notices */}
      <div className="space-y-2.5">
        {/* Timestamp notice */}
        <div className="flex items-start gap-2.5 rounded-lg border border-trust-amber-border bg-trust-amber-surface px-3.5 py-2.5">
          <Clock className="h-4 w-4 shrink-0 mt-0.5 text-trust-amber-fg" />
          <p className="text-xs leading-relaxed text-trust-amber-fg">
            <span className="font-semibold">Timestamp: </span>
            This report will be timestamped at the exact moment of submission.
            The timestamp will be embedded in the final report.
          </p>
        </div>

        {/* Hash / fingerprint notice */}
        <div className="flex items-start gap-2.5 rounded-lg border border-trust-amber-border bg-trust-amber-surface px-3.5 py-2.5">
          <Fingerprint className="h-4 w-4 shrink-0 mt-0.5 text-trust-amber-fg" />
          <p className="text-xs leading-relaxed text-trust-amber-fg">
            <span className="font-semibold">Cryptographic Fingerprint: </span>A
            SHA-256 fingerprint will be generated from your report data at
            submission. This allows any post-submission changes to be detected.
          </p>
        </div>
      </div>

      {/* Submit readiness indicator */}
      {!agreed || !signatoryName.trim() ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>
            Enter your full name and check the declaration above to enable
            submission.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-trust-fg">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium">
            Ready to submit — trust seal will be applied on submission.
          </span>
        </div>
      )}
    </div>
  );
}

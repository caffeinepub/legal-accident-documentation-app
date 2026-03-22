import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Scale } from "lucide-react";
import { useState } from "react";
import { useCountry } from "../contexts/CountryContext";

interface ProtocolStep {
  id: number;
  title: string;
  description: string;
  deadline?: string;
  cprRef: string;
  urgency: "immediate" | "short" | "medium" | "ongoing";
}

const UK_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 1,
    title: "Instruct a solicitor / notify insurer",
    description:
      "Contact your insurer and instruct a solicitor as soon as possible. Failure to notify within the policy deadline may prejudice your claim.",
    deadline: "Within 24 hours",
    cprRef: "CPR Pre-Action Protocol §2.1",
    urgency: "immediate",
  },
  {
    id: 2,
    title: "Send Early Notification Letter (ENL)",
    description:
      "Optional letter to the defendant's insurer giving advance notice of the claim. Reduces disputes and speeds up the OIC portal process.",
    deadline: "Optional — recommended",
    cprRef: "CPR PAP §3.2",
    urgency: "short",
  },
  {
    id: 3,
    title: "Submit Claim Notification Form (CNF)",
    description:
      "Submit the CNF via the OIC Portal. Must be done within 3 years of the incident date (primary limitation period).",
    deadline: "Within 3 years of incident",
    cprRef: "CPR PAP §5.1",
    urgency: "medium",
  },
  {
    id: 4,
    title: "Obtain Medical Report",
    description:
      "Arrange a medical examination with an accredited MedCo practitioner. A formal medical report is required to evidence injury.",
    deadline: "As soon as practicable",
    cprRef: "CPR PAP §7.1",
    urgency: "short",
  },
  {
    id: 5,
    title: "Prepare Schedule of Loss",
    description:
      "Document all financial losses, including lost earnings, travel expenses, and care costs. Keep all receipts and evidence.",
    deadline: "Before sending Letter of Claim",
    cprRef: "CPR PAP §6.3",
    urgency: "medium",
  },
  {
    id: 6,
    title: "Send Letter of Claim",
    description:
      "Send a formal Letter of Claim to the defendant's insurer with a summary of the accident, injuries, and losses. A 3-month response window then begins.",
    deadline: "3-month response window begins",
    cprRef: "CPR PAP §3.7",
    urgency: "medium",
  },
  {
    id: 7,
    title: "Await Letter of Response",
    description:
      "The defendant has 3 months to respond. If liability is admitted, proceed to negotiate. If denied or no response, consider court proceedings.",
    deadline: "3 months from Letter of Claim",
    cprRef: "CPR PAP §6.6",
    urgency: "ongoing",
  },
  {
    id: 8,
    title: "Consider Part 36 Offer",
    description:
      "If a settlement offer is made, consider whether to accept. A strategically timed Part 36 offer can have significant cost consequences for the opposing party.",
    deadline: "Before / during proceedings",
    cprRef: "CPR Part 36",
    urgency: "ongoing",
  },
];

const MALTA_PROTOCOL_STEPS: ProtocolStep[] = [
  {
    id: 1,
    title: "Instruct a Maltese Advocate (Avukat)",
    description:
      "Contact your insurer and instruct an advocate enrolled with the Chamber of Advocates of Malta as soon as possible. The 2-year prescription period under Civil Code Art. 2153 begins from the accident date.",
    deadline: "As soon as possible",
    cprRef: "Civil Code Cap. 16, Art. 2153",
    urgency: "immediate",
  },
  {
    id: 2,
    title: "Notify Your Insurer and the Third Party's Insurer",
    description:
      "Report the accident to your own insurer and, where possible, notify the defendant's insurer directly. Malta applies the EU Motor Insurance Directive — cross-border claims use the Green Card system.",
    deadline: "Within 24–48 hours",
    cprRef:
      "Motor Vehicles Insurance Ordinance Cap. 104 / EU Directive 2009/103/EC",
    urgency: "immediate",
  },
  {
    id: 3,
    title: "Obtain a Medical Report",
    description:
      "Arrange a medical examination as soon as possible after the accident. A formal medical certificate or specialist report is required to establish the nature and extent of injuries in any Maltese court claim.",
    deadline: "As soon as practicable",
    cprRef: "Civil Code Cap. 16, Art. 1031 — evidential requirement",
    urgency: "short",
  },
  {
    id: 4,
    title: "Prepare a Schedule of Damages",
    description:
      "Document all financial losses: vehicle repair or replacement costs, medical expenses, lost earnings, and any other out-of-pocket costs. Retain all receipts and supporting documents.",
    deadline: "Before issuing formal demand",
    cprRef: "Civil Code Cap. 16, Arts. 1031–1033",
    urgency: "medium",
  },
  {
    id: 5,
    title: "Send Formal Letter of Demand (Talba)",
    description:
      "Send a written demand to the defendant and/or their insurer setting out the accident circumstances, the basis of liability, and the compensation sought. Allow 21 days for a response before filing in court.",
    deadline: "21-day response period begins",
    cprRef: "Civil Code Cap. 16, Arts. 1031–1033",
    urgency: "medium",
  },
  {
    id: 6,
    title: "Await Response from Defendant / Insurer",
    description:
      "Allow 21 days for the defendant or their insurer to admit liability or make a settlement proposal. If disputed or no response, proceedings may be filed in the Magistrates' Court or Civil Court, First Hall.",
    deadline: "21 days from formal demand",
    cprRef: "Code of Organisation and Civil Procedure Cap. 12",
    urgency: "ongoing",
  },
  {
    id: 7,
    title: "File Court Application (if required)",
    description:
      "If the matter is not resolved, file a sworn application (rikors) in the court of appropriate jurisdiction: Magistrates' Court (up to €5,000), Civil Court First Hall (up to €50,000), or Court of Appeal for higher-value claims.",
    deadline: "Before 2-year prescription expires",
    cprRef: "Code of Organisation and Civil Procedure Cap. 12, Art. 795",
    urgency: "ongoing",
  },
  {
    id: 8,
    title: "Consider Settlement Offer (Ftehim)",
    description:
      "If a settlement offer is made by the insurer or defendant, consider it carefully with your advocate. A settlement can be reached at any stage before judgment. Ensure any agreement is documented in writing.",
    deadline: "Before / during proceedings",
    cprRef:
      "Civil Code Cap. 16, Art. 1033 (contributory negligence considered in offers)",
    urgency: "ongoing",
  },
];

const URGENCY_STYLES: Record<
  ProtocolStep["urgency"],
  { badge: string; label: string }
> = {
  immediate: {
    badge:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-700/40",
    label: "Immediate",
  },
  short: {
    badge:
      "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-700/40",
    label: "Short-term",
  },
  medium: {
    badge:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-700/40",
    label: "Medium-term",
  },
  ongoing: {
    badge: "bg-muted text-muted-foreground border-border",
    label: "Ongoing",
  },
};

export default function PreActionProtocolPanel() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const { country } = useCountry();
  const isMalta = country === "mt";

  const PROTOCOL_STEPS = isMalta ? MALTA_PROTOCOL_STEPS : UK_PROTOCOL_STEPS;

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((checked.size / PROTOCOL_STEPS.length) * 100);

  return (
    <div className="space-y-4" data-ocid="protocol.panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale size={15} className="text-primary" />
          <p className="text-sm font-semibold">
            {isMalta
              ? "Pre-Action Checklist (Malta)"
              : "Pre-Action Protocol Checklist"}
          </p>
          <Badge variant="outline" className="text-xs">
            {isMalta ? "Civil Code Cap. 16" : "CPR"}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {checked.size}/{PROTOCOL_STEPS.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <Progress
          value={progress}
          className="h-2"
          data-ocid="protocol.loading_state"
        />
        <p className="text-xs text-muted-foreground text-right">{progress}%</p>
      </div>

      <Separator />

      {/* Steps */}
      <div className="space-y-2">
        {PROTOCOL_STEPS.map((step, idx) => {
          const done = checked.has(step.id);
          const urgencyStyle = URGENCY_STYLES[step.urgency];
          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                done
                  ? "bg-muted/30 border-border opacity-70"
                  : "bg-card border-border hover:bg-muted/20"
              }`}
              data-ocid={`protocol.item.${idx + 1}`}
            >
              {/* Step number */}
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    done
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 size={14} /> : step.id}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <Label
                    htmlFor={`proto-step-${step.id}`}
                    className={`text-sm font-semibold cursor-pointer leading-snug ${
                      done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {step.title}
                  </Label>
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                        urgencyStyle.badge
                      }`}
                    >
                      {urgencyStyle.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {step.deadline && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Circle size={8} className="shrink-0" />
                      {step.deadline}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    {step.cprRef}
                  </span>
                </div>
              </div>

              {/* Checkbox */}
              <div className="shrink-0">
                <Checkbox
                  id={`proto-step-${step.id}`}
                  checked={done}
                  onCheckedChange={() => toggle(step.id)}
                  data-ocid={`protocol.checkbox.${idx + 1}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {checked.size === PROTOCOL_STEPS.length && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-xs text-green-700 dark:text-green-400 font-medium"
          data-ocid="protocol.success_state"
        >
          <CheckCircle2 size={14} className="shrink-0" />
          {isMalta
            ? "All pre-action steps completed. You are ready to proceed with your claim in Malta."
            : "All pre-action steps completed. You are ready to proceed with your claim."}
        </div>
      )}
    </div>
  );
}

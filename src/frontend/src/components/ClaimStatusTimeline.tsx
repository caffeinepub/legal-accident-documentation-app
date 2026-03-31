import { CheckCircle2, Clock, FileEdit, Send } from "lucide-react";
import type React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const STEP_KEYS = [
  { icon: FileEdit, statusKey: "draft" as const },
  { icon: Send, statusKey: "submitted" as const },
  { icon: Clock, statusKey: "acknowledged" as const },
  { icon: CheckCircle2, statusKey: "settled" as const },
];

const STATUS_INDEX: Record<string, number> = {
  draft: 0,
  submitted: 1,
  under_review: 2,
  acknowledged: 2,
  settled: 3,
};

interface ClaimStatusTimelineProps {
  currentStatus: string;
  submittedAt?: bigint | null;
}

export default function ClaimStatusTimeline({
  currentStatus,
  submittedAt,
}: ClaimStatusTimelineProps) {
  const { t } = useLanguage();
  const currentIndex = STATUS_INDEX[currentStatus] ?? 0;

  const steps = STEP_KEYS.map((s) => ({
    icon: s.icon,
    key: s.statusKey,
    label: t(`status.${s.statusKey}` as const),
  }));

  return (
    <div data-ocid="claim-status.panel" className="py-1">
      {/* Desktop: horizontal stepper */}
      <ol className="hidden sm:flex items-center w-full">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <li
              key={step.key}
              className="flex-1 flex flex-col items-center"
              data-ocid={`claim-status.step.${idx + 1}`}
            >
              <div className="flex items-center w-full">
                {/* Left connector */}
                {idx > 0 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      idx <= currentIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/25"
                    }`}
                  />
                )}
                {/* Step circle */}
                <div className="relative shrink-0">
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-background border-primary text-primary"
                          : "bg-background border-muted-foreground/30 text-muted-foreground/50",
                    ].join(" ")}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-40" />
                  )}
                </div>
                {/* Right connector */}
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      idx < currentIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/25"
                    }`}
                  />
                )}
              </div>
              {/* Label + timestamp */}
              <div className="mt-1.5 text-center">
                <p
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                  }`}
                >
                  {step.label}
                </p>
                {idx === 1 && submittedAt && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(Number(submittedAt)).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical compact list */}
      <ol className="sm:hidden flex flex-col gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <li
              key={step.key}
              className="flex items-center gap-3"
              data-ocid={`claim-status.step.${idx + 1}`}
            >
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-background border-primary text-primary"
                      : "bg-background border-muted-foreground/30 text-muted-foreground/40",
                ].join(" ")}
              >
                <Icon className="w-3 h-3" />
              </div>
              <span
                className={`text-sm ${
                  isCurrent
                    ? "text-primary font-semibold"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </span>
              {idx === 1 && submittedAt && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(Number(submittedAt)).toLocaleDateString("en-GB")}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

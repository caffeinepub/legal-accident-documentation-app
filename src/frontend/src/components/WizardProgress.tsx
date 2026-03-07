import { Check } from "lucide-react";

interface Step {
  label: string;
  number: number;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number; // 1-indexed
}

export default function WizardProgress({
  steps,
  currentStep,
}: WizardProgressProps) {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isUpcoming = stepNum > currentStep;

          return (
            <li
              key={step.number}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Connector line (not on last item) */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 transition-colors duration-300 ${
                    isCompleted ? "bg-primary" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                      : isUpcoming
                        ? "bg-background border-border text-muted-foreground"
                        : ""
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              {/* Step label */}
              <span
                className={`mt-2 text-xs font-medium text-center leading-tight max-w-[64px] transition-colors duration-300 ${
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

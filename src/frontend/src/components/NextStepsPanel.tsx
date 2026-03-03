import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  Info,
  Navigation,
  Phone,
  Scale,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { nextStepsData } from "../data/nextSteps";
import type { NextStep, NextStepsCategory } from "../data/nextSteps";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "immediate-actions": <AlertCircle className="w-4 h-4 text-destructive" />,
  "reporting-obligations": <FileText className="w-4 h-4 text-primary" />,
  "claims-process": <ClipboardList className="w-4 h-4 text-primary" />,
  "legal-options": <Scale className="w-4 h-4 text-primary" />,
  "useful-contacts": <Phone className="w-4 h-4 text-primary" />,
};

function StepItem({ step }: { step: NextStep }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-b-0">
      <div className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-semibold text-foreground">{step.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {step.description}
        </p>
        {step.reference && (
          <p className="text-xs text-primary font-medium mt-1">
            📋 {step.reference}
          </p>
        )}
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: NextStepsCategory }) {
  const icon = CATEGORY_ICONS[category.id] ?? (
    <Navigation className="w-4 h-4 text-primary" />
  );

  return (
    <AccordionItem
      value={category.id}
      className="border rounded-lg px-3 bg-card"
    >
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-foreground">
            {category.categoryTitle}
          </span>
          <Badge variant="outline" className="text-xs ml-1">
            {category.steps.length}{" "}
            {category.steps.length === 1 ? "step" : "steps"}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="divide-y divide-border">
          {category.steps.map((step) => (
            <StepItem key={step.title} step={step} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function NextStepsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-none hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">Next Steps Guidance</span>
          <Badge variant="outline" className="text-xs ml-1">
            {nextStepsData.length} Categories
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{isOpen ? "Hide" : "Show"} guidance</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <Separator />

          {/* Intro note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              The following guidance covers the key steps to take following a
              road traffic incident in the UK, from immediate actions at the
              scene through to legal options and useful contacts. Expand each
              category for detailed guidance.
            </p>
          </div>

          {/* Accordion categories */}
          <Accordion type="multiple" className="space-y-2">
            {nextStepsData.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </Accordion>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This guidance is for informational purposes only and does not
              constitute legal advice. Time limits and procedures may vary
              depending on your specific circumstances. Always consult a
              qualified solicitor or relevant authority for advice tailored to
              your situation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

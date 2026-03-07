import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { useState } from "react";

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  timeLimit: string;
  urgency: "immediate" | "urgent" | "practicable";
  reference: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 1,
    title: "Call Police",
    description:
      "Report the incident if it involves personal injury, a hit and run, or if the road is obstructed. Obtain a crime or incident reference number for insurance purposes.",
    timeLimit: "Immediate / within 24 hours",
    urgency: "immediate",
    reference: "Road Traffic Act 1988, s.170",
  },
  {
    id: 2,
    title: "Notify Your Insurer",
    description:
      "Report the incident to your insurance company even if you do not intend to make a claim. Failure to notify may prejudice your policy and constitute a breach of your insurance contract.",
    timeLimit: "Within 24–48 hours",
    urgency: "urgent",
    reference: "Policy obligation (standard insurance terms)",
  },
  {
    id: 3,
    title: "DVLA Notification",
    description:
      "Notify the DVLA if your vehicle has been declared a total loss (written off) or if an injury-related medical condition may affect your fitness to drive.",
    timeLimit: "As soon as practicable",
    urgency: "practicable",
    reference: "Road Traffic Act 1988, s.94",
  },
  {
    id: 4,
    title: "Seek Medical Attention",
    description:
      "Visit your GP or A&E department promptly. Document all injuries, symptoms and treatments carefully. Early medical evidence strengthens any personal injury claim.",
    timeLimit: "Within 24–48 hours",
    urgency: "urgent",
    reference: "Recommended for evidential purposes",
  },
  {
    id: 5,
    title: "Gather Evidence",
    description:
      "Collect photographs of the scene, vehicle damage, road conditions, weather, traffic signs, and witness contact details. Preserve dashcam footage immediately — it may be overwritten.",
    timeLimit: "Immediately at scene where possible",
    urgency: "immediate",
    reference: "Pre-Action Protocol for Personal Injury Claims",
  },
  {
    id: 6,
    title: "Contact a Solicitor",
    description:
      "For personal injury or disputed liability claims, consult a qualified solicitor. Many operate on a no-win, no-fee (conditional fee agreement) basis. Do not delay — limitation periods are strict.",
    timeLimit: "As soon as possible (3-year limitation)",
    urgency: "practicable",
    reference: "Limitation Act 1980, s.11",
  },
  {
    id: 7,
    title: "Notify DVLA of Vehicle Write-Off",
    description:
      "If your insurer declares the vehicle a total loss, notify the DVLA and return the V5C logbook. Retain the yellow 'sell, transfer or part-exchange' slip for your records.",
    timeLimit: "Promptly after insurer's total-loss decision",
    urgency: "practicable",
    reference: "Vehicle Excise and Registration Act 1994",
  },
];

const URGENCY_BADGE: Record<
  ChecklistItem["urgency"],
  { label: string; className: string }
> = {
  immediate: {
    label: "Immediate",
    className:
      "border-red-400 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 dark:border-red-700",
  },
  urgent: {
    label: "24–48 Hours",
    className:
      "border-amber-400 text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-700",
  },
  practicable: {
    label: "As Soon As Practicable",
    className:
      "border-blue-400 text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-700",
  },
};

export default function PostIncidentChecklist() {
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = Math.round(
    (checkedCount / CHECKLIST_ITEMS.length) * 100,
  );

  const toggleItem = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-emerald-200/60 dark:border-emerald-800/30">
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <ClipboardList className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <CardTitle className="text-sm font-semibold">
                  Post-Incident Checklist
                </CardTitle>
                {checkedCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-400 text-emerald-700 dark:text-emerald-400"
                  >
                    {checkedCount}/{CHECKLIST_ITEMS.length} completed
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
          <CardContent className="pt-0 pb-4 px-4 space-y-4">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Steps completed
                </span>
                <span className="font-semibold text-foreground">
                  {progressPercent}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2 [&>div]:bg-emerald-500"
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item, index) => {
                const badge = URGENCY_BADGE[item.urgency];
                const isChecked = !!checked[item.id];
                const dataIndex = index + 1;

                return (
                  <div
                    key={item.id}
                    data-ocid={`checklist.item.${dataIndex}`}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      isChecked
                        ? "bg-emerald-50/60 border-emerald-200/60 dark:bg-emerald-950/10 dark:border-emerald-800/30"
                        : "bg-card border-border hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      data-ocid={`checklist.checkbox.${dataIndex}`}
                      id={`checklist-item-${item.id}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-0.5 shrink-0 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start gap-2 flex-wrap">
                        <label
                          htmlFor={`checklist-item-${item.id}`}
                          className={`text-sm font-semibold cursor-pointer leading-snug ${
                            isChecked
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </label>
                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${badge.className}`}
                        >
                          {badge.label}
                        </Badge>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${isChecked ? "text-muted-foreground/70" : "text-muted-foreground"}`}
                      >
                        {item.description}
                      </p>
                      <p className="text-xs text-primary/80 font-medium">
                        {item.reference}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground pt-1 border-t border-border">
              <span className="font-medium">Time limit key:</span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
                Immediate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
                24–48 hrs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />
                As practicable
              </span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

import type { AccidentNarrative, AccidentReport } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAccidentAssessment } from "@/hooks/useQueries";
import { generateAccidentNarrative } from "@/utils/narrativeGenerator";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Loader2,
  Save,
  Sparkles,
  User,
  Video,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface AccidentNarrativePanelProps {
  reportId: bigint;
  report: AccidentReport;
  narrative?: AccidentNarrative;
}

const EVIDENCE_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  video: {
    label: "Video",
    icon: <Video size={12} />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  photo: {
    label: "Photo",
    icon: <Camera size={12} />,
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  witness: {
    label: "Witness",
    icon: <User size={12} />,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  description: {
    label: "Description",
    icon: <FileText size={12} />,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  third_party_info: {
    label: "Third Party",
    icon: <AlertCircle size={12} />,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  traffic_signal: {
    label: "Traffic Signal",
    icon: <Info size={12} />,
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  conditions: {
    label: "Conditions",
    icon: <Info size={12} />,
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  },
};

export default function AccidentNarrativePanel({
  reportId,
  report,
  narrative,
}: AccidentNarrativePanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [editedText, setEditedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [localNarrative, setLocalNarrative] =
    useState<AccidentNarrative | null>(narrative ?? null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateAssessment = useUpdateAccidentAssessment();

  useEffect(() => {
    if (narrative) {
      setLocalNarrative(narrative);
      setEditedText(narrative.narrativeText);
    }
  }, [narrative]);

  const handleGenerate = () => {
    const generated = generateAccidentNarrative(report);
    setLocalNarrative(generated);
    setEditedText(generated.narrativeText);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!localNarrative) return;
    const updated: AccidentNarrative = {
      ...localNarrative,
      narrativeText: editedText,
    };
    await updateAssessment.mutateAsync({
      reportId,
      accidentNarrative: updated,
      damageSeverity: report.damageSeverity ?? null,
      faultLikelihoodAssessment: report.faultLikelihoodAssessment ?? null,
    });
    setLocalNarrative(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEdit = () => {
    setEditedText(localNarrative?.narrativeText ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedText(localNarrative?.narrativeText ?? "");
    setIsEditing(false);
  };

  const hasNarrative = !!localNarrative;
  const gapCount = localNarrative?.evidenceGaps?.length ?? 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left group"
            >
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                AI Accident Narrative
                {hasNarrative && (
                  <Badge variant="secondary" className="text-xs">
                    Generated
                  </Badge>
                )}
                {gapCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-amber-600 border-amber-400"
                  >
                    {gapCount} evidence gap{gapCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {!hasNarrative ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Sparkles size={32} className="text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground max-w-sm">
                  Generate an AI-powered accident narrative from your report
                  data and dash cam analysis. The narrative can be edited before
                  saving.
                </p>
                <Button onClick={handleGenerate} size="sm" className="gap-2">
                  <Sparkles size={14} />
                  Generate Narrative
                </Button>
              </div>
            ) : (
              <>
                {/* Narrative text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Incident Narrative
                    </p>
                    <div className="flex items-center gap-2">
                      {saveSuccess && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={12} /> Saved
                        </span>
                      )}
                      {!isEditing ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEdit}
                          className="h-7 text-xs"
                        >
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="h-7 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={updateAssessment.isPending}
                            className="h-7 text-xs gap-1"
                          >
                            {updateAssessment.isPending ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Save size={12} />
                            )}
                            Save
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={8}
                      className="text-sm leading-relaxed resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-muted/30 rounded-lg border border-border text-sm leading-relaxed">
                      {localNarrative.narrativeText}
                    </div>
                  )}
                </div>

                {/* Regenerate button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    className="gap-1 text-xs h-7"
                  >
                    <Sparkles size={12} />
                    Regenerate
                  </Button>
                </div>

                {/* Evidence Gaps */}
                {localNarrative.evidenceGaps &&
                  localNarrative.evidenceGaps.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <AlertCircle size={12} className="text-amber-500" />
                        Evidence Gaps & Recommendations
                      </p>
                      <div className="space-y-2">
                        {localNarrative.evidenceGaps.map((gap) => {
                          const config =
                            EVIDENCE_TYPE_CONFIG[gap.evidenceType] ??
                            EVIDENCE_TYPE_CONFIG.description;
                          const confidence = Number(gap.confidenceLevel);
                          return (
                            <div
                              key={gap.description}
                              className="flex gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-900/10"
                            >
                              <AlertCircle
                                size={14}
                                className="text-amber-500 mt-0.5 shrink-0"
                              />
                              <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                                  >
                                    {config.icon}
                                    {config.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Priority:{" "}
                                    {confidence >= 80
                                      ? "High"
                                      : confidence >= 60
                                        ? "Medium"
                                        : "Low"}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed">
                                  {gap.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

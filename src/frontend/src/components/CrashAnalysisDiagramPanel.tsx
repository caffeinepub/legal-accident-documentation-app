import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Edit3,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { ScenarioKey } from "../data/scenarioReferences";
import {
  inferCrashTypeFromText,
  isLowConfidence,
  scenarioDefaultDescription,
  scenarioLabel,
} from "../utils/crashTypeInference";
import CrashScenarioDiagram from "./CrashScenarioDiagram";

interface CrashAnalysisDiagramPanelProps {
  analysisText: string;
  onAdditionalPhotos?: (files: FileList) => void;
}

export default function CrashAnalysisDiagramPanel({
  analysisText,
  onAdditionalPhotos,
}: CrashAnalysisDiagramPanelProps) {
  const inferredKey = inferCrashTypeFromText(analysisText);
  const lowConfidence = isLowConfidence(analysisText);

  const [scenarioKey, setScenarioKey] = useState<ScenarioKey | null>(
    inferredKey,
  );
  const [description, setDescription] = useState<string>(
    inferredKey ? scenarioDefaultDescription[inferredKey] : "",
  );
  const [showManualEntry, setShowManualEntry] = useState<boolean>(!inferredKey);
  const [manualDescription, setManualDescription] = useState("");
  const [photoDismissed, setPhotoDismissed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  // Re-infer if analysisText changes externally
  useEffect(() => {
    const key = inferCrashTypeFromText(analysisText);
    setScenarioKey(key);
    setDescription(key ? scenarioDefaultDescription[key] : "");
    setShowManualEntry(!key);
  }, [analysisText]);

  const handleManualDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const val = e.target.value;
    setManualDescription(val);
    const mapped = inferCrashTypeFromText(val);
    if (mapped) {
      setScenarioKey(mapped);
      setDescription(scenarioDefaultDescription[mapped]);
    } else {
      setScenarioKey(null);
    }
  };

  const handleAdditionalFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdditionalPhotos?.(e.target.files);
      setPhotoDismissed(true);
    }
    if (additionalInputRef.current) additionalInputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 border-t border-border pt-4"
      data-ocid="crash-diagram.panel"
    >
      {/* Section header */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">
          Crash Scenario Diagram
        </h3>
        {scenarioKey && (
          <Badge
            variant="secondary"
            className="text-xs ml-auto"
            data-ocid="crash-diagram.success_state"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            AI-Inferred
          </Badge>
        )}
      </div>

      {/* Low-confidence amber callout */}
      <AnimatePresence>
        {lowConfidence && !photoDismissed && (
          <motion.div
            key="low-conf"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert className="border-amber-500/60 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700 dark:text-amber-400 text-sm font-semibold">
                More photos needed to confirm scenario
              </AlertTitle>
              <AlertDescription className="text-amber-700/90 dark:text-amber-300/90 text-sm">
                We need more photos to confirm the crash scenario. Please upload
                additional angles of the damage.
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-amber-500 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30 gap-1.5"
                    onClick={() => additionalInputRef.current?.click()}
                    data-ocid="crash-diagram.upload_button"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Upload More Photos
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-amber-600 hover:bg-amber-100 dark:text-amber-400"
                    onClick={() => {
                      setPhotoDismissed(true);
                      setShowManualEntry(true);
                    }}
                    data-ocid="crash-diagram.secondary_button"
                  >
                    Describe instead
                  </Button>
                </div>
                <input
                  ref={additionalInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleAdditionalFiles}
                  data-ocid="crash-diagram.dropzone"
                />
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagram */}
      {scenarioKey ? (
        <CrashScenarioDiagram scenarioKey={scenarioKey} />
      ) : (
        <div
          className="rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center py-8 text-muted-foreground"
          data-ocid="crash-diagram.empty_state"
        >
          <MapPin className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-sm font-medium">
            Crash scenario could not be determined
          </p>
          <p className="text-xs mt-1 text-center max-w-xs">
            Use the description field below to identify the scenario, or upload
            more photos.
          </p>
        </div>
      )}

      {/* Editable crash description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="crash-scenario-description"
            className="text-sm font-medium"
          >
            Crash Scenario
            <span className="text-muted-foreground font-normal ml-1">
              (edit if incorrect)
            </span>
          </Label>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
            data-ocid="crash-diagram.edit_button"
          >
            <Edit3 className="w-3 h-3" />
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
        {isEditing ? (
          <Textarea
            id="crash-scenario-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="text-sm resize-none"
            placeholder="Describe the crash scenario (e.g. 'Car A was stationary at traffic lights when Car B rear-ended it')…"
            data-ocid="crash-diagram.textarea"
          />
        ) : (
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground min-h-[4rem]">
            {description || (
              <span className="text-muted-foreground italic">
                No scenario description yet — click Edit or describe below.
              </span>
            )}
          </div>
        )}
        {scenarioKey && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-primary/60" />
            Matched scenario: <strong>{scenarioLabel[scenarioKey]}</strong>
          </p>
        )}
      </div>

      {/* Manual description fallback */}
      <AnimatePresence>
        {showManualEntry && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5"
          >
            <Label
              htmlFor="crash-manual-description"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-primary" />
              Describe how the crash happened
            </Label>
            <Textarea
              id="crash-manual-description"
              value={manualDescription}
              onChange={handleManualDescriptionChange}
              rows={3}
              className="text-sm resize-none"
              placeholder="e.g. 'Car A was stationary at traffic lights when Car B rear-ended it at speed. Car A sustained rear bumper damage.'"
              data-ocid="crash-diagram.editor"
            />
            {manualDescription && !scenarioKey && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                No scenario matched — try including keywords like 'rear-end',
                'side impact', 'junction', 'roundabout' or 'reversing'.
              </p>
            )}
            {manualDescription && scenarioKey && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Scenario mapped to:{" "}
                <strong>{scenarioLabel[scenarioKey]}</strong> — diagram updated.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

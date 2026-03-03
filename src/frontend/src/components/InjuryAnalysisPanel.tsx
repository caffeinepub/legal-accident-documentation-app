import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Brain,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Upload,
} from "lucide-react";
import React, { useState } from "react";
import type { ExternalBlob } from "../backend";
import type { AIAnalysisResult } from "../backend";
import type { BodyRegion } from "../data/injuryCorrelation";
import {
  useAddInjuryPhotos,
  useAnalyzeMultimodalImages,
  useStoreAIAnalysis,
  useStoreInjuryPhotos,
} from "../hooks/useQueries";
import InjuryAnalysisUI from "./InjuryAnalysisUI";
import InjuryExportButton from "./InjuryExportButton";
import InjuryPhotoUpload from "./InjuryPhotoUpload";
import InjuryStorageControls from "./InjuryStorageControls";

interface InjuryAnalysisPanelProps {
  reportId: bigint;
}

type Step = "upload" | "analyse" | "store" | "done";

export default function InjuryAnalysisPanel({
  reportId,
}: InjuryAnalysisPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("upload");
  const [injuryPhotoFiles, setInjuryPhotoFiles] = useState<File[]>([]);
  const [damagePhotoFiles, setDamagePhotoFiles] = useState<File[]>([]);
  const [injuryPhotoBlobs, setInjuryPhotoBlobs] = useState<ExternalBlob[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<BodyRegion[]>([]);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addInjuryPhotos = useAddInjuryPhotos();
  const storeInjuryPhotos = useStoreInjuryPhotos();
  const analyzeImages = useAnalyzeMultimodalImages();
  const storeAIAnalysis = useStoreAIAnalysis();

  const hasPhotos = injuryPhotoFiles.length > 0 || damagePhotoFiles.length > 0;

  const handleInjuryPhotosSelected = (blobs: ExternalBlob[], files: File[]) => {
    setInjuryPhotoBlobs(blobs);
    setInjuryPhotoFiles(files);
  };

  const handleDamagePhotosSelected = (
    _blobs: ExternalBlob[],
    files: File[],
  ) => {
    setDamagePhotoFiles(files);
  };

  const handleAnalyze = async () => {
    setAnalysisError(null);
    try {
      const result = await analyzeImages.mutateAsync({
        injuryPhotos: injuryPhotoFiles,
        damagePhotos: damagePhotoFiles,
      });
      setAiResult(result);

      // Auto-save to backend
      try {
        await storeAIAnalysis.mutateAsync({ reportId, analysisResult: result });
        setSaveSuccess(true);
      } catch {
        setStorageError(
          "Analysis complete but could not save to backend. Please try again.",
        );
      }

      setStep("analyse");
    } catch (err: unknown) {
      setAnalysisError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.",
      );
    }
  };

  const handleStore = async () => {
    if (injuryPhotoBlobs.length === 0) {
      setStep("done");
      return;
    }
    try {
      const photoData: Array<[ExternalBlob, string, string]> =
        injuryPhotoBlobs.map((blob, i) => [
          blob,
          selectedRegions[i] ?? "unknown",
          aiResult?.inferredCrashType ?? "unknown",
        ]);
      await addInjuryPhotos.mutateAsync({ reportId, photoBlobs: photoData });
      const summary = aiResult
        ? `Crash type: ${aiResult.inferredCrashType}. Severity: ${aiResult.severity}. ${aiResult.correlationSummary}`
        : `Injury regions: ${selectedRegions.join(", ")}`;
      await storeInjuryPhotos.mutateAsync({ reportId, summary });
      setStep("done");
    } catch (err: unknown) {
      setStorageError(
        err instanceof Error ? err.message : "Failed to store photos.",
      );
    }
  };

  const handleDispose = () => {
    setInjuryPhotoFiles([]);
    setDamagePhotoFiles([]);
    setInjuryPhotoBlobs([]);
    setSelectedRegions([]);
    setAiResult(null);
    setAnalysisError(null);
    setStorageError(null);
    setSaveSuccess(false);
    setStep("upload");
  };

  const isStoring = addInjuryPhotos.isPending || storeInjuryPhotos.isPending;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">
                Injury &amp; Damage Photo Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload photos for AI-powered crash correlation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === "done" && (
              <Badge variant="default" className="bg-green-600">
                Complete
              </Badge>
            )}
            {step === "analyse" && aiResult && (
              <Badge variant="secondary">AI Analysis Ready</Badge>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 p-4 bg-card border border-border rounded-lg space-y-6">
          {/* Step: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              {/* Injury Photos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="h-4 w-4 text-destructive" />
                  <h4 className="font-medium text-foreground">Injury Photos</h4>
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload photos of visible injuries (bruising, lacerations,
                  swelling) to help correlate with crash type.
                </p>
                <InjuryPhotoUpload
                  onPhotosSelected={handleInjuryPhotosSelected}
                  label="Upload Injury Photos"
                />
              </div>

              <div className="border-t border-border" />

              {/* Vehicle Damage Photos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="h-4 w-4 text-amber-500" />
                  <h4 className="font-medium text-foreground">
                    Vehicle Damage Photos
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload photos of vehicle damage (dents, broken glass,
                  deformation) to help determine impact direction and severity.
                </p>
                <InjuryPhotoUpload
                  onPhotosSelected={handleDamagePhotosSelected}
                  label="Upload Vehicle Damage Photos"
                />
              </div>

              {/* Injury Region Selector — shown when injury photos are present */}
              {injuryPhotoFiles.length > 0 && (
                <div>
                  <div className="border-t border-border pt-4" />
                  <InjuryAnalysisUI
                    selectedRegions={selectedRegions}
                    onRegionsChange={setSelectedRegions}
                  />
                </div>
              )}

              {/* Analysis Error */}
              {analysisError && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">{analysisError}</p>
                </div>
              )}

              {/* Analyze Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block w-full">
                      <Button
                        onClick={handleAnalyze}
                        disabled={!hasPhotos || analyzeImages.isPending}
                        className="w-full"
                      >
                        {analyzeImages.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analysing Photos…
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Analyse Photos with AI
                          </>
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!hasPhotos && (
                    <TooltipContent>
                      <p>
                        Upload at least one injury or vehicle damage photo to
                        run analysis
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Step: Analyse Results */}
          {step === "analyse" && aiResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">
                  AI Analysis Results
                </h4>
                {saveSuccess && (
                  <Badge variant="default" className="bg-green-600 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">
                    Inferred Crash Type
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {aiResult.inferredCrashType}
                  </p>
                </div>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">
                    Severity Assessment
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {aiResult.severity}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">
                    Photos Analysed
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {injuryPhotoFiles.length + damagePhotoFiles.length} photo
                    {injuryPhotoFiles.length + damagePhotoFiles.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-md">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Narrative Analysis
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {aiResult.narrativeText}
                </p>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-md">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Injury–Damage Correlation
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {aiResult.correlationSummary}
                </p>
              </div>

              {storageError && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-destructive">{storageError}</p>
                </div>
              )}

              {injuryPhotoBlobs.length > 0 ? (
                <InjuryStorageControls
                  onStore={handleStore}
                  onDispose={handleDispose}
                  isStoring={isStoring}
                  isStored={false}
                />
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDispose}
                    className="flex-1"
                  >
                    Start Over
                  </Button>
                  <Button onClick={() => setStep("done")} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Done
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    Analysis Complete
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {aiResult
                      ? `AI analysis saved: ${aiResult.inferredCrashType} — ${aiResult.severity}`
                      : "Injury photos have been stored for insurance purposes."}
                  </p>
                </div>
              </div>
              <InjuryExportButton reportId={reportId} />
              <Button
                variant="outline"
                onClick={handleDispose}
                className="w-full"
              >
                Run New Analysis
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

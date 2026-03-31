import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ImagePlus,
  Loader2,
  RefreshCw,
  ScanSearch,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { type VehicleContext, analyzePhotos } from "../utils/photoAnalyzer";
import CrashAnalysisDiagramPanel from "./CrashAnalysisDiagramPanel";

interface PhotoFile {
  blob: ExternalBlob;
  filename: string;
  contentType: string;
  previewUrl: string;
}

interface EvidenceGap {
  description: string;
  confidenceLevel: bigint;
  evidenceType: string;
}

interface PhotoUploadProps {
  onPhotosSelected: (
    photos: Array<{
      blob: ExternalBlob;
      filename: string;
      contentType: string;
    }>,
  ) => void;
  onPhotoAnalysisChange?: (description: string) => void;
  onPhotoEvidenceGapsChange?: (gaps: EvidenceGap[]) => void;
  vehicleContext?: VehicleContext;
}

export default function PhotoUpload({
  onPhotosSelected,
  onPhotoAnalysisChange,
  onPhotoEvidenceGapsChange,
  vehicleContext,
}: PhotoUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDescription, setAnalysisDescription] = useState("");
  const [evidenceGaps, setEvidenceGaps] = useState<EvidenceGap[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const addFilesToState = (files: File[]) => {
    const validFiles = files.filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );
    const newPhotos: PhotoFile[] = validFiles.map((file) => ({
      blob: ExternalBlob.fromBytes(new Uint8Array()),
      filename: file.name,
      contentType: file.type,
      previewUrl: URL.createObjectURL(file),
    }));
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const arrayBuffer = ev.target?.result as ArrayBuffer;
        newPhotos[index].blob = ExternalBlob.fromBytes(
          new Uint8Array(arrayBuffer),
        );
        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);
        onPhotosSelected(
          updatedPhotos.map((p) => ({
            blob: p.blob,
            filename: p.filename,
            contentType: p.contentType,
          })),
        );
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFilesToState(Array.from(e.target.files || []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdditionalPhotos = (files: FileList) => {
    addFilesToState(Array.from(files));
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onPhotosSelected(
      updated.map((p) => ({
        blob: p.blob,
        filename: p.filename,
        contentType: p.contentType,
      })),
    );
  };

  const handleAnalyze = async () => {
    if (photos.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePhotos(
        photos.map((p) => p.blob),
        vehicleContext,
      );
      setAnalysisDescription(result.description);
      setEvidenceGaps(result.evidenceGaps);
      setHasAnalyzed(true);
      onPhotoAnalysisChange?.(result.description);
      onPhotoEvidenceGapsChange?.(result.evidenceGaps);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setAnalysisDescription(value);
    onPhotoAnalysisChange?.(value);
  };

  const evidenceTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      photo: "Photo",
      video: "Video",
      witness_statement: "Witness",
      gps_data: "GPS",
    };
    return map[type] ?? type;
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <button
        type="button"
        className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 transition-colors bg-transparent"
        onClick={() => fileInputRef.current?.click()}
        data-ocid="photo.upload_button"
      >
        <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {t("upload.photos.click")}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </button>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.filename}
              className="relative group rounded-md overflow-hidden aspect-square bg-muted"
              data-ocid={`photo.item.${index + 1}`}
            >
              <img
                src={photo.previewUrl}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                data-ocid={`photo.delete_button.${index + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 truncate">
                {photo.filename}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analyze button */}
      <Button
        type="button"
        variant="outline"
        disabled={photos.length === 0 || isAnalyzing}
        onClick={handleAnalyze}
        className="w-full gap-2"
        data-ocid="photo.primary_button"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("photo.analysing")}
          </>
        ) : hasAnalyzed ? (
          <>
            <RefreshCw className="h-4 w-4" />
            {t("photo.reanalyse")}
          </>
        ) : (
          <>
            <ScanSearch className="h-4 w-4" />
            {t("photo.analyse")}
          </>
        )}
      </Button>

      {/* Loading state */}
      {isAnalyzing && (
        <div
          className="text-sm text-muted-foreground text-center py-2"
          data-ocid="photo.loading_state"
        >
          {t("photo.analysing_with_ai")}
        </div>
      )}

      {/* === POST-ANALYSIS RESULTS === */}
      {hasAnalyzed && (
        <>
          {/* Crash Scenario Diagram */}
          <CrashAnalysisDiagramPanel
            analysisText={analysisDescription}
            onAdditionalPhotos={handleAdditionalPhotos}
          />

          {/* Editable AI description */}
          <div className="space-y-2">
            <label
              htmlFor="photo-analysis-description"
              className="text-sm font-medium text-foreground"
            >
              {t("photo.ai_description_label")}{" "}
              <span className="text-muted-foreground font-normal">
                {t("common.editable")}
              </span>
            </label>
            <Textarea
              id="photo-analysis-description"
              value={analysisDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={5}
              className="text-sm resize-none"
              placeholder={t("photo.placeholder")}
              data-ocid="photo.textarea"
            />
          </div>

          {/* Evidence gaps */}
          {evidenceGaps.length > 0 && (
            <Alert
              variant="default"
              className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20"
              data-ocid="photo.error_state"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700 dark:text-amber-400 text-sm font-semibold">
                {t("photo.evidence_gaps_title")}
              </AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-2">
                  {evidenceGaps.map((gap) => (
                    <li
                      key={gap.description}
                      className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300"
                    >
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs border-amber-500 text-amber-700 dark:text-amber-400"
                      >
                        {evidenceTypeLabel(gap.evidenceType)}
                      </Badge>
                      <span>{gap.description}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {evidenceGaps.length === 0 && (
            <Alert
              className="border-green-500/50 bg-green-50 dark:bg-green-950/20"
              data-ocid="photo.success_state"
            >
              <AlertTitle className="text-green-700 dark:text-green-400 text-sm font-semibold">
                ✓ {t("photo.no_evidence_gaps_title")}
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
                {t("photo.no_evidence_gaps_desc")}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}

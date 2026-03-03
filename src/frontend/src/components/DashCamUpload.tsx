import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, ScanSearch, Video, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { analyzeDashCam } from "../utils/dashCamAnalyzer";

export interface DashCamClip {
  blob: ExternalBlob;
  filename: string;
  contentType: string;
  cameraLabel: string;
  previewUrl: string;
}

interface DashCamUploadProps {
  onChange: (clips: DashCamClip[]) => void;
  onDashCamCrossAnalysisChange?: (description: string) => void;
  photoAnalysisDescription?: string;
}

const CAMERA_LABELS = ["Front", "Rear", "Side Left", "Side Right", "Interior"];

export default function DashCamUpload({
  onChange,
  onDashCamCrossAnalysisChange,
  photoAnalysisDescription,
}: DashCamUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clips, setClips] = useState<DashCamClip[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [crossAnalysisDescription, setCrossAnalysisDescription] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.type.startsWith("video/"));

    const newClips: DashCamClip[] = validFiles.map((file) => ({
      blob: ExternalBlob.fromBytes(new Uint8Array()),
      filename: file.name,
      contentType: file.type,
      cameraLabel: "Front",
      previewUrl: URL.createObjectURL(file),
    }));

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const arrayBuffer = ev.target?.result as ArrayBuffer;
        newClips[index].blob = ExternalBlob.fromBytes(
          new Uint8Array(arrayBuffer),
        );
        const updated = [...clips, ...newClips];
        setClips(updated);
        onChange(updated);
      };
      reader.readAsArrayBuffer(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeClip = (index: number) => {
    const updated = clips.filter((_, i) => i !== index);
    setClips(updated);
    onChange(updated);
  };

  const updateLabel = (index: number, label: string) => {
    const updated = clips.map((c, i) =>
      i === index ? { ...c, cameraLabel: label } : c,
    );
    setClips(updated);
    onChange(updated);
  };

  const handleAnalyze = async () => {
    if (clips.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeDashCam(
        clips.map((c) => c.blob),
        photoAnalysisDescription,
      );
      setCrossAnalysisDescription(result.crossAnalysisDescription);
      setHasAnalyzed(true);
      onDashCamCrossAnalysisChange?.(result.crossAnalysisDescription);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setCrossAnalysisDescription(value);
    onDashCamCrossAnalysisChange?.(value);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <button
        type="button"
        className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 transition-colors bg-transparent"
        onClick={() => fileInputRef.current?.click()}
      >
        <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Click to upload dash cam footage (MP4, MOV, AVI)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </button>

      {/* Clip list */}
      {clips.length > 0 && (
        <div className="space-y-3">
          {clips.map((clip, index) => (
            <div
              key={clip.filename}
              className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border"
            >
              <video
                src={clip.previewUrl}
                className="w-20 h-14 object-cover rounded"
                muted
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{clip.filename}</p>
                <Select
                  value={clip.cameraLabel}
                  onValueChange={(v) => updateLabel(index, v)}
                >
                  <SelectTrigger className="h-7 text-xs mt-1 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMERA_LABELS.map((label) => (
                      <SelectItem key={label} value={label} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="button"
                onClick={() => removeClip(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analyze button */}
      <Button
        type="button"
        variant="outline"
        disabled={clips.length === 0 || isAnalyzing}
        onClick={handleAnalyze}
        className="w-full gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analysing Dash Cam…
          </>
        ) : hasAnalyzed ? (
          <>
            <RefreshCw className="h-4 w-4" />
            Re-analyse Dash Cam
          </>
        ) : (
          <>
            <ScanSearch className="h-4 w-4" />
            Analyse Dash Cam
          </>
        )}
      </Button>

      {/* Editable cross-analysis description */}
      {hasAnalyzed && (
        <div className="space-y-2">
          <label
            htmlFor="dashcam-cross-analysis"
            className="text-sm font-medium text-foreground"
          >
            AI Dash Cam Cross-Analysis{" "}
            <span className="text-muted-foreground font-normal">
              (editable)
            </span>
          </label>
          <Textarea
            id="dashcam-cross-analysis"
            value={crossAnalysisDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={5}
            className="text-sm resize-none"
            placeholder="AI-generated cross-analysis will appear here…"
          />
          {photoAnalysisDescription && (
            <p className="text-xs text-muted-foreground">
              ✓ Cross-referenced with photo analysis
            </p>
          )}
        </div>
      )}
    </div>
  );
}

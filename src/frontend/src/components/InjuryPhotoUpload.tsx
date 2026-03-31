import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";

interface InjuryPhotoUploadProps {
  onPhotosSelected: (blobs: ExternalBlob[], files: File[]) => void;
  label?: string;
}

export default function InjuryPhotoUpload({
  onPhotosSelected,
  label,
}: InjuryPhotoUploadProps) {
  const { t } = useLanguage();
  const displayLabel = label ?? t("upload.add_more");
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildBlobs = async (files: File[]): Promise<ExternalBlob[]> => {
    return Promise.all(
      files.map(async (f) => {
        const ab = await f.arrayBuffer();
        return ExternalBlob.fromBytes(new Uint8Array(ab));
      }),
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((f) => URL.createObjectURL(f));

    const allFiles = [...selectedFiles, ...files];
    const allPreviews = [...previews, ...newPreviews];
    const allBlobs = await buildBlobs(allFiles);

    setPreviews(allPreviews);
    setSelectedFiles(allFiles);
    onPhotosSelected(allBlobs, allFiles);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newBlobs = await buildBlobs(newFiles);

    setPreviews(newPreviews);
    setSelectedFiles(newFiles);
    onPhotosSelected(newBlobs, newFiles);
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {previews.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
          data-ocid="injury.upload_button"
        >
          <Image className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{displayLabel}</p>
          <p className="text-xs text-muted-foreground">
            {t("upload.formats.photo")}
          </p>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <div key={src} className="relative group aspect-square">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover rounded-md border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            data-ocid="injury.secondary_button"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t("upload.add_more")}
          </Button>
        </div>
      )}
    </div>
  );
}

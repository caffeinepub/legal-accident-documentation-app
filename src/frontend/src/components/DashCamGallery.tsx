import type { ExternalBlob } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Camera, Play, Video } from "lucide-react";
import React, { useState } from "react";

interface DashCamGalleryProps {
  footage: ExternalBlob[];
  labels?: string[];
}

export default function DashCamGallery({
  footage,
  labels = [],
}: DashCamGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!footage || footage.length === 0) return null;

  const getLabel = (index: number) => {
    const defaultLabels = [
      "Front Camera",
      "Rear Camera",
      "Left Side Camera",
      "Right Side Camera",
      "Interior Camera",
    ];
    return labels[index] || defaultLabels[index % defaultLabels.length];
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {footage.map((clip, index) => {
          const url = clip.getDirectURL();
          const label = getLabel(index);
          const isActive = activeIndex === index;

          return (
            <div
              key={label}
              className="rounded-xl overflow-hidden border border-dashcam-border bg-dashcam-surface"
            >
              {/* Label bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-dashcam-header border-b border-dashcam-border">
                <Camera
                  size={13}
                  className="text-dashcam-accent flex-shrink-0"
                />
                <span className="text-xs font-medium text-dashcam-header-fg truncate">
                  {label}
                </span>
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] h-5 border-dashcam-border text-dashcam-accent"
                >
                  Clip {index + 1}
                </Badge>
              </div>

              {/* Video player */}
              <div className="relative bg-black aspect-video">
                {isActive ? (
                  <video
                    src={url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <button
                    type="button"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer group bg-transparent border-0"
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                    <p className="text-white/60 text-xs mt-2">Click to play</p>
                    <Video size={14} className="text-white/30 mt-1" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

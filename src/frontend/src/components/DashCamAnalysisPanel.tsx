import type { DashCamAnalysis } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CloudRain,
  Gauge,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";

interface DashCamAnalysisPanelProps {
  analysis: DashCamAnalysis | null | undefined;
  hasFootage: boolean;
  isAnalysing?: boolean;
  onAnalyse?: () => void;
}

function formatTimestamp(ts: bigint): string {
  // Convert nanoseconds to milliseconds
  const ms = Number(ts / BigInt(1_000_000));
  if (ms > 1_000_000_000_000) {
    return new Date(ms).toLocaleTimeString();
  }
  // Relative offset in seconds
  return `T+${(Number(ts) / 1_000_000_000).toFixed(1)}s`;
}

function speedMsToMph(speedMs: bigint): string {
  const mph = Number(speedMs) * 2.23694;
  return `${mph.toFixed(1)} mph (${Number(speedMs)} m/s)`;
}

export default function DashCamAnalysisPanel({
  analysis,
  hasFootage,
  isAnalysing = false,
  onAnalyse,
}: DashCamAnalysisPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-xl border border-dashcam-border overflow-hidden">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 bg-dashcam-header hover:bg-dashcam-header/90 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-dashcam-accent" />
              <span className="font-semibold text-sm text-dashcam-header-fg">
                Dash Cam Analysis
              </span>
              {analysis && (
                <Badge
                  variant={
                    analysis.collisionDetected ? "destructive" : "secondary"
                  }
                  className="text-[10px] h-5"
                >
                  {analysis.collisionDetected
                    ? "Collision Detected"
                    : "No Collision"}
                </Badge>
              )}
              {!analysis && hasFootage && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 border-dashcam-border text-dashcam-accent"
                >
                  Pending Analysis
                </Badge>
              )}
            </div>
            {isOpen ? (
              <ChevronUp size={16} className="text-dashcam-header-fg/70" />
            ) : (
              <ChevronDown size={16} className="text-dashcam-header-fg/70" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-4 bg-card">
            {/* Analyse button */}
            {hasFootage && !analysis && onAnalyse && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-dashcam-surface border border-dashcam-border">
                <AlertCircle
                  size={16}
                  className="text-dashcam-accent flex-shrink-0"
                />
                <p className="text-sm text-muted-foreground flex-1">
                  Dash cam footage is available. Run AI analysis to extract
                  crash insights.
                </p>
                <Button
                  size="sm"
                  onClick={onAnalyse}
                  disabled={isAnalysing}
                  className="bg-dashcam-accent text-white hover:bg-dashcam-accent/90 flex-shrink-0"
                >
                  {isAnalysing ? (
                    <>
                      <Loader2 size={13} className="mr-1.5 animate-spin" />
                      Analysing…
                    </>
                  ) : (
                    <>
                      <Camera size={13} className="mr-1.5" />
                      Analyse Dash Cam
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* No footage */}
            {!hasFootage && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No dash cam footage uploaded for this report.
              </p>
            )}

            {/* Analysis results */}
            {analysis && (
              <div className="space-y-3">
                {/* Collision Detection */}
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                  <div
                    className={`mt-0.5 flex-shrink-0 ${analysis.collisionDetected ? "text-destructive" : "text-green-600"}`}
                  >
                    {analysis.collisionDetected ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-0.5">
                      Collision / Impact Detection
                    </p>
                    <p className="text-sm text-foreground">
                      {analysis.collisionDetected
                        ? "Collision event detected in footage"
                        : "No collision detected"}
                    </p>
                  </div>
                </div>

                {/* Vehicle Speed */}
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                  <Gauge
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-blue-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-0.5">
                      Vehicle Speed &amp; Movement
                    </p>
                    <p className="text-sm text-foreground">
                      {analysis.vehicleSpeed !== undefined &&
                      analysis.vehicleSpeed !== null
                        ? speedMsToMph(analysis.vehicleSpeed)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                  <Clock
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-purple-500"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">
                      Timestamps
                    </p>
                    {analysis.timestamps && analysis.timestamps.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.timestamps.map((ts) => (
                          <Badge
                            key={String(ts)}
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {formatTimestamp(ts)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No timestamps recorded
                      </p>
                    )}
                  </div>
                </div>

                {/* Road Conditions */}
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                  <CloudRain
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-sky-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-0.5">
                      Road Conditions
                    </p>
                    <p className="text-sm text-foreground">
                      {analysis.roadConditions || "Not detected"}
                    </p>
                  </div>
                </div>

                {/* Fault Indicators */}
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                  <AlertTriangle
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-amber-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-0.5">
                      Fault Indicators
                    </p>
                    <p className="text-sm text-foreground">
                      {analysis.faultIndicators ||
                        "No fault indicators identified"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Re-analyse button when analysis already exists */}
            {analysis && hasFootage && onAnalyse && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAnalyse}
                disabled={isAnalysing}
                className="w-full text-xs"
              >
                {isAnalysing ? (
                  <>
                    <Loader2 size={12} className="mr-1.5 animate-spin" />
                    Re-analysing…
                  </>
                ) : (
                  <>
                    <Camera size={12} className="mr-1.5" />
                    Re-analyse Footage
                  </>
                )}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

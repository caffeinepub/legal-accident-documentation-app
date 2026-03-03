import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { TrafficSignalState } from "../backend";

interface DiscrepancyAlertProps {
  trafficSignalState: TrafficSignalState;
  isRedLightViolation: boolean;
}

export default function DiscrepancyAlert({
  trafficSignalState,
  isRedLightViolation,
}: DiscrepancyAlertProps) {
  // Check if there's a discrepancy between testimony and detected state
  const hasDiscrepancy = isRedLightViolation;

  if (!hasDiscrepancy) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-2">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">
        Traffic Light Discrepancy Detected
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">
          A discrepancy has been identified between the witness testimony and
          the AI-detected traffic signal state from the accident photos.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="p-3 bg-background rounded-lg border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Witness Testimony
            </p>
            <Badge className="bg-[oklch(0.7_0.15_145)] text-white capitalize">
              {trafficSignalState.witnessTestimony}
            </Badge>
          </div>

          <div className="p-3 bg-background rounded-lg border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              AI-Detected State
            </p>
            <Badge variant="destructive" className="capitalize">
              {trafficSignalState.color}
            </Badge>
          </div>
        </div>

        <div className="mt-3 p-3 bg-background rounded-lg border border-border">
          <p className="text-xs font-semibold text-foreground mb-1">
            Adjuster Action Required
          </p>
          <p className="text-xs text-muted-foreground">
            This discrepancy requires manual review. Please examine the accident
            photos carefully and cross-reference with witness statements to
            determine the accurate traffic signal state at the time of the
            accident.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}

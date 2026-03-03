import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Scale } from "lucide-react";

interface LiabilityDisplayProps {
  party1Liability?: bigint;
  party2Liability?: bigint;
}

export default function LiabilityDisplay({
  party1Liability,
  party2Liability,
}: LiabilityDisplayProps) {
  // Check if liability data is available
  if (party1Liability === undefined || party2Liability === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Liability Assessment
          </CardTitle>
          <CardDescription>
            Fault determination analysis pending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">Liability analysis is being calculated...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const party1Percent = Number(party1Liability);
  const party2Percent = Number(party2Liability);

  // Determine color intensity based on liability percentage
  const getColorClass = (percent: number) => {
    if (percent >= 70) {
      return "bg-destructive"; // High liability - red
    }
    if (percent >= 50) {
      return "bg-[oklch(0.65_0.2_30)]"; // Medium liability - orange
    }
    return "bg-[oklch(0.7_0.15_145)]"; // Low liability - green
  };

  const getTextColorClass = (percent: number) => {
    if (percent >= 70) {
      return "text-destructive";
    }
    if (percent >= 50) {
      return "text-[oklch(0.65_0.2_30)]";
    }
    return "text-[oklch(0.7_0.15_145)]";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Liability Assessment
        </CardTitle>
        <CardDescription>
          Fault determination based on detected violations and evidence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual bar representation */}
        <div className="space-y-2">
          <div className="flex h-12 rounded-lg overflow-hidden border border-border">
            {party1Percent > 0 && (
              <div
                className={`${getColorClass(party1Percent)} flex items-center justify-center text-white font-semibold text-sm transition-all`}
                style={{ width: `${party1Percent}%` }}
              >
                {party1Percent}%
              </div>
            )}
            {party2Percent > 0 && (
              <div
                className={`${getColorClass(party2Percent)} flex items-center justify-center text-white font-semibold text-sm transition-all`}
                style={{ width: `${party2Percent}%` }}
              >
                {party2Percent}%
              </div>
            )}
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Party 1 Liability
            </p>
            <p
              className={`text-3xl font-bold ${getTextColorClass(party1Percent)}`}
            >
              {party1Percent}%
            </p>
            <p className="text-xs text-muted-foreground">
              {party1Percent >= 70
                ? "Primary fault"
                : party1Percent >= 50
                  ? "Shared fault"
                  : "Minor fault"}
            </p>
          </div>
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Party 2 Liability
            </p>
            <p
              className={`text-3xl font-bold ${getTextColorClass(party2Percent)}`}
            >
              {party2Percent}%
            </p>
            <p className="text-xs text-muted-foreground">
              {party2Percent >= 70
                ? "Primary fault"
                : party2Percent >= 50
                  ? "Shared fault"
                  : "Minor fault"}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Liability percentages are calculated based on
            detected traffic violations, road conditions, and evidence analysis.
            Higher percentages indicate greater responsibility for the incident.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

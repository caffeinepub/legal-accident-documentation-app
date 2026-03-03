import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  StopCircle,
  TrafficCone,
} from "lucide-react";
import type { Violation } from "../backend";

interface ViolationsDisplayProps {
  violations: Violation[];
}

export default function ViolationsDisplay({
  violations,
}: ViolationsDisplayProps) {
  if (!violations || violations.length === 0) {
    return (
      <Card className="border-[oklch(0.7_0.15_145)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[oklch(0.7_0.15_145)]">
            <CheckCircle className="h-5 w-5" />
            Traffic Violations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-[oklch(0.7_0.15_145)]">
            <CheckCircle className="h-4 w-4" />
            <p className="text-sm font-medium">No violations detected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getViolationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "stop sign":
        return <StopCircle className="h-4 w-4" />;
      case "u-turn":
        return <RotateCcw className="h-4 w-4" />;
      case "traffic signal":
        return <TrafficCone className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Traffic Violations Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {violations.map((violation) => {
            const date = new Date(Number(violation.detectedAt));
            const key = `${violation.violationType}-${violation.detectedAt}`;
            return (
              <div
                key={key}
                className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    {getViolationIcon(violation.violationType)}
                    {violation.violationType}
                  </Badge>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {violation.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Detected at {date.toLocaleTimeString()} on{" "}
                    {date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

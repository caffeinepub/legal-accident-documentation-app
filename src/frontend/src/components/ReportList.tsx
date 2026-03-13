import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Car,
  ChevronRight,
  FileText,
  Hash,
  Plus,
} from "lucide-react";
import React from "react";
import { useGetAllReports } from "../hooks/useQueries";
import { formatClaimId } from "../utils/claimId";

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp)).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportList() {
  const navigate = useNavigate();
  const { data: reports, isLoading, error } = useGetAllReports();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Failed to load reports. Please try again.</p>
      </div>
    );
  }

  const sorted = [...(reports ?? [])].sort(
    (a, b) => Number(b[1].timestamp) - Number(a[1].timestamp),
  );

  if (sorted.length === 0) {
    return (
      <div
        className="text-center py-16 space-y-4"
        data-ocid="reports.empty_state"
      >
        <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
        <div>
          <p className="text-lg font-semibold">No reports found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Create your first report to get started.
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/" })} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map(([id, report], idx) => (
        <Card
          key={id.toString()}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() =>
            navigate({
              to: "/reports/$reportId",
              params: { reportId: id.toString() },
            })
          }
          data-ocid={`reports.item.${idx + 1}`}
        >
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Thumbnail or placeholder */}
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {report.imageData && report.imageData.length > 0 ? (
                  <ReportThumbnail imageData={report.imageData[0]} />
                ) : (
                  <FileText className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">
                    Report #{id.toString()}
                  </span>
                  {/* Claim ID badge */}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-muted-foreground">
                    <Hash className="w-2.5 h-2.5" />
                    {formatClaimId(id, report.timestamp)}
                  </span>
                  <Badge
                    variant={report.isAtFault ? "destructive" : "default"}
                    className="text-xs"
                  >
                    {report.isAtFault ? "At Fault" : "Not At Fault"}
                  </Badge>
                  {report.violations && report.violations.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {report.violations.length} violation
                      {report.violations.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(report.timestamp)}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                  <Car className="w-3 h-3 shrink-0" />
                  {report.vehicleInfo.colour} {report.vehicleInfo.make}{" "}
                  {report.vehicleInfo.model} · {report.vehicleInfo.licencePlate}
                </p>

                {report.party1Liability !== undefined &&
                  report.party2Liability !== undefined && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Liability: Party 1 — {Number(report.party1Liability)}% /
                      Party 2 — {Number(report.party2Liability)}%
                    </p>
                  )}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReportThumbnail({ imageData }: { imageData: Uint8Array }) {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const blob = new Blob([new Uint8Array(imageData)], { type: "image/jpeg" });
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageData]);

  if (!url) return <FileText className="w-6 h-6 text-muted-foreground" />;
  return (
    <img
      src={url}
      alt="Report thumbnail"
      className="w-full h-full object-cover"
    />
  );
}

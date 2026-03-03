import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import React from "react";
import ReportDetail from "../components/ReportDetail";
import { useGetReport } from "../hooks/useQueries";

export default function ReportDetailPage() {
  const { reportId } = useParams({ from: "/reports/$reportId" });
  const reportIdBigInt = BigInt(reportId);
  const { data: report, isLoading, error } = useGetReport(reportIdBigInt);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 space-y-3">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <p className="text-lg font-semibold">Report not found</p>
        <p className="text-muted-foreground text-sm">
          This report may have been deleted or you may not have permission to
          view it.
        </p>
      </div>
    );
  }

  return <ReportDetail reportId={reportIdBigInt} report={report} />;
}

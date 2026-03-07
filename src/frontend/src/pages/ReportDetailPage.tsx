import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { AlertCircle, Printer } from "lucide-react";
import React from "react";
import ReportDetail from "../components/ReportDetail";
import { useGetReport } from "../hooks/useQueries";

function PrintStyles() {
  return (
    <style>{`
      @media print {
        /* Hide navigation, header, footer, buttons */
        [data-print-hide],
        header,
        footer,
        nav {
          display: none !important;
        }

        /* Clean layout */
        body {
          background: white !important;
          color: black !important;
          font-size: 12pt;
          line-height: 1.5;
        }

        /* Remove shadows and backgrounds */
        .shadow,
        .shadow-sm,
        .shadow-md,
        .shadow-lg,
        [class*="shadow"] {
          box-shadow: none !important;
        }

        /* Force cards to white background */
        [class*="card"],
        [class*="Card"] {
          background: white !important;
          border: 1px solid #ccc !important;
        }

        /* Single column, full width */
        .max-w-3xl {
          max-width: 100% !important;
        }

        /* Expand all collapsible panels */
        [data-state="closed"] > [data-radix-collapsible-content] {
          display: block !important;
          height: auto !important;
        }

        /* Page breaks before major sections */
        .print-break-before {
          break-before: page;
          page-break-before: always;
        }

        /* Ensure text is black */
        * {
          color: black !important;
        }

        /* Page margins */
        @page {
          margin: 1.5cm;
        }
      }
    `}</style>
  );
}

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

  return (
    <>
      <PrintStyles />
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Download PDF button */}
        <div className="flex justify-end" data-print-hide>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.print()}
            data-ocid="report.secondary_button"
            data-print-hide
          >
            <Printer className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        <ReportDetail reportId={reportIdBigInt} report={report} />
      </div>
    </>
  );
}

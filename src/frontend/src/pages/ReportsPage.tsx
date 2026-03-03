import React from "react";
import ReportList from "../components/ReportList";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all your saved accident reports.
        </p>
      </div>
      <ReportList />
    </div>
  );
}

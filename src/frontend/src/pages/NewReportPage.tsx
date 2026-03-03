import React from "react";
import AccidentReportForm from "../components/AccidentReportForm";

export default function NewReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Accident Report</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details below to create a new accident report.
        </p>
      </div>
      <AccidentReportForm />
    </div>
  );
}

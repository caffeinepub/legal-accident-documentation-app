import { AlertTriangle, FileText, Scale, Shield, X } from "lucide-react";
import React, { useState } from "react";
import AccidentReportForm from "../components/AccidentReportForm";

export default function NewReportPage() {
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false);

  return (
    <div>
      {/* Legal Disclaimer Banner */}
      {!disclaimerDismissed && (
        <div
          className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800"
          data-ocid="disclaimer.panel"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
          <p className="text-sm leading-relaxed flex-1">
            <span className="font-semibold">Important Notice: </span>
            This application and its outputs do not constitute legal advice. All
            content is provided for informational and insurance documentation
            purposes only. You should seek independent legal advice from a
            qualified solicitor before taking any legal action.
          </p>
          <button
            type="button"
            onClick={() => setDisclaimerDismissed(true)}
            className="shrink-0 ml-1 text-amber-600 hover:text-amber-800 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Dismiss disclaimer"
            data-ocid="disclaimer.close_button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-7 rounded-xl border border-border bg-gradient-to-br from-card via-card to-background px-6 py-5 shadow-sm">
        <h1
          className="text-3xl font-bold tracking-tight text-foreground mb-1"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          iamthe.law
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          AI-powered accident documentation for UK roads
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <Scale className="w-3 h-3" />
            AI Fault Analysis
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <FileText className="w-3 h-3" />
            Formal Demand Letters
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <Shield className="w-3 h-3" />
            Insurer-Ready Reports
          </span>
        </div>
      </div>

      <AccidentReportForm />
    </div>
  );
}

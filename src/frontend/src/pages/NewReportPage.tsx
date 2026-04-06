import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crown,
  FileText,
  Scale,
  Shield,
  X,
} from "lucide-react";
import React, { useState } from "react";
import AccidentReportForm from "../components/AccidentReportForm";
import PaywallModal from "../components/PaywallModal";
import { useCountry } from "../contexts/CountryContext";
import { useLanguage } from "../contexts/LanguageContext";
import { usePlan } from "../hooks/usePlan";

const REPORT_COUNT_KEY_PREFIX = "iamthelaw_report_count_";

function getCurrentMonthReportCount(): number {
  const now = new Date();
  const key = `${REPORT_COUNT_KEY_PREFIX}${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}`;
  return Number.parseInt(localStorage.getItem(key) ?? "0", 10);
}

export function incrementReportCount() {
  const now = new Date();
  const key = `${REPORT_COUNT_KEY_PREFIX}${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}`;
  const current = Number.parseInt(localStorage.getItem(key) ?? "0", 10);
  localStorage.setItem(key, String(current + 1));
}

export default function NewReportPage() {
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => !!localStorage.getItem("iatl_onboarded"),
  );
  const [showReportLimitPaywall, setShowReportLimitPaywall] = useState(false);
  const { country } = useCountry();
  const { t } = useLanguage();
  const { isPro } = usePlan();
  const navigate = useNavigate();
  const isMalta = country === "mt";

  const reportCount = getCurrentMonthReportCount();
  const atReportLimit = !isPro && reportCount >= 3;

  const dismissOnboarding = () => {
    localStorage.setItem("iatl_onboarded", "1");
    setOnboardingDismissed(true);
  };

  return (
    <div>
      {/* Onboarding Banner */}
      {!onboardingDismissed && (
        <div
          className="mb-5 rounded-xl border border-border bg-card shadow-sm px-5 py-4"
          data-ocid="onboarding.panel"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                {t("onboarding.title")}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("onboarding.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissOnboarding}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Dismiss welcome banner"
              data-ocid="onboarding.close_button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <Camera className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-xs text-foreground leading-relaxed">
                {t("onboarding.tip1")}
              </span>
            </div>
            <div className="flex-1 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-xs text-foreground leading-relaxed">
                {t("onboarding.tip2")}
              </span>
            </div>
            <div className="flex-1 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-xs text-foreground leading-relaxed">
                {t("onboarding.tip3")}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissOnboarding}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-ocid="onboarding.close_button"
          >
            {t("onboarding.got_it")}
          </button>
        </div>
      )}

      {/* Legal Disclaimer Banner */}
      {!disclaimerDismissed && (
        <div
          className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800"
          data-ocid="disclaimer.panel"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
          <p className="text-sm leading-relaxed flex-1">
            <span className="font-semibold">{t("notice.title")}: </span>
            {isMalta ? t("notice.body_malta") : t("notice.body")}
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
          {isMalta
            ? "AI-powered accident documentation for Maltese roads"
            : "AI-powered accident documentation for UK roads"}
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

      {/* Report limit banner for free users */}
      {!isPro && (
        <div
          className="mb-4 rounded-lg px-4 py-3 flex items-center justify-between gap-3 flex-wrap text-xs"
          style={{
            background: "oklch(0.97 0.03 230)",
            border: "1px solid oklch(0.85 0.08 230)",
            color: "oklch(0.40 0.12 230)",
          }}
          data-ocid="new_report.free_tier.panel"
        >
          <span>
            <strong>{reportCount}/3 free reports</strong> used this month.
            {atReportLimit
              ? " Upgrade to Pro for unlimited reports."
              : " Free tier allows 3 reports/month."}
          </span>
          <button
            type="button"
            onClick={() => navigate({ to: "/pricing" })}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-opacity hover:opacity-80"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 80) 0%, oklch(0.68 0.20 55) 100%)",
              color: "oklch(0.15 0.05 60)",
            }}
            data-ocid="new_report.upgrade.button"
          >
            <Crown className="w-3 h-3" />
            Upgrade
          </button>
        </div>
      )}

      {atReportLimit ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: "oklch(0.85 0.14 75)",
            background: "oklch(0.97 0.05 85)",
          }}
          data-ocid="new_report.limit.panel"
        >
          <Crown
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "oklch(0.55 0.18 65)" }}
          />
          <h3
            className="font-bold text-lg mb-2"
            style={{ color: "oklch(0.35 0.12 60)" }}
          >
            Monthly report limit reached
          </h3>
          <p className="text-sm mb-4" style={{ color: "oklch(0.45 0.10 65)" }}>
            You've used all 3 free reports for this month. Upgrade to Pro for
            unlimited reports.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/pricing" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.18 80) 0%, oklch(0.68 0.20 55) 100%)",
              color: "oklch(0.15 0.05 60)",
            }}
            data-ocid="new_report.upgrade.primary_button"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro — £9.99/month
          </button>
        </div>
      ) : (
        <AccidentReportForm />
      )}

      <PaywallModal
        isOpen={showReportLimitPaywall}
        onClose={() => setShowReportLimitPaywall(false)}
        featureName="More than 3 reports per month"
      />
    </div>
  );
}

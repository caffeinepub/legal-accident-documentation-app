import React from "react";
import ReportList from "../components/ReportList";
import { useLanguage } from "../contexts/LanguageContext";

export default function ReportsPage() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("page.reports.heading")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("page.reports.subheading")}
        </p>
      </div>
      <ReportList />
    </div>
  );
}

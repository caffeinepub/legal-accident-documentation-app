export type Language = "en" | "es" | "pl";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
];

export type TranslationKey =
  // Nav
  | "nav.new_report"
  | "nav.my_reports"
  | "nav.fault_reference"
  | "nav.legal_outputs"
  | "nav.grid_view"
  | "nav.insurers"
  | "nav.fleet"
  // Common actions
  | "action.save"
  | "action.submit"
  | "action.cancel"
  | "action.delete"
  | "action.export"
  | "action.add"
  | "action.generate"
  | "action.analyse"
  | "action.confirm"
  | "action.close"
  | "action.copy"
  | "action.print"
  // Page headings
  | "page.new_report.heading"
  | "page.new_report.subheading"
  | "page.reports.heading"
  | "page.reports.subheading"
  | "page.privacy.heading"
  | "page.privacy.subheading"
  // Status labels
  | "status.draft"
  | "status.submitted"
  | "status.under_review"
  | "status.settled"
  | "status.label"
  // Footer
  | "footer.built_with"
  | "footer.privacy_policy"
  | "footer.data_privacy"
  // Legal disclaimer
  | "disclaimer.text"
  | "disclaimer.title"
  // GDPR panel
  | "gdpr.title"
  | "gdpr.description"
  | "gdpr.delete_evidence"
  | "gdpr.delete_report"
  | "gdpr.delete_evidence_confirm"
  | "gdpr.delete_report_confirm"
  | "gdpr.data_stored_locally"
  // Privacy policy sections
  | "privacy.intro"
  | "privacy.data_collected"
  | "privacy.how_used"
  | "privacy.retention"
  | "privacy.your_rights"
  | "privacy.cookies"
  | "privacy.contact"
  | "privacy.updates"
  // Reports list
  | "reports.empty.title"
  | "reports.empty.description"
  | "reports.create_first";

type Translations = Record<Language, Record<TranslationKey, string>>;

const translations: Translations = {
  en: {
    "nav.new_report": "New Report",
    "nav.my_reports": "My Reports",
    "nav.fault_reference": "Fault Reference",
    "nav.legal_outputs": "Legal Outputs",
    "nav.grid_view": "Grid View",
    "nav.insurers": "Insurers",
    "nav.fleet": "Fleet",
    "action.save": "Save",
    "action.submit": "Submit",
    "action.cancel": "Cancel",
    "action.delete": "Delete",
    "action.export": "Export",
    "action.add": "Add",
    "action.generate": "Generate",
    "action.analyse": "Analyse",
    "action.confirm": "Confirm",
    "action.close": "Close",
    "action.copy": "Copy",
    "action.print": "Print",
    "page.new_report.heading": "New Accident Report",
    "page.new_report.subheading":
      "Document your incident with AI-powered analysis",
    "page.reports.heading": "My Reports",
    "page.reports.subheading":
      "View and manage all your saved accident reports.",
    "page.privacy.heading": "Privacy Policy",
    "page.privacy.subheading": "How iamthe.law handles your data",
    "status.draft": "Draft",
    "status.submitted": "Submitted",
    "status.under_review": "Under Review",
    "status.settled": "Settled",
    "status.label": "Claim Status",
    "footer.built_with": "Built with",
    "footer.privacy_policy": "Privacy Policy",
    "footer.data_privacy": "Data & Privacy",
    "disclaimer.title": "Legal Disclaimer",
    "disclaimer.text":
      "iamthe.law is an AI-assisted documentation tool. The information provided does not constitute legal advice. Always consult a qualified solicitor for legal guidance.",
    "gdpr.title": "Data & Privacy",
    "gdpr.description":
      "Your report data is stored locally in your browser. No data is transmitted to third parties without your explicit consent.",
    "gdpr.delete_evidence": "Delete Evidence Files",
    "gdpr.delete_report": "Delete Entire Report",
    "gdpr.delete_evidence_confirm":
      "This will permanently delete all photos and dash cam files for this report. The report metadata will be retained. Are you sure?",
    "gdpr.delete_report_confirm":
      "This will permanently delete the entire report from local storage. This action cannot be undone. Are you sure?",
    "gdpr.data_stored_locally":
      "All report data, including photos, videos, and personal details, is stored exclusively in your browser's local storage. It is not uploaded to any external server.",
    "privacy.intro": "Introduction",
    "privacy.data_collected": "Data We Collect",
    "privacy.how_used": "How Your Data Is Used",
    "privacy.retention": "Data Retention",
    "privacy.your_rights": "Your Rights",
    "privacy.cookies": "Cookies",
    "privacy.contact": "Contact Us",
    "privacy.updates": "Policy Updates",
    "reports.empty.title": "No reports found",
    "reports.empty.description": "Create your first report to get started.",
    "reports.create_first": "Create Report",
  },

  es: {
    "nav.new_report": "Nuevo Informe",
    "nav.my_reports": "Mis Informes",
    "nav.fault_reference": "Referencia de Culpa",
    "nav.legal_outputs": "Resultados Legales",
    "nav.grid_view": "Vista de Cuadrícula",
    "nav.insurers": "Aseguradoras",
    "nav.fleet": "Flota",
    "action.save": "Guardar",
    "action.submit": "Enviar",
    "action.cancel": "Cancelar",
    "action.delete": "Eliminar",
    "action.export": "Exportar",
    "action.add": "Agregar",
    "action.generate": "Generar",
    "action.analyse": "Analizar",
    "action.confirm": "Confirmar",
    "action.close": "Cerrar",
    "action.copy": "Copiar",
    "action.print": "Imprimir",
    "page.new_report.heading": "Nuevo Informe de Accidente",
    "page.new_report.subheading":
      "Documente su incidente con análisis impulsado por IA",
    "page.reports.heading": "Mis Informes",
    "page.reports.subheading":
      "Ver y gestionar todos sus informes de accidentes guardados.",
    "page.privacy.heading": "Política de Privacidad",
    "page.privacy.subheading": "Cómo iamthe.law gestiona sus datos",
    "status.draft": "Borrador",
    "status.submitted": "Enviado",
    "status.under_review": "En Revisión",
    "status.settled": "Resuelto",
    "status.label": "Estado del Reclamo",
    "footer.built_with": "Creado con",
    "footer.privacy_policy": "Política de Privacidad",
    "footer.data_privacy": "Datos y Privacidad",
    "disclaimer.title": "Aviso Legal",
    "disclaimer.text":
      "iamthe.law es una herramienta de documentación asistida por IA. La información proporcionada no constituye asesoramiento legal. Consulte siempre a un abogado cualificado.",
    "gdpr.title": "Datos y Privacidad",
    "gdpr.description":
      "Los datos de su informe se almacenan localmente en su navegador. No se transmiten datos a terceros sin su consentimiento explícito.",
    "gdpr.delete_evidence": "Eliminar Archivos de Evidencia",
    "gdpr.delete_report": "Eliminar Informe Completo",
    "gdpr.delete_evidence_confirm":
      "Esto eliminará permanentemente todas las fotos y archivos de la cámara para este informe. Los metadatos del informe se conservarán. ¿Está seguro?",
    "gdpr.delete_report_confirm":
      "Esto eliminará permanentemente el informe completo del almacenamiento local. Esta acción no se puede deshacer. ¿Está seguro?",
    "gdpr.data_stored_locally":
      "Todos los datos del informe, incluidas fotos, vídeos y datos personales, se almacenan exclusivamente en el almacenamiento local de su navegador.",
    "privacy.intro": "Introducción",
    "privacy.data_collected": "Datos que Recopilamos",
    "privacy.how_used": "Cómo se Usan sus Datos",
    "privacy.retention": "Retención de Datos",
    "privacy.your_rights": "Sus Derechos",
    "privacy.cookies": "Cookies",
    "privacy.contact": "Contáctenos",
    "privacy.updates": "Actualizaciones de la Política",
    "reports.empty.title": "No se encontraron informes",
    "reports.empty.description": "Cree su primer informe para comenzar.",
    "reports.create_first": "Crear Informe",
  },

  pl: {
    "nav.new_report": "Nowy Raport",
    "nav.my_reports": "Moje Raporty",
    "nav.fault_reference": "Odniesienie do Winy",
    "nav.legal_outputs": "Wyniki Prawne",
    "nav.grid_view": "Widok Siatki",
    "nav.insurers": "Ubezpieczyciele",
    "nav.fleet": "Flota",
    "action.save": "Zapisz",
    "action.submit": "Prześlij",
    "action.cancel": "Anuluj",
    "action.delete": "Usuń",
    "action.export": "Eksportuj",
    "action.add": "Dodaj",
    "action.generate": "Generuj",
    "action.analyse": "Analizuj",
    "action.confirm": "Potwierdź",
    "action.close": "Zamknij",
    "action.copy": "Kopiuj",
    "action.print": "Drukuj",
    "page.new_report.heading": "Nowy Raport Wypadku",
    "page.new_report.subheading":
      "Dokumentuj swoje zdarzenie z analizą wspieraną przez AI",
    "page.reports.heading": "Moje Raporty",
    "page.reports.subheading":
      "Przeglądaj i zarządzaj wszystkimi zapisanymi raportami wypadków.",
    "page.privacy.heading": "Polityka Prywatności",
    "page.privacy.subheading": "Jak iamthe.law obsługuje Twoje dane",
    "status.draft": "Wersja Robocza",
    "status.submitted": "Przesłany",
    "status.under_review": "W Trakcie Przeglądu",
    "status.settled": "Rozliczony",
    "status.label": "Status Roszczenia",
    "footer.built_with": "Zbudowano z",
    "footer.privacy_policy": "Polityka Prywatności",
    "footer.data_privacy": "Dane i Prywatność",
    "disclaimer.title": "Zastrzeżenie Prawne",
    "disclaimer.text":
      "iamthe.law to narzędzie dokumentacyjne wspomagane przez AI. Podane informacje nie stanowią porady prawnej. Zawsze konsultuj się z wykwalifikowanym prawnikiem.",
    "gdpr.title": "Dane i Prywatność",
    "gdpr.description":
      "Dane raportu są przechowywane lokalnie w Twojej przeglądarce. Żadne dane nie są przesyłane do stron trzecich bez Twojej wyraźnej zgody.",
    "gdpr.delete_evidence": "Usuń Pliki Dowodowe",
    "gdpr.delete_report": "Usuń Cały Raport",
    "gdpr.delete_evidence_confirm":
      "Spowoduje to trwałe usunięcie wszystkich zdjęć i plików z kamery dla tego raportu. Metadane raportu zostaną zachowane. Czy jesteś pewny?",
    "gdpr.delete_report_confirm":
      "Spowoduje to trwałe usunięcie całego raportu z lokalnego magazynu. Tej czynności nie można cofnąć. Czy jesteś pewny?",
    "gdpr.data_stored_locally":
      "Wszystkie dane raportu, w tym zdjęcia, filmy i dane osobowe, są przechowywane wyłącznie w lokalnym magazynie przeglądarki.",
    "privacy.intro": "Wprowadzenie",
    "privacy.data_collected": "Zbierane Dane",
    "privacy.how_used": "Jak Używane są Twoje Dane",
    "privacy.retention": "Przechowywanie Danych",
    "privacy.your_rights": "Twoje Prawa",
    "privacy.cookies": "Pliki Cookie",
    "privacy.contact": "Skontaktuj się z Nami",
    "privacy.updates": "Aktualizacje Polityki",
    "reports.empty.title": "Nie znaleziono raportów",
    "reports.empty.description": "Utwórz swój pierwszy raport, aby zacząć.",
    "reports.create_first": "Utwórz Raport",
  },
};

export default translations;

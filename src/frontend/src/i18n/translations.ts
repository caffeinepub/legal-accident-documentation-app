export type Language = "en" | "es" | "pl" | "mt";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "mt", label: "Malti", flag: "🇲🇹" },
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
  | "reports.create_first"
  // Wizard steps
  | "wizard.step1"
  | "wizard.step2"
  | "wizard.step2.cycling"
  | "wizard.step3"
  | "wizard.step4"
  | "wizard.step5"
  | "wizard.next"
  | "wizard.back"
  | "wizard.submit"
  // Vehicle fields
  | "vehicle.make_model"
  | "vehicle.colour"
  | "vehicle.licence_plate"
  | "vehicle.year"
  | "vehicle.type"
  // Accident details
  | "accident.date"
  | "accident.time"
  | "accident.location"
  | "accident.description"
  | "accident.speed_limit"
  | "accident.weather"
  | "accident.road_conditions"
  | "accident.damage"
  | "accident.injuries"
  // Panels
  | "panel.photos"
  | "panel.dashcam"
  | "panel.witness"
  | "panel.police"
  | "panel.other_parties"
  | "panel.legal_refs"
  | "panel.fault"
  | "panel.damage_severity"
  | "panel.repair_cost"
  | "panel.demand_letter"
  | "panel.negotiation"
  // Report detail
  | "report.claim_id"
  | "report.date"
  | "report.location"
  | "report.vehicle"
  | "report.other_parties"
  | "report.evidence"
  // Fleet
  | "fleet.overview"
  | "fleet.vehicles"
  | "fleet.drivers"
  | "fleet.maintenance"
  | "fleet.add_vehicle"
  | "fleet.add_driver"
  // Weather
  | "weather.fetch"
  | "weather.label"
  // Other
  | "report.new"
  | "report.view"
  | "report.delete.confirm"
  | "nav.dangerous_roads"
  | "nav.privacy"
  | "nav.terms";

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
    "wizard.step1": "Media & Evidence",
    "wizard.step2": "Your Vehicle",
    "wizard.step2.cycling": "Your Details",
    "wizard.step3": "Accident Details",
    "wizard.step4": "Other Parties",
    "wizard.step5": "Review & Submit",
    "wizard.next": "Next",
    "wizard.back": "Back",
    "wizard.submit": "Submit Report",
    "vehicle.make_model": "Make / Model",
    "vehicle.colour": "Colour",
    "vehicle.licence_plate": "Licence Plate / Registration",
    "vehicle.year": "Year",
    "vehicle.type": "Vehicle Type",
    "accident.date": "Date of Accident",
    "accident.time": "Time of Accident",
    "accident.location": "Location of Accident",
    "accident.description": "Accident Description",
    "accident.speed_limit": "Speed Limit (mph)",
    "accident.weather": "Weather Conditions",
    "accident.road_conditions": "Road Conditions",
    "accident.damage": "Vehicle Damage",
    "accident.injuries": "Injuries Sustained",
    "panel.photos": "Photos & Evidence",
    "panel.dashcam": "Dash Cam Footage",
    "panel.witness": "Witness Statement",
    "panel.police": "Police Details",
    "panel.other_parties": "Other Parties Involved",
    "panel.legal_refs": "Legal References",
    "panel.fault": "Fault Assessment",
    "panel.damage_severity": "Damage Severity",
    "panel.repair_cost": "Repair Cost Estimate",
    "panel.demand_letter": "Demand Letter",
    "panel.negotiation": "Negotiation Letter Builder",
    "report.claim_id": "Claim ID",
    "report.date": "Date",
    "report.location": "Location",
    "report.vehicle": "Your Vehicle",
    "report.other_parties": "Other Parties",
    "report.evidence": "Evidence",
    "fleet.overview": "Overview",
    "fleet.vehicles": "Vehicles",
    "fleet.drivers": "Drivers",
    "fleet.maintenance": "Maintenance",
    "fleet.add_vehicle": "Add Vehicle",
    "fleet.add_driver": "Add Driver",
    "weather.fetch": "Fetch Weather",
    "weather.label": "Weather at Time of Accident",
    "report.new": "Start New Report",
    "report.view": "View Report",
    "report.delete.confirm": "Are you sure you want to delete this report?",
    "nav.dangerous_roads": "Dangerous Roads",
    "nav.privacy": "Privacy Policy",
    "nav.terms": "Terms of Service",
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
    "wizard.step1": "Medios y Evidencia",
    "wizard.step2": "Su Vehículo",
    "wizard.step2.cycling": "Sus Detalles",
    "wizard.step3": "Detalles del Accidente",
    "wizard.step4": "Otras Partes",
    "wizard.step5": "Revisar y Enviar",
    "wizard.next": "Siguiente",
    "wizard.back": "Atrás",
    "wizard.submit": "Enviar Informe",
    "vehicle.make_model": "Marca / Modelo",
    "vehicle.colour": "Color",
    "vehicle.licence_plate": "Matrícula / Registro",
    "vehicle.year": "Año",
    "vehicle.type": "Tipo de Vehículo",
    "accident.date": "Fecha del Accidente",
    "accident.time": "Hora del Accidente",
    "accident.location": "Lugar del Accidente",
    "accident.description": "Descripción del Accidente",
    "accident.speed_limit": "Límite de Velocidad (mph)",
    "accident.weather": "Condiciones Meteorológicas",
    "accident.road_conditions": "Estado de la Carretera",
    "accident.damage": "Daño al Vehículo",
    "accident.injuries": "Lesiones Sufridas",
    "panel.photos": "Fotos y Evidencia",
    "panel.dashcam": "Grabación de Cámara",
    "panel.witness": "Declaración de Testigo",
    "panel.police": "Detalles de la Policía",
    "panel.other_parties": "Otras Partes Involucradas",
    "panel.legal_refs": "Referencias Legales",
    "panel.fault": "Evaluación de Culpa",
    "panel.damage_severity": "Gravedad del Daño",
    "panel.repair_cost": "Estimación del Costo de Reparación",
    "panel.demand_letter": "Carta de Demanda",
    "panel.negotiation": "Constructor de Carta de Negociación",
    "report.claim_id": "ID del Reclamo",
    "report.date": "Fecha",
    "report.location": "Ubicación",
    "report.vehicle": "Su Vehículo",
    "report.other_parties": "Otras Partes",
    "report.evidence": "Evidencia",
    "fleet.overview": "Descripción General",
    "fleet.vehicles": "Vehículos",
    "fleet.drivers": "Conductores",
    "fleet.maintenance": "Mantenimiento",
    "fleet.add_vehicle": "Agregar Vehículo",
    "fleet.add_driver": "Agregar Conductor",
    "weather.fetch": "Obtener Clima",
    "weather.label": "Clima en el Momento del Accidente",
    "report.new": "Iniciar Nuevo Informe",
    "report.view": "Ver Informe",
    "report.delete.confirm": "¿Está seguro de que desea eliminar este informe?",
    "nav.dangerous_roads": "Carreteras Peligrosas",
    "nav.privacy": "Política de Privacidad",
    "nav.terms": "Términos de Servicio",
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
    "wizard.step1": "Media i Dowody",
    "wizard.step2": "Twój Pojazd",
    "wizard.step2.cycling": "Twoje Dane",
    "wizard.step3": "Szczegóły Wypadku",
    "wizard.step4": "Inne Strony",
    "wizard.step5": "Przegląd i Wyślij",
    "wizard.next": "Dalej",
    "wizard.back": "Wstecz",
    "wizard.submit": "Prześlij Raport",
    "vehicle.make_model": "Marka / Model",
    "vehicle.colour": "Kolor",
    "vehicle.licence_plate": "Tablica / Rejestracja",
    "vehicle.year": "Rok",
    "vehicle.type": "Typ Pojazdu",
    "accident.date": "Data Wypadku",
    "accident.time": "Godzina Wypadku",
    "accident.location": "Miejsce Wypadku",
    "accident.description": "Opis Wypadku",
    "accident.speed_limit": "Ograniczenie Prędkości (mph)",
    "accident.weather": "Warunki Pogodowe",
    "accident.road_conditions": "Stan Drogi",
    "accident.damage": "Uszkodzenia Pojazdu",
    "accident.injuries": "Doznane Obrażenia",
    "panel.photos": "Zdjęcia i Dowody",
    "panel.dashcam": "Nagranie z Dashcam",
    "panel.witness": "Zeznanie Świadka",
    "panel.police": "Dane Policji",
    "panel.other_parties": "Inne Zaangażowane Strony",
    "panel.legal_refs": "Odniesienia Prawne",
    "panel.fault": "Ocena Winy",
    "panel.damage_severity": "Stopień Szkody",
    "panel.repair_cost": "Szacowany Koszt Naprawy",
    "panel.demand_letter": "Pismo Żądania",
    "panel.negotiation": "Kreator Listu Negocjacyjnego",
    "report.claim_id": "ID Roszczenia",
    "report.date": "Data",
    "report.location": "Lokalizacja",
    "report.vehicle": "Twój Pojazd",
    "report.other_parties": "Inne Strony",
    "report.evidence": "Dowody",
    "fleet.overview": "Przegląd",
    "fleet.vehicles": "Pojazdy",
    "fleet.drivers": "Kierowcy",
    "fleet.maintenance": "Konserwacja",
    "fleet.add_vehicle": "Dodaj Pojazd",
    "fleet.add_driver": "Dodaj Kierowcę",
    "weather.fetch": "Pobierz Pogodę",
    "weather.label": "Pogoda w Czasie Wypadku",
    "report.new": "Utwórz Nowy Raport",
    "report.view": "Zobacz Raport",
    "report.delete.confirm": "Czy na pewno chcesz usunąć ten raport?",
    "nav.dangerous_roads": "Niebezpieczne Drogi",
    "nav.privacy": "Polityka Prywatności",
    "nav.terms": "Warunki Usługi",
  },
  mt: {
    "nav.new_report": "Rapport Ġdid",
    "nav.my_reports": "Ir-Rapporti Tiegħi",
    "nav.fault_reference": "Riferiment għall-Ċolpa",
    "nav.legal_outputs": "Riżultati Leġali",
    "nav.grid_view": "Veduta tal-Ġrejja",
    "nav.insurers": "Assiguraturi",
    "nav.fleet": "Flotta",
    "action.save": "Issejvja",
    "action.submit": "Ibġħat",
    "action.cancel": "Ikkanċella",
    "action.delete": "Ħassar",
    "action.export": "Esporta",
    "action.add": "Žid",
    "action.generate": "Ġenera",
    "action.analyse": "Analizza",
    "action.confirm": "Ikkonferma",
    "action.close": "Agħlaq",
    "action.copy": "Ikkopja",
    "action.print": "Ipprintja",
    "page.new_report.heading": "Rapport Ġdid tal-Inċident",
    "page.new_report.subheading":
      "Idokumenta l-inċident tiegħek bl-analisi tal-AI",
    "page.reports.heading": "Ir-Rapporti Tiegħi",
    "page.reports.subheading":
      "Ara u mmaniġġja r-rapporti kollha tal-inċidenti salvati.",
    "page.privacy.heading": "Politika tal-Ċirkolarità",
    "page.privacy.subheading": "Kif iamthe.law jimmaniġġa d-dejta tiegħek",
    "status.draft": "Abbozz",
    "status.submitted": "Mibġħut",
    "status.under_review": "Taħt Ir-Reviżjoni",
    "status.settled": "Sodisfatt",
    "status.label": "Status tal-Talba",
    "footer.built_with": "Mibni bi",
    "footer.privacy_policy": "Politika tal-Ċirkolarità",
    "footer.data_privacy": "Dejta u Ċirkolarità",
    "disclaimer.title": "Avviż Leġali Importanti",
    "disclaimer.text":
      "iamthe.law hija għodda ta' dokumentazzjoni assistita mill-AI. L-informazzjoni pprovduta ma tikkostitwixxix parir leġali. Dejjem ikkonsulta avukat kwalifikat għal gwida leġali.",
    "gdpr.title": "Dejta u Ċirkolarità",
    "gdpr.description":
      "Id-dejta tar-rapport tiegħek hi maħzuna lokalment fil-browser tiegħek. L-ebda dejta ma titħabat lil partijiet terzi mingħajr il-kunsens espliċitu tiegħek.",
    "gdpr.delete_evidence": "Ħassar il-Fajls tal-Evidenza",
    "gdpr.delete_report": "Ħassar ir-Rapport Kollu",
    "gdpr.delete_evidence_confirm":
      "Dan se jħassar b’mod permanenti l-photos u l-fajls tal-dashcam kollha għal dan ir-rapport. Il-metadejta tar-rapport ser tinzaġħar. Inti Ďert?",
    "gdpr.delete_report_confirm":
      "Dan se jħassar b’mod permanenti r-rapport kollu mill-maħzenazzjoni lokali. Din l-azzjoni ma tistax tiġi revokata. Inti Ďert?",
    "gdpr.data_stored_locally":
      "Id-dejta tar-rapport kollha, inklużi l-photos, il-videos u d-dettalji personali, hi maħzuna biss fil-maħzenazzjoni lokali tal-browser tiegħek.",
    "privacy.intro": "Introduzzjoni",
    "privacy.data_collected": "Dejta li Niġbru",
    "privacy.how_used": "Kif Tintuża d-Dejta Tiegħek",
    "privacy.retention": "Retention tad-Dejta",
    "privacy.your_rights": "Id-Drittijiet Tiegħek",
    "privacy.cookies": "Cookies",
    "privacy.contact": "Ikkuntattjana",
    "privacy.updates": "Aġġornamenti tal-Politika",
    "reports.empty.title": "L-ebda rapport ma nstab",
    "reports.empty.description": "Oħloq l-ewwel rapport tiegħek biex tibda.",
    "reports.create_first": "Oħloq Rapport",
    "wizard.step1": "Midja u Evidenza",
    "wizard.step2": "Il-Vettura Tiegħek",
    "wizard.step2.cycling": "Id-Dettalji Tiegħek",
    "wizard.step3": "Dettalji tal-Inċident",
    "wizard.step4": "Partijiet Oħra",
    "wizard.step5": "Irrevedi u Ibgħat",
    "wizard.next": "Li Jmiss",
    "wizard.back": "Lura",
    "wizard.submit": "Ibgħat ir-Rapport",
    "vehicle.make_model": "Għamla / Mudell",
    "vehicle.colour": "Kulur",
    "vehicle.licence_plate": "Pjanċa tal-Karozza / Reġistrazzjoni",
    "vehicle.year": "Sena",
    "vehicle.type": "Tip tal-Vettura",
    "accident.date": "Data tal-Inċident",
    "accident.time": "Ħin tal-Inċident",
    "accident.location": "Post tal-Inċident",
    "accident.description": "Deskrizzjoni tal-Inċident",
    "accident.speed_limit": "Limitu tal-Veloċità (km/h)",
    "accident.weather": "Kundizzjonijiet tat-Temp",
    "accident.road_conditions": "Kundizzjonijiet tat-Triq",
    "accident.damage": "Ħsara fil-Vettura",
    "accident.injuries": "Korrimenti Mġarrba",
    "panel.photos": "Ritratti u Evidenza",
    "panel.dashcam": "Footage tad-Dash Cam",
    "panel.witness": "Dikjarazzjoni tax-Xhud",
    "panel.police": "Dettalji tal-Pulizija",
    "panel.other_parties": "Partijiet Oħra Involuti",
    "panel.legal_refs": "Referenzi Leġali",
    "panel.fault": "Valutazzjoni tal-Ħtija",
    "panel.damage_severity": "Severità tal-Ħsara",
    "panel.repair_cost": "Stima tal-Ispejjeż tat-Tiswija",
    "panel.demand_letter": "Ittra ta' Talba",
    "panel.negotiation": "Banitur ta' Ittra tan-Negozjat",
    "report.claim_id": "ID tat-Talba",
    "report.date": "Data",
    "report.location": "Post",
    "report.vehicle": "Il-Vettura Tiegħek",
    "report.other_parties": "Partijiet Oħra",
    "report.evidence": "Evidenza",
    "fleet.overview": "Ħarsa ġenerali",
    "fleet.vehicles": "Vetturi",
    "fleet.drivers": "Sewwieqa",
    "fleet.maintenance": "Manutenzjoni",
    "fleet.add_vehicle": "Żid Vettura",
    "fleet.add_driver": "Żid Sewwieq",
    "weather.fetch": "Iġġib it-Temp",
    "weather.label": "Temp fil-Ħin tal-Inċident",
    "report.new": "Ibda Rapport Ġdid",
    "report.view": "Ara r-Rapport",
    "report.delete.confirm": "Inti ċert li trid tħassar dan ir-rapport?",
    "nav.dangerous_roads": "Toroq Perikolużi",
    "nav.privacy": "Politika tal-Privatezza",
    "nav.terms": "Kundizzjonijiet tas-Servizz",
  },
};

export default translations;

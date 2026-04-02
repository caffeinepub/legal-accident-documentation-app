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
  | "status.acknowledged"
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
  | "nav.terms"
  // Draft restore banner
  | "draft.restore_title"
  | "draft.restore_desc"
  | "draft.restore_button"
  | "draft.discard_button"
  | "draft.last_saved"
  // Important notice / disclaimer
  | "notice.title"
  | "notice.body"
  | "notice.body_malta"
  // Onboarding banner
  | "onboarding.title"
  | "onboarding.subtitle"
  | "onboarding.tip1"
  | "onboarding.tip2"
  | "onboarding.tip3"
  | "onboarding.got_it"
  // Cookie consent banner
  | "cookie.title"
  | "cookie.desc"
  | "cookie.accept"
  | "cookie.decline"
  // Form headings
  | "form.heading"
  | "form.step_of"
  | "form.draft_saved"
  // Form sections
  | "form.section.media"
  | "form.section.media_desc"
  | "form.section.photos"
  | "form.section.dashcam"
  | "form.incident_type"
  | "form.vehicle_incident"
  | "form.cycling_incident"
  // Upload components
  | "upload.dashcam.click"
  | "upload.photos.click"
  | "upload.formats.photo"
  | "upload.add_more"
  // DashCam analyse
  | "dashcam.analysing"
  | "dashcam.reanalyse"
  | "dashcam.analyse"
  | "dashcam.cross_analysis_label"
  | "dashcam.cross_referenced"
  | "dashcam.placeholder"
  // Photo analyse
  | "photo.analysing"
  | "photo.reanalyse"
  | "photo.analyse"
  | "photo.analysing_with_ai"
  | "photo.ai_description_label"
  | "photo.placeholder"
  | "photo.evidence_gaps_title"
  | "photo.no_evidence_gaps_title"
  | "photo.no_evidence_gaps_desc"
  // Common
  | "common.editable"
  | "common.saved"
  // Evidence panel
  | "evidence.check_title"
  | "evidence.complete_msg"
  | "evidence.complete_badge"
  // AI Consistency
  | "ai.consistency_title"
  | "ai.consistency_no_data"
  | "ai.consistency_consistent"
  | "ai.consistency_review"
  // Injury tracker
  | "injury.tracker_title"
  | "injury.add_entry"
  | "injury.save_entry"
  | "injury.date"
  | "injury.appointment_type"
  | "injury.hospital"
  | "injury.doctor"
  | "injury.notes"
  | "injury.severity_label"
  | "injury.mild"
  | "injury.severe_end"
  | "injury.no_entries"
  | "injury.improving"
  | "injury.worsening"
  | "injury.stable"
  | "injury.severity_chart"
  // Fault panel
  | "fault.calculate"
  | "fault.recalculate"
  | "fault.ai_informed"
  | "fault.confidence"
  | "fault.basis"
  | "fault.supporting"
  | "fault.mitigating"
  | "fault.road_position"
  | "fault.party_a"
  | "fault.party_b"
  | "fault.ai_evidence_detected"
  // Whiplash panel
  | "whiplash.title_uk"
  | "whiplash.title_mt"
  | "whiplash.injury_type_label"
  | "whiplash.only"
  | "whiplash.psychological"
  | "whiplash.uplift"
  | "whiplash.duration_label"
  | "whiplash.duration_placeholder"
  | "whiplash.calculate_uk"
  | "whiplash.calculate_mt"
  | "whiplash.tariff_value"
  | "whiplash.psych_uplift_note"
  // Repair panel
  | "repair.title"
  | "repair.auto_detected"
  | "repair.crash_type_label"
  | "repair.crash_placeholder"
  | "repair.severity_label"
  | "repair.estimate_range_label"
  // Export panel
  | "export.title"
  | "export.insurance_ready"
  | "export.description"
  | "export.copy"
  | "export.copied"
  | "export.print"
  | "export.preview"
  | "export.show_more"
  | "export.show_less"
  // Damage severity panel
  | "damage.calculate"
  | "damage.recalculate"
  | "damage.title"
  // Step descriptions
  | "step.vehicle_title"
  | "step.vehicle_desc"
  | "step.cycling_title"
  | "step.cycling_desc"
  | "step.details_title"
  | "step.details_desc"
  | "step.parties_title"
  | "step.parties_desc"
  | "step.parties_add"
  // Claim status
  | "claim.status_title"
  // Vehicle step fields
  | "vehicle.vrt_expiry"
  | "vehicle.mot_expiry"
  | "vehicle.bike_type"
  | "vehicle.select_bike_type"
  // Accident step fields
  | "accident.road_type"
  | "accident.police_ref"
  | "accident.officer_name"
  | "accident.witness_statement"
  | "accident.road_condition"
  | "accident.visibility"
  // Cycling
  | "cycling.sub_scenario"
  | "cycling.vs_vehicle"
  | "cycling.vs_pedestrian"
  | "cycling.solo"
  // Review step
  | "review.photos"
  | "review.dashcam_clips"
  | "review.photo_analysis"
  | "review.generated"
  | "review.not_run"
  | "review.none"
  | "review.colour"
  | "review.year"
  // Chat assistant
  | "chat.button_label"
  | "chat.panel_title"
  | "chat.aware_of_report"
  | "chat.placeholder"
  | "chat.send"
  | "chat.prompt1"
  | "chat.prompt2"
  | "chat.prompt3"
  | "chat.prompt4"
  | "chat.error"
  | "chat.thinking";

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
    "status.acknowledged": "Acknowledged",
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
    "draft.restore_title": "Unsaved draft found",
    "draft.restore_desc":
      "You have an unsubmitted accident report saved locally. Would you like to restore it or start fresh?",
    "draft.restore_button": "Restore draft",
    "draft.discard_button": "Start fresh",
    "draft.last_saved": "last saved",
    "notice.title": "Important Notice",
    "notice.body":
      "This application and its outputs do not constitute legal advice. All content is provided for informational and insurance documentation purposes only. You should seek independent legal advice from a qualified solicitor before taking any legal action.",
    "notice.body_malta":
      "This application and its outputs do not constitute legal advice. All content is provided for informational and insurance documentation purposes only. You should seek independent legal advice from a qualified avukat (advocate) before taking any legal action.",
    "onboarding.title": "Welcome to iamthe.law",
    "onboarding.subtitle":
      "Your AI-powered accident documentation toolkit. Here's how it works:",
    "onboarding.tip1": "Upload photos & dash cam footage for AI analysis",
    "onboarding.tip2":
      "Generate a formal accident narrative and fault assessment",
    "onboarding.tip3": "Export insurer-ready reports with legal references",
    "onboarding.got_it": "Got it",
    "cookie.title": "Local Data Storage",
    "cookie.desc":
      "We store your claim drafts, fleet data, and insurer contacts locally in your browser using localStorage. Nothing is sent to external servers. Your data stays on your device. This app complies with GDPR — you can delete any stored data at any time via the Data & Privacy section of each report.",
    "cookie.accept": "Accept",
    "cookie.decline": "Decline",
    "form.heading": "New Accident Report",
    "form.step_of": "Step {current} of {total}",
    "form.draft_saved": "Draft saved",
    "form.section.media": "Media & AI Analysis",
    "form.section.media_desc":
      "Upload photos and dash cam footage. Use the analyse buttons to generate AI descriptions that complement each other.",
    "form.section.photos": "Accident Scene Photos",
    "form.section.dashcam": "Dash Cam Footage",
    "form.incident_type": "Incident Type",
    "form.vehicle_incident": "Vehicle Accident",
    "form.cycling_incident": "Cycling Accident",
    "upload.dashcam.click": "Click to upload dash cam footage (MP4, MOV, AVI)",
    "upload.photos.click":
      "Click to upload accident scene photos (JPG, PNG, WebP)",
    "upload.formats.photo": "JPEG, PNG, WebP supported",
    "upload.add_more": "Add More Photos",
    "dashcam.analysing": "Analysing Dash Cam…",
    "dashcam.reanalyse": "Re-analyse Dash Cam",
    "dashcam.analyse": "Analyse Dash Cam",
    "dashcam.cross_analysis_label": "AI Dash Cam Cross-Analysis",
    "dashcam.cross_referenced": "✓ Cross-referenced with photo analysis",
    "dashcam.placeholder": "AI-generated cross-analysis will appear here…",
    "photo.analysing": "Analysing Photos…",
    "photo.reanalyse": "Re-analyse Photos",
    "photo.analyse": "Analyse Photos",
    "photo.analysing_with_ai": "Analysing photos with AI…",
    "photo.ai_description_label": "AI Photo Description",
    "photo.placeholder": "AI-generated description will appear here…",
    "photo.evidence_gaps_title": "Evidence Gaps Detected",
    "photo.no_evidence_gaps_title": "No Evidence Gaps Detected",
    "photo.no_evidence_gaps_desc":
      "Photo evidence appears comprehensive for this report.",
    "common.editable": "(editable)",
    "common.saved": "Saved",
    "evidence.check_title": "Evidence Strength Check",
    "evidence.complete_msg":
      "Evidence Complete — your report has all key evidence components.",
    "evidence.complete_badge": "Complete",
    "ai.consistency_title": "AI Consistency Check",
    "ai.consistency_no_data":
      "Run fault assessment and photo analysis to enable consistency check.",
    "ai.consistency_consistent": "Consistent",
    "ai.consistency_review": "Review Recommended",
    "injury.tracker_title": "Injury Recovery Tracker",
    "injury.add_entry": "+ Add Entry",
    "injury.save_entry": "Save Entry",
    "injury.date": "Date",
    "injury.appointment_type": "Appointment Type",
    "injury.hospital": "Hospital / Clinic",
    "injury.doctor": "Doctor Name",
    "injury.notes": "Notes",
    "injury.severity_label": "Pain / Severity",
    "injury.mild": "1 — Mild",
    "injury.severe_end": "10 — Severe",
    "injury.no_entries":
      "No medical entries yet. Add your first appointment to begin tracking recovery.",
    "injury.improving": "Improving",
    "injury.worsening": "Worsening",
    "injury.stable": "Stable",
    "injury.severity_chart": "Pain / Severity Over Time",
    "fault.calculate": "Calculate Fault Split",
    "fault.recalculate": "Recalculate",
    "fault.ai_informed": "AI-Informed",
    "fault.confidence": "Assessment Confidence",
    "fault.basis": "Liability Determination Basis",
    "fault.supporting": "Factors Supporting Liability Finding",
    "fault.mitigating": "Mitigating Circumstances",
    "fault.road_position": "Road Position Impact",
    "fault.party_a": "Party A (Subject)",
    "fault.party_b": "Party B (Other)",
    "fault.ai_evidence_detected":
      "AI evidence detected — will be used in assessment.",
    "whiplash.title_uk": "Whiplash Injury Classifier",
    "whiplash.title_mt": "Soft Tissue Injury Estimator",
    "whiplash.injury_type_label": "Injury Type",
    "whiplash.only": "Whiplash only",
    "whiplash.psychological": "Whiplash + minor psychological injury",
    "whiplash.uplift": "(+10% uplift)",
    "whiplash.duration_label": "Estimated Injury Duration",
    "whiplash.duration_placeholder": "Select duration band…",
    "whiplash.calculate_uk": "Calculate WRP Tariff",
    "whiplash.calculate_mt": "Calculate Compensation",
    "whiplash.tariff_value": "Indicative Tariff Value",
    "whiplash.psych_uplift_note": "Includes 10% psychological uplift",
    "repair.title": "Repair Cost Estimator",
    "repair.auto_detected": "Auto-detected",
    "repair.crash_type_label": "Crash Type",
    "repair.crash_placeholder": "Select crash type…",
    "repair.severity_label": "Damage Severity",
    "repair.estimate_range_label": "Estimated Repair Range",
    "export.title": "Export Claim Report",
    "export.insurance_ready": "Insurance Ready",
    "export.description":
      "Compile all report data into a formal insurance claim document.",
    "export.copy": "Copy to Clipboard",
    "export.copied": "Copied!",
    "export.print": "Print Report",
    "export.preview": "Preview Report",
    "export.show_more": "Show full preview",
    "export.show_less": "Show less",
    "damage.calculate": "Calculate Severity",
    "damage.recalculate": "Recalculate",
    "damage.title": "Vehicle Damage Assessment",
    "step.vehicle_title": "Your Vehicle",
    "step.vehicle_desc":
      "Enter the details of your vehicle. These will be used to contextualise the AI photo analysis.",
    "step.cycling_title": "Your Details",
    "step.cycling_desc":
      "Provide details about your bike and safety equipment. These affect contributory negligence weighting.",
    "step.details_title": "Accident Details",
    "step.details_desc":
      "Describe the conditions and circumstances at the time of the accident.",
    "step.parties_title": "Other Parties Involved",
    "step.parties_desc":
      "Add all other parties involved — vehicles, motorcycles, cyclists, pedestrians, or third-party objects.",
    "step.parties_add": "Add Party",
    "claim.status_title": "Claim Status",
    "vehicle.vrt_expiry": "VRT Expiry (Vehicle Roadworthiness Test)",
    "vehicle.mot_expiry": "MOT Expiry",
    "vehicle.bike_type": "Bike Type",
    "vehicle.select_bike_type": "Select bike type",
    "accident.road_type": "Road Type",
    "accident.police_ref": "Police Reference No.",
    "accident.officer_name": "Attending Officer Name",
    "accident.witness_statement": "Witness Statement",
    "accident.road_condition": "Road Condition",
    "accident.visibility": "Visibility",
    "cycling.sub_scenario": "Cycling Scenario",
    "cycling.vs_vehicle": "Cyclist vs Vehicle",
    "cycling.vs_pedestrian": "Cyclist vs Pedestrian",
    "cycling.solo": "Solo / Road Defect",
    "review.photos": "Photos uploaded",
    "review.dashcam_clips": "Dash cam clips",
    "review.photo_analysis": "Photo analysis",
    "review.generated": "Generated",
    "review.not_run": "Not run",
    "review.none": "None",
    "review.colour": "Colour",
    "review.year": "Year",
    "chat.button_label": "Ask Legal Assistant",
    "chat.panel_title": "Legal Assistant",
    "chat.aware_of_report": "Aware of report",
    "chat.placeholder": "Ask a question...",
    "chat.send": "Send",
    "chat.prompt1": "What should I do right now?",
    "chat.prompt2": "Who is at fault?",
    "chat.prompt3": "How do I claim compensation?",
    "chat.prompt4": "Help me fill in the form",
    "chat.error": "Sorry, I could not get a response. Please try again.",
    "chat.thinking": "Thinking...",
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
    "status.acknowledged": "Confirmado",
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
    "accident.speed_limit": "Límite de Velocidad",
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
    "draft.restore_title": "Borrador no guardado encontrado",
    "draft.restore_desc":
      "Tiene un informe de accidente no enviado guardado localmente. ¿Le gustaría restaurarlo o empezar de nuevo?",
    "draft.restore_button": "Restaurar borrador",
    "draft.discard_button": "Empezar de nuevo",
    "draft.last_saved": "guardado el",
    "notice.title": "Aviso Importante",
    "notice.body":
      "Esta aplicación y sus resultados no constituyen asesoramiento legal. Todo el contenido se proporciona únicamente con fines informativos y de documentación de seguros. Debe buscar asesoramiento legal independiente de un abogado cualificado antes de emprender cualquier acción legal.",
    "notice.body_malta":
      "Esta aplicación y sus resultados no constituyen asesoramiento legal. Todo el contenido se proporciona únicamente con fines informativos y de documentación de seguros. Debe buscar asesoramiento legal independiente de un avukat (abogado) cualificado antes de emprender cualquier acción legal.",
    "onboarding.title": "Bienvenido a iamthe.law",
    "onboarding.subtitle":
      "Su kit de herramientas de documentación de accidentes con IA. Así funciona:",
    "onboarding.tip1": "Suba fotos y grabaciones para análisis de IA",
    "onboarding.tip2":
      "Genere una narrativa formal del accidente y evaluación de culpabilidad",
    "onboarding.tip3":
      "Exporte informes listos para aseguradoras con referencias legales",
    "onboarding.got_it": "Entendido",
    "cookie.title": "Almacenamiento Local de Datos",
    "cookie.desc":
      "Almacenamos sus borradores de reclamaciones, datos de flota y contactos de aseguradoras localmente en su navegador usando localStorage. No se envía nada a servidores externos. Sus datos permanecen en su dispositivo. Esta aplicación cumple con el RGPD.",
    "cookie.accept": "Aceptar",
    "cookie.decline": "Rechazar",
    "form.heading": "Nuevo Informe de Accidente",
    "form.step_of": "Paso {current} de {total}",
    "form.draft_saved": "Borrador guardado",
    "form.section.media": "Medios y Análisis de IA",
    "form.section.media_desc":
      "Suba fotos y grabaciones de la cámara. Use los botones de análisis para generar descripciones de IA complementarias.",
    "form.section.photos": "Fotos de la Escena del Accidente",
    "form.section.dashcam": "Grabación de Cámara de Tablero",
    "form.incident_type": "Tipo de Incidente",
    "form.vehicle_incident": "Accidente de Vehículo",
    "form.cycling_incident": "Accidente en Bicicleta",
    "upload.dashcam.click":
      "Haga clic para subir grabación de cámara (MP4, MOV, AVI)",
    "upload.photos.click":
      "Haga clic para subir fotos de la escena del accidente (JPG, PNG, WebP)",
    "upload.formats.photo": "Compatible con JPEG, PNG, WebP",
    "upload.add_more": "Agregar Más Fotos",
    "dashcam.analysing": "Analizando Cámara…",
    "dashcam.reanalyse": "Re-analizar Cámara",
    "dashcam.analyse": "Analizar Cámara",
    "dashcam.cross_analysis_label": "Análisis Cruzado de Cámara IA",
    "dashcam.cross_referenced": "✓ Verificado con análisis de fotos",
    "dashcam.placeholder":
      "El análisis cruzado generado por IA aparecerá aquí…",
    "photo.analysing": "Analizando Fotos…",
    "photo.reanalyse": "Re-analizar Fotos",
    "photo.analyse": "Analizar Fotos",
    "photo.analysing_with_ai": "Analizando fotos con IA…",
    "photo.ai_description_label": "Descripción de Fotos por IA",
    "photo.placeholder": "La descripción generada por IA aparecerá aquí…",
    "photo.evidence_gaps_title": "Brechas de Evidencia Detectadas",
    "photo.no_evidence_gaps_title": "Sin Brechas de Evidencia",
    "photo.no_evidence_gaps_desc":
      "La evidencia fotográfica parece completa para este informe.",
    "common.editable": "(editable)",
    "common.saved": "Guardado",
    "evidence.check_title": "Verificación de Evidencia",
    "evidence.complete_msg":
      "Evidencia Completa — su informe tiene todos los componentes clave.",
    "evidence.complete_badge": "Completo",
    "ai.consistency_title": "Verificación de Coherencia IA",
    "ai.consistency_no_data":
      "Ejecute la evaluación de culpa y el análisis de fotos para activar la verificación.",
    "ai.consistency_consistent": "Coherente",
    "ai.consistency_review": "Revisión Recomendada",
    "injury.tracker_title": "Seguimiento de Recuperación de Lesiones",
    "injury.add_entry": "+ Agregar Entrada",
    "injury.save_entry": "Guardar Entrada",
    "injury.date": "Fecha",
    "injury.appointment_type": "Tipo de Cita",
    "injury.hospital": "Hospital / Clínica",
    "injury.doctor": "Nombre del Médico",
    "injury.notes": "Notas",
    "injury.severity_label": "Dolor / Gravedad",
    "injury.mild": "1 — Leve",
    "injury.severe_end": "10 — Grave",
    "injury.no_entries":
      "No hay entradas médicas todavía. Agregue su primera cita para comenzar el seguimiento.",
    "injury.improving": "Mejorando",
    "injury.worsening": "Empeorando",
    "injury.stable": "Estable",
    "injury.severity_chart": "Dolor / Gravedad con el Tiempo",
    "fault.calculate": "Calcular Reparto de Culpa",
    "fault.recalculate": "Recalcular",
    "fault.ai_informed": "Informado por IA",
    "fault.confidence": "Confianza de Evaluación",
    "fault.basis": "Base de Determinación de Responsabilidad",
    "fault.supporting": "Factores que Apoyan la Determinación",
    "fault.mitigating": "Circunstancias Atenuantes",
    "fault.road_position": "Impacto de Posición en la Carretera",
    "fault.party_a": "Parte A (Sujeto)",
    "fault.party_b": "Parte B (Otro)",
    "fault.ai_evidence_detected":
      "Evidencia de IA detectada — se usará en la evaluación.",
    "whiplash.title_uk": "Clasificador de Lesión por Latigazo",
    "whiplash.title_mt": "Estimador de Lesión de Tejido Blando",
    "whiplash.injury_type_label": "Tipo de Lesión",
    "whiplash.only": "Solo latigazo",
    "whiplash.psychological": "Latigazo + lesión psicológica menor",
    "whiplash.uplift": "(+10% adicional)",
    "whiplash.duration_label": "Duración Estimada de la Lesión",
    "whiplash.duration_placeholder": "Seleccionar banda de duración…",
    "whiplash.calculate_uk": "Calcular Tarifa WRP",
    "whiplash.calculate_mt": "Calcular Compensación",
    "whiplash.tariff_value": "Valor Indicativo de la Tarifa",
    "whiplash.psych_uplift_note": "Incluye 10% adicional psicológico",
    "repair.title": "Estimador de Costo de Reparación",
    "repair.auto_detected": "Auto-detectado",
    "repair.crash_type_label": "Tipo de Colisión",
    "repair.crash_placeholder": "Seleccionar tipo de colisión…",
    "repair.severity_label": "Gravedad del Daño",
    "repair.estimate_range_label": "Rango Estimado de Reparación",
    "export.title": "Exportar Informe de Reclamo",
    "export.insurance_ready": "Listo para Aseguradora",
    "export.description":
      "Compile todos los datos del informe en un documento formal de reclamo de seguro.",
    "export.copy": "Copiar al Portapapeles",
    "export.copied": "¡Copiado!",
    "export.print": "Imprimir Informe",
    "export.preview": "Vista Previa del Informe",
    "export.show_more": "Mostrar vista completa",
    "export.show_less": "Mostrar menos",
    "damage.calculate": "Calcular Gravedad",
    "damage.recalculate": "Recalcular",
    "damage.title": "Evaluación de Daños del Vehículo",
    "step.vehicle_title": "Su Vehículo",
    "step.vehicle_desc":
      "Ingrese los detalles de su vehículo. Se usarán para contextualizar el análisis de fotos de IA.",
    "step.cycling_title": "Sus Detalles",
    "step.cycling_desc":
      "Proporcione detalles sobre su bicicleta y equipo de seguridad. Estos afectan la negligencia contributiva.",
    "step.details_title": "Detalles del Accidente",
    "step.details_desc":
      "Describa las condiciones y circunstancias en el momento del accidente.",
    "step.parties_title": "Otras Partes Involucradas",
    "step.parties_desc":
      "Agregue todas las demás partes involucradas — vehículos, motocicletas, ciclistas, peatones u objetos.",
    "step.parties_add": "Agregar Parte",
    "claim.status_title": "Estado del Reclamo",
    "vehicle.vrt_expiry":
      "Vencimiento de VRT (Prueba de Idoneidad del Vehículo)",
    "vehicle.mot_expiry": "Vencimiento de MOT",
    "vehicle.bike_type": "Tipo de Bicicleta",
    "vehicle.select_bike_type": "Seleccionar tipo de bicicleta",
    "accident.road_type": "Tipo de Vía",
    "accident.police_ref": "Número de Referencia Policial",
    "accident.officer_name": "Nombre del Oficial",
    "accident.witness_statement": "Declaración de Testigo",
    "accident.road_condition": "Estado de la Vía",
    "accident.visibility": "Visibilidad",
    "cycling.sub_scenario": "Escenario de Ciclismo",
    "cycling.vs_vehicle": "Ciclista vs Vehículo",
    "cycling.vs_pedestrian": "Ciclista vs Peatón",
    "cycling.solo": "Solo / Defecto Vial",
    "review.photos": "Fotos subidas",
    "review.dashcam_clips": "Clips de cámara",
    "review.photo_analysis": "Análisis de fotos",
    "review.generated": "Generado",
    "review.not_run": "No ejecutado",
    "review.none": "Ninguno",
    "review.colour": "Color",
    "review.year": "Año",
    "chat.button_label": "Preguntar al Asistente Legal",
    "chat.panel_title": "Asistente Legal",
    "chat.aware_of_report": "Consciente del informe",
    "chat.placeholder": "Haz una pregunta...",
    "chat.send": "Enviar",
    "chat.prompt1": "¿Qué debo hacer ahora mismo?",
    "chat.prompt2": "¿Quién tiene la culpa?",
    "chat.prompt3": "¿Cómo reclamo una compensación?",
    "chat.prompt4": "Ayúdame a rellenar el formulario",
    "chat.error": "Lo siento, no pude obtener respuesta. Inténtalo de nuevo.",
    "chat.thinking": "Pensando...",
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
    "status.acknowledged": "Potwierdzony",
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
    "accident.speed_limit": "Ograniczenie Prędkości",
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
    "draft.restore_title": "Znaleziono niezapisany szkic",
    "draft.restore_desc":
      "Masz lokalnie zapisany, nieprzesłany raport wypadku. Czy chcesz go przywrócić, czy zacząć od nowa?",
    "draft.restore_button": "Przywróć szkic",
    "draft.discard_button": "Zacznij od nowa",
    "draft.last_saved": "ostatnio zapisano",
    "notice.title": "Ważna informacja",
    "notice.body":
      "Ta aplikacja i jej wyniki nie stanowią porady prawnej. Wszystkie treści są udostępniane wyłącznie w celach informacyjnych i dokumentacyjnych ubezpieczeń. Przed podjęciem jakichkolwiek działań prawnych należy zasięgnąć niezależnej porady prawnej u wykwalifikowanego prawnika.",
    "notice.body_malta":
      "Ta aplikacja i jej wyniki nie stanowią porady prawnej. Wszystkie treści są udostępniane wyłącznie w celach informacyjnych i dokumentacyjnych ubezpieczeń. Przed podjęciem jakichkolwiek działań prawnych należy zasięgnąć niezależnej porady prawnej u wykwalifikowanego avukat (adwokata).",
    "onboarding.title": "Witamy w iamthe.law",
    "onboarding.subtitle":
      "Twój zestaw narzędzi do dokumentowania wypadków oparty na AI. Oto jak to działa:",
    "onboarding.tip1": "Prześlij zdjęcia i nagrania do analizy AI",
    "onboarding.tip2": "Generuj formalną narrację wypadku i ocenę winy",
    "onboarding.tip3":
      "Eksportuj raporty gotowe dla ubezpieczycieli z odniesieniami prawnymi",
    "onboarding.got_it": "Rozumiem",
    "cookie.title": "Lokalne Przechowywanie Danych",
    "cookie.desc":
      "Przechowujemy szkice Twoich roszczeń, dane floty i kontakty ubezpieczycieli lokalnie w Twojej przeglądarce. Nic nie jest wysyłane na zewnętrzne serwery.",
    "cookie.accept": "Akceptuj",
    "cookie.decline": "Odrzuć",
    "form.heading": "Nowy Raport Wypadku",
    "form.step_of": "Krok {current} z {total}",
    "form.draft_saved": "Szkic zapisany",
    "form.section.media": "Media i Analiza AI",
    "form.section.media_desc":
      "Prześlij zdjęcia i nagrania dashcam. Użyj przycisków analizy, aby wygenerować opisy AI.",
    "form.section.photos": "Zdjęcia z Miejsca Wypadku",
    "form.section.dashcam": "Nagranie z Dashcam",
    "form.incident_type": "Typ Zdarzenia",
    "form.vehicle_incident": "Wypadek Pojazdu",
    "form.cycling_incident": "Wypadek Rowerowy",
    "upload.dashcam.click":
      "Kliknij, aby przesłać nagranie dashcam (MP4, MOV, AVI)",
    "upload.photos.click":
      "Kliknij, aby przesłać zdjęcia z miejsca wypadku (JPG, PNG, WebP)",
    "upload.formats.photo": "Obsługiwane formaty: JPEG, PNG, WebP",
    "upload.add_more": "Dodaj Więcej Zdjęć",
    "dashcam.analysing": "Analizowanie Dashcam…",
    "dashcam.reanalyse": "Re-analizuj Dashcam",
    "dashcam.analyse": "Analizuj Dashcam",
    "dashcam.cross_analysis_label": "Analiza Krzyżowa Dashcam AI",
    "dashcam.cross_referenced": "✓ Skorelowano z analizą zdjęć",
    "dashcam.placeholder":
      "Tutaj pojawi się analiza krzyżowa wygenerowana przez AI…",
    "photo.analysing": "Analizowanie Zdjęć…",
    "photo.reanalyse": "Re-analizuj Zdjęcia",
    "photo.analyse": "Analizuj Zdjęcia",
    "photo.analysing_with_ai": "Analizowanie zdjęć przez AI…",
    "photo.ai_description_label": "Opis Zdjęć przez AI",
    "photo.placeholder": "Tutaj pojawi się opis wygenerowany przez AI…",
    "photo.evidence_gaps_title": "Wykryto Luki w Dowodach",
    "photo.no_evidence_gaps_title": "Brak Luk w Dowodach",
    "photo.no_evidence_gaps_desc":
      "Dowody fotograficzne wydają się kompletne dla tego raportu.",
    "common.editable": "(edytowalne)",
    "common.saved": "Zapisano",
    "evidence.check_title": "Kontrola Siły Dowodów",
    "evidence.complete_msg":
      "Dowody Kompletne — raport zawiera wszystkie kluczowe elementy dowodowe.",
    "evidence.complete_badge": "Kompletne",
    "ai.consistency_title": "Kontrola Spójności AI",
    "ai.consistency_no_data":
      "Uruchom ocenę winy i analizę zdjęć, aby włączyć kontrolę spójności.",
    "ai.consistency_consistent": "Spójny",
    "ai.consistency_review": "Zalecana Weryfikacja",
    "injury.tracker_title": "Śledzenie Powrotu do Zdrowia",
    "injury.add_entry": "+ Dodaj Wpis",
    "injury.save_entry": "Zapisz Wpis",
    "injury.date": "Data",
    "injury.appointment_type": "Typ Wizyty",
    "injury.hospital": "Szpital / Klinika",
    "injury.doctor": "Imię Lekarza",
    "injury.notes": "Notatki",
    "injury.severity_label": "Ból / Nasilenie",
    "injury.mild": "1 — Łagodny",
    "injury.severe_end": "10 — Ciężki",
    "injury.no_entries":
      "Brak wpisów medycznych. Dodaj pierwszą wizytę, aby rozpocząć śledzenie.",
    "injury.improving": "Poprawia się",
    "injury.worsening": "Pogarsza się",
    "injury.stable": "Stabilny",
    "injury.severity_chart": "Ból / Nasilenie w Czasie",
    "fault.calculate": "Oblicz Podział Winy",
    "fault.recalculate": "Przelicz",
    "fault.ai_informed": "Wsparcie AI",
    "fault.confidence": "Pewność Oceny",
    "fault.basis": "Podstawa Ustalenia Odpowiedzialności",
    "fault.supporting": "Czynniki Wspierające Ustalenie",
    "fault.mitigating": "Okoliczności Łagodzące",
    "fault.road_position": "Wpływ Pozycji na Drodze",
    "fault.party_a": "Strona A (Podmiot)",
    "fault.party_b": "Strona B (Inna)",
    "fault.ai_evidence_detected": "Wykryto dowody AI — zostaną użyte w ocenie.",
    "whiplash.title_uk": "Klasyfikator Urazu Biczowego",
    "whiplash.title_mt": "Estymator Urazu Tkanek Miękkich",
    "whiplash.injury_type_label": "Typ Urazu",
    "whiplash.only": "Tylko uraz biczowy",
    "whiplash.psychological": "Uraz biczowy + drobny uraz psychologiczny",
    "whiplash.uplift": "(+10% dopłaty)",
    "whiplash.duration_label": "Szacowany Czas Trwania Urazu",
    "whiplash.duration_placeholder": "Wybierz przedział czasowy…",
    "whiplash.calculate_uk": "Oblicz Taryfę WRP",
    "whiplash.calculate_mt": "Oblicz Odszkodowanie",
    "whiplash.tariff_value": "Wskazana Wartość Taryfowa",
    "whiplash.psych_uplift_note": "Zawiera 10% dopłaty psychologicznej",
    "repair.title": "Estymator Kosztów Naprawy",
    "repair.auto_detected": "Auto-wykryto",
    "repair.crash_type_label": "Typ Kolizji",
    "repair.crash_placeholder": "Wybierz typ kolizji…",
    "repair.severity_label": "Stopień Uszkodzenia",
    "repair.estimate_range_label": "Szacowany Zakres Naprawy",
    "export.title": "Eksportuj Raport Roszczenia",
    "export.insurance_ready": "Gotowy dla Ubezpieczyciela",
    "export.description":
      "Skompiluj wszystkie dane raportu do formalnego dokumentu roszczenia ubezpieczeniowego.",
    "export.copy": "Kopiuj do Schowka",
    "export.copied": "Skopiowano!",
    "export.print": "Drukuj Raport",
    "export.preview": "Podgląd Raportu",
    "export.show_more": "Pokaż pełny podgląd",
    "export.show_less": "Pokaż mniej",
    "damage.calculate": "Oblicz Stopień Uszkodzenia",
    "damage.recalculate": "Przelicz",
    "damage.title": "Ocena Uszkodzeń Pojazdu",
    "step.vehicle_title": "Twój Pojazd",
    "step.vehicle_desc":
      "Wprowadź dane swojego pojazdu. Zostaną użyte do kontekstualizacji analizy zdjęć AI.",
    "step.cycling_title": "Twoje Dane",
    "step.cycling_desc":
      "Podaj dane o rowerze i sprzęcie ochronnym. Wpływają na naliczanie odpowiedzialności przyczyniającej.",
    "step.details_title": "Szczegóły Wypadku",
    "step.details_desc": "Opisz warunki i okoliczności w chwili wypadku.",
    "step.parties_title": "Inne Zaangażowane Strony",
    "step.parties_desc":
      "Dodaj wszystkie inne zaangażowane strony — pojazdy, motocykle, rowerzystów, pieszych lub przedmioty.",
    "step.parties_add": "Dodaj Stronę",
    "claim.status_title": "Status Roszczenia",
    "vehicle.vrt_expiry": "Ważność VRT (Test Sprawności Pojazdu)",
    "vehicle.mot_expiry": "Ważność MOT",
    "vehicle.bike_type": "Typ Roweru",
    "vehicle.select_bike_type": "Wybierz typ roweru",
    "accident.road_type": "Typ Drogi",
    "accident.police_ref": "Numer Ref. Policji",
    "accident.officer_name": "Imię Oficera",
    "accident.witness_statement": "Zeznanie Świadka",
    "accident.road_condition": "Stan Nawierzchni",
    "accident.visibility": "Widoczność",
    "cycling.sub_scenario": "Scenariusz Wypadku Rowerowego",
    "cycling.vs_vehicle": "Rowerzysta vs Pojazd",
    "cycling.vs_pedestrian": "Rowerzysta vs Pieszy",
    "cycling.solo": "Samodzielny / Wada Drogi",
    "review.photos": "Przesłane zdjęcia",
    "review.dashcam_clips": "Klipy dashcam",
    "review.photo_analysis": "Analiza zdjęć",
    "review.generated": "Wygenerowano",
    "review.not_run": "Nie uruchomiono",
    "review.none": "Brak",
    "review.colour": "Kolor",
    "review.year": "Rok",
    "chat.button_label": "Zapytaj Asystenta Prawnego",
    "chat.panel_title": "Asystent Prawny",
    "chat.aware_of_report": "Świadomy raportu",
    "chat.placeholder": "Zadaj pytanie...",
    "chat.send": "Wyślij",
    "chat.prompt1": "Co powinienem teraz zrobić?",
    "chat.prompt2": "Kto jest winny?",
    "chat.prompt3": "Jak ubiegać się o odszkodowanie?",
    "chat.prompt4": "Pomóż mi wypełnić formularz",
    "chat.error":
      "Przepraszam, nie udało się uzyskać odpowiedzi. Spróbuj ponownie.",
    "chat.thinking": "Myślę...",
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
    "action.add": "Żid",
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
    "page.privacy.heading": "Politika tal-Privatezza",
    "page.privacy.subheading": "Kif iamthe.law jimmaniġġa d-dejta tiegħek",
    "status.draft": "Abbozz",
    "status.submitted": "Mibġħut",
    "status.under_review": "Taħt Ir-Reviżjoni",
    "status.acknowledged": "Rikonoxxut",
    "status.settled": "Sodisfatt",
    "status.label": "Status tal-Talba",
    "footer.built_with": "Mibni bi",
    "footer.privacy_policy": "Politika tal-Privatezza",
    "footer.data_privacy": "Dejta u Privatezza",
    "disclaimer.title": "Avviż Leġali Importanti",
    "disclaimer.text":
      "iamthe.law hija għodda ta' dokumentazzjoni assistita mill-AI. L-informazzjoni pprovduta ma tikkostitwixxix parir leġali. Dejjem ikkonsulta avukat kwalifikat għal gwida leġali.",
    "gdpr.title": "Dejta u Privatezza",
    "gdpr.description":
      "Id-dejta tar-rapport tiegħek hi maħzuna lokalment fil-browser tiegħek. L-ebda dejta ma titħabat lil partijiet terzi mingħajr il-kunsens espliċitu tiegħek.",
    "gdpr.delete_evidence": "Ħassar il-Fajls tal-Evidenza",
    "gdpr.delete_report": "Ħassar ir-Rapport Kollu",
    "gdpr.delete_evidence_confirm":
      "Dan se jħassar b'mod permanenti l-photos u l-fajls tal-dashcam kollha għal dan ir-rapport. Il-metadejta tar-rapport ser tinżamm. Inti Ċert?",
    "gdpr.delete_report_confirm":
      "Dan se jħassar b'mod permanenti r-rapport kollu mill-maħzenazzjoni lokali. Din l-azzjoni ma tistax tiġi revokata. Inti Ċert?",
    "gdpr.data_stored_locally":
      "Id-dejta tar-rapport kollha, inklużi l-photos, il-videos u d-dettalji personali, hi maħzuna biss fil-maħzenazzjoni lokali tal-browser tiegħek.",
    "privacy.intro": "Introduzzjoni",
    "privacy.data_collected": "Dejta li Niġbru",
    "privacy.how_used": "Kif Tintuża d-Dejta Tiegħek",
    "privacy.retention": "Żamma tad-Dejta",
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
    "fleet.overview": "Ħarsa Ġenerali",
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
    "draft.restore_title": "Abbozz mhux salvat instab",
    "draft.restore_desc":
      "Għandek rapport tal-inċident mhux mibgħut salvat lokalment. Trid tirrestawrah jew tibda mill-ġdid?",
    "draft.restore_button": "Irrestawra l-abbozz",
    "draft.discard_button": "Ibda mill-ġdid",
    "draft.last_saved": "salvat l-aħħar",
    "notice.title": "Avviż Importanti",
    "notice.body":
      "Din l-applikazzjoni u l-outputs tagħha ma jikkostitwixxux parir legali. Il-kontenut kollu huwa pprovdut għal skopijiet ta' informazzjoni u dokumentazzjoni tal-assigurazzjoni biss. Għandek tfittex parir legali indipendenti minn avukat kwalifikat qabel ma tieħu xi azzjoni legali.",
    "notice.body_malta":
      "Din l-applikazzjoni u l-outputs tagħha ma jikkostitwixxux parir legali. Il-kontenut kollu huwa pprovdut għal skopijiet ta' informazzjoni u dokumentazzjoni tal-assigurazzjoni biss. Għandek tfittex parir legali indipendenti minn avukat (avukat) kwalifikat qabel ma tieħu xi azzjoni legali.",
    "onboarding.title": "Merħba f'iamthe.law",
    "onboarding.subtitle":
      "Il-kit tal-għodod tiegħek għad-dokumentazzjoni tal-inċidenti bl-AI. Hekk jaħdem:",
    "onboarding.tip1":
      "Itla' ritratti u footage tad-dash cam għall-analiżi tal-AI",
    "onboarding.tip2":
      "Iġġenera narrativa formali tal-inċident u valutazzjoni tal-ħtija",
    "onboarding.tip3":
      "Esporta rapporti lesti għall-assiguraturi b'referenzi leġali",
    "onboarding.got_it": "Mifhum",
    "cookie.title": "Ħażna Lokali tad-Dejta",
    "cookie.desc":
      "Naħżnu l-abbozzi tat-talbiet tiegħek, id-dejta tal-flotta u l-kuntatti tal-assiguraturi lokalment fil-browser tiegħek. Xejn ma jintbagħat lil servers esterni.",
    "cookie.accept": "Aċċetta",
    "cookie.decline": "Irrifjuta",
    "form.heading": "Rapport Ġdid tal-Inċident",
    "form.step_of": "Pass {current} minn {total}",
    "form.draft_saved": "Abbozz salvat",
    "form.section.media": "Midja u Analiżi tal-AI",
    "form.section.media_desc":
      "Itla' ritratti u footage tad-dash cam. Uża l-buttuni tal-analiżi biex tiġġenera deskrizzjonijiet tal-AI.",
    "form.section.photos": "Ritratti tax-Xena tal-Inċident",
    "form.section.dashcam": "Footage tad-Dash Cam",
    "form.incident_type": "Tip ta' Inċident",
    "form.vehicle_incident": "Inċident ta' Vettura",
    "form.cycling_incident": "Inċident ta' Rikkbu",
    "upload.dashcam.click":
      "Ikklikkja biex titla' footage tad-dash cam (MP4, MOV, AVI)",
    "upload.photos.click":
      "Ikklikkja biex titla' ritratti tax-xena tal-inċident (JPG, PNG, WebP)",
    "upload.formats.photo": "JPEG, PNG, WebP supportati",
    "upload.add_more": "Żid Aktar Ritratti",
    "dashcam.analysing": "Qed Janalizza d-Dash Cam…",
    "dashcam.reanalyse": "Re-analizza d-Dash Cam",
    "dashcam.analyse": "Analizza d-Dash Cam",
    "dashcam.cross_analysis_label": "Analiżi Inkroċjata tad-Dash Cam bl-AI",
    "dashcam.cross_referenced": "✓ Ikkroċjat mal-analiżi tar-ritratti",
    "dashcam.placeholder": "L-analiżi inkroċjata tal-AI se tidher hawn…",
    "photo.analysing": "Qed Janalizza r-Ritratti…",
    "photo.reanalyse": "Re-analizza r-Ritratti",
    "photo.analyse": "Analizza r-Ritratti",
    "photo.analysing_with_ai": "Qed janalizza r-ritratti bl-AI…",
    "photo.ai_description_label": "Deskrizzjoni tar-Ritratti bl-AI",
    "photo.placeholder": "Id-deskrizzjoni tal-AI se tidher hawn…",
    "photo.evidence_gaps_title": "Lakuni fl-Evidenza Skoperti",
    "photo.no_evidence_gaps_title": "Ebda Lakuni fl-Evidenza",
    "photo.no_evidence_gaps_desc":
      "L-evidenza fotografika tidher komprehensiva għal dan ir-rapport.",
    "common.editable": "(editabbli)",
    "common.saved": "Salvat",
    "evidence.check_title": "Verifika tal-Qawwa tal-Evidenza",
    "evidence.complete_msg":
      "Evidenza Kompluta — ir-rapport tiegħek għandu l-komponenti ewlenin kollha.",
    "evidence.complete_badge": "Kompluta",
    "ai.consistency_title": "Verifika tal-Konsistenza tal-AI",
    "ai.consistency_no_data":
      "Mexxi l-valutazzjoni tal-ħtija u l-analiżi tar-ritratti biex tippermetti l-verifika.",
    "ai.consistency_consistent": "Konsistenti",
    "ai.consistency_review": "Reviżjoni Rakkomandata",
    "injury.tracker_title": "Traċċatur tal-Irkupru mill-Korriment",
    "injury.add_entry": "+ Żid Dħul",
    "injury.save_entry": "Issejvja d-Dħul",
    "injury.date": "Data",
    "injury.appointment_type": "Tip ta' Appuntament",
    "injury.hospital": "Sptar / Klinika",
    "injury.doctor": "Isem it-Tabib",
    "injury.notes": "Noti",
    "injury.severity_label": "Uġigħ / Severità",
    "injury.mild": "1 — Ħafif",
    "injury.severe_end": "10 — Severu",
    "injury.no_entries":
      "Ebda dħuliet mediċi s'issa. Żid l-ewwel appuntament tiegħek biex tibda t-traċċar.",
    "injury.improving": "Titjib",
    "injury.worsening": "Aggravament",
    "injury.stable": "Stabbli",
    "injury.severity_chart": "Uġigħ / Severità maż-Żmien",
    "fault.calculate": "Ikkalkola l-Qsim tal-Ħtija",
    "fault.recalculate": "Erġa' Ikkalkola",
    "fault.ai_informed": "Informata mill-AI",
    "fault.confidence": "Kunfidenza tal-Valutazzjoni",
    "fault.basis": "Bażi tad-Determinazzjoni tal-Responsabbiltà",
    "fault.supporting": "Fatturi li Jappoġġjaw is-Sejba",
    "fault.mitigating": "Ċirkostanzi Attenwanti",
    "fault.road_position": "Impatt tal-Pożizzjoni fit-Triq",
    "fault.party_a": "Parti A (Suġġett)",
    "fault.party_b": "Parti B (Oħra)",
    "fault.ai_evidence_detected":
      "Evidenza tal-AI skoperta — se tintuża fil-valutazzjoni.",
    "whiplash.title_uk": "Klassifikatur tal-Korriment bil-Latigu",
    "whiplash.title_mt": "Stimatur tal-Korriment tat-Tessut Artab",
    "whiplash.injury_type_label": "Tip ta' Korriment",
    "whiplash.only": "Latigu biss",
    "whiplash.psychological": "Latigu + korriment psikoloġiku minuri",
    "whiplash.uplift": "(+10% żieda)",
    "whiplash.duration_label": "Durata Stimata tal-Korriment",
    "whiplash.duration_placeholder": "Agħżel il-banda tad-durata…",
    "whiplash.calculate_uk": "Ikkalkola t-Tariffa WRP",
    "whiplash.calculate_mt": "Ikkalkola l-Kumpens",
    "whiplash.tariff_value": "Valur Indikattiv tat-Tariffa",
    "whiplash.psych_uplift_note": "Tinkludi 10% żieda psikoloġika",
    "repair.title": "Stimatur tal-Ispejjeż tat-Tiswija",
    "repair.auto_detected": "Awto-skoperta",
    "repair.crash_type_label": "Tip ta' Kolliżjoni",
    "repair.crash_placeholder": "Agħżel it-tip ta' kolliżjoni…",
    "repair.severity_label": "Severità tal-Ħsara",
    "repair.estimate_range_label": "Firxa Stmata tat-Tiswija",
    "export.title": "Esporta r-Rapport tat-Talba",
    "export.insurance_ready": "Lest għall-Assiguratur",
    "export.description":
      "Kompila d-dejta tar-rapport kollha f'dokument formali tal-assigurazzjoni.",
    "export.copy": "Ikkopja fil-Clipboard",
    "export.copied": "Ikkopjat!",
    "export.print": "Ipprintja r-Rapport",
    "export.preview": "Anteprima tar-Rapport",
    "export.show_more": "Uri l-anteprima sħiħa",
    "export.show_less": "Uri inqas",
    "damage.calculate": "Ikkalkola s-Severità",
    "damage.recalculate": "Erġa' Ikkalkola",
    "damage.title": "Valutazzjoni tal-Ħsara tal-Vettura",
    "step.vehicle_title": "Il-Vettura Tiegħek",
    "step.vehicle_desc":
      "Daħħal id-dettalji tal-vettura tiegħek. Dawn se jintużaw biex jikkontestwalizzaw l-analiżi tal-AI.",
    "step.cycling_title": "Id-Dettalji Tiegħek",
    "step.cycling_desc":
      "Ipprovdi dettalji dwar ir-rikkbu u t-tagħmir tas-sigurtà tiegħek. Dawn jaffettwaw il-piż tan-negliġenza kontributorja.",
    "step.details_title": "Dettalji tal-Inċident",
    "step.details_desc":
      "Iddeskrivi l-kundizzjonijiet u ċ-ċirkostanzi fil-ħin tal-inċident.",
    "step.parties_title": "Partijiet Oħra Involuti",
    "step.parties_desc":
      "Żid il-partijiet l-oħra kollha involuti — vetturi, muturi, rikkieba, pedestrians, jew oġġetti.",
    "step.parties_add": "Żid Parti",
    "claim.status_title": "Status tat-Talba",
    "vehicle.vrt_expiry": "Skadenza VRT (Test tal-Idoneità tal-Vettura)",
    "vehicle.mot_expiry": "Skadenza MOT",
    "vehicle.bike_type": "Tip ta' Rikkbu",
    "vehicle.select_bike_type": "Agħżel it-tip ta' rikkbu",
    "accident.road_type": "Tip ta' Triq",
    "accident.police_ref": "Nru ta' Referenza tal-Pulizija",
    "accident.officer_name": "Isem tal-Uffiċjal",
    "accident.witness_statement": "Dikjarazzjoni tax-Xhud",
    "accident.road_condition": "Kundizzjoni tat-Triq",
    "accident.visibility": "Viżibbiltà",
    "cycling.sub_scenario": "Xenarju tar-Rikkbu",
    "cycling.vs_vehicle": "Rikkieb vs Vettura",
    "cycling.vs_pedestrian": "Rikkieb vs Pedistru",
    "cycling.solo": "Waħdu / Difett fit-Triq",
    "review.photos": "Ritratti mgħobbija",
    "review.dashcam_clips": "Klipps tad-dash cam",
    "review.photo_analysis": "Analiżi tar-ritratti",
    "review.generated": "Iġġenerat",
    "review.not_run": "Mhux imexxi",
    "review.none": "Ebda",
    "review.colour": "Kulur",
    "review.year": "Sena",
    "chat.button_label": "Staqsi lill-Assistent Legali",
    "chat.panel_title": "Assistent Legali",
    "chat.aware_of_report": "Konxju tar-rapport",
    "chat.placeholder": "Staqsi mistoqsija...",
    "chat.send": "Ibgħat",
    "chat.prompt1": "X'għandi nagħmel issa?",
    "chat.prompt2": "Min hu ħati?",
    "chat.prompt3": "Kif nitlob kumpens?",
    "chat.prompt4": "Għinni nimla l-formola",
    "chat.error": "Jiddispjaċini, ma stajtx nikseb risposta. Erġa' pprova.",
    "chat.thinking": "Naħseb...",
  },
};

export default translations;

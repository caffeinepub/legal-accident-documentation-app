import type { AccidentReport } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { useLanguage } from "../contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  isFallback?: boolean;
}

// ---------------------------------------------------------------------------
// Smart fallback responses — used when the AI API is unavailable
// ---------------------------------------------------------------------------

type FallbackEntry = {
  keywords: string[];
  answer: Record<"en" | "es" | "pl" | "mt", string>;
  ukExtra?: string;
  mtExtra?: string;
};

const FALLBACK_RESPONSES: FallbackEntry[] = [
  {
    keywords: [
      "what should",
      "right now",
      "first",
      "after accident",
      "just happened",
      "qué debo",
      "ahora mismo",
      "después",
      "co powinienem",
      "teraz",
      "x'għandi",
      "issa",
      "appena",
    ],
    answer: {
      en: "Immediately after an accident:\n1. Check for injuries — call 999 (UK) or 112 (Malta) if anyone is hurt.\n2. Move vehicles to a safe position if possible and turn on hazard lights.\n3. Exchange names, addresses, vehicle registrations and insurance details with all parties.\n4. Take photos of the scene, damage, road conditions and any injuries.\n5. Note the time, date, exact location and any witnesses.\n6. Report the accident to your insurer within 24 hours.",
      es: "Inmediatamente después de un accidente:\n1. Comprueba lesiones — llama al 999 (UK) o 112 (Malta) si alguien está herido.\n2. Mueve los vehículos a lugar seguro y enciende las luces de emergencia.\n3. Intercambia datos con todos los implicados (nombre, dirección, matrícula, seguro).\n4. Toma fotos del lugar, daños, estado de la carretera y lesiones.\n5. Anota hora, fecha, ubicación exacta y testigos.\n6. Notifica a tu aseguradora en las primeras 24 horas.",
      pl: "Bezpośrednio po wypadku:\n1. Sprawdź obrażenia — zadzwoń pod 999 (UK) lub 112 (Malta) jeśli ktoś jest ranny.\n2. Przestaw pojazdy w bezpieczne miejsce i włącz światła awaryjne.\n3. Wymień dane z wszystkimi uczestnikami (imię, adres, rejestracja, ubezpieczenie).\n4. Zrób zdjęcia miejsca, uszkodzeń, stanu drogi i obrażeń.\n5. Zanotuj czas, datę, dokładne miejsce i świadków.\n6. Zgłoś wypadek ubezpieczycielowi w ciągu 24 godzin.",
      mt: "Immedjatament wara inċident:\n1. Iċċekkja għal korrimenti — ċempel 999 (UK) jew 112 (Malta) jekk xi ħadd ikun ferut.\n2. Ċaqlaq il-vetturi f'pożizzjoni sigura u xgħel id-dwal ta' emerġenza.\n3. Skambja dettalji ma' dawk involuti (isem, indirizz, numru tal-karozza, assigurazzjoni).\n4. Ħu ritratti tal-post, il-ħsarat, l-istat tat-triq u l-korrimenti.\n5. Innota l-ħin, id-data, il-post eżatt u x-xhieda.\n6. Avża lill-assiguratur tiegħek fi żmien 24 siegħa.",
    },
    mtExtra:
      "In Malta, report to Pulizija ta' Malta. If injuries occurred, a police report (Rapport tal-Pulizija) is mandatory under TRO Cap. 65.",
    ukExtra:
      "In the UK, if anyone is injured you must report to police within 24 hours under Road Traffic Act 1988 s.170.",
  },
  {
    keywords: [
      "fault",
      "who is",
      "blame",
      "liable",
      "liability",
      "culpa",
      "quién",
      "responsab",
      "wina",
      "kto jest",
      "odpowied",
      "ħati",
      "min hu",
      "responsabbli",
    ],
    answer: {
      en: "Fault is assessed by looking at:\n• The collision type and point of impact\n• Road position and speed of each vehicle\n• Traffic signals and road markings\n• Weather and road conditions\n• Witness statements and CCTV/dash cam footage\n\nContributory negligence can reduce your compensation even if the other party is primarily at fault. Use the Fault Assessment tool in your report for a percentage estimate.",
      es: "La culpa se evalúa considerando:\n• Tipo de colisión y punto de impacto\n• Posición en la carretera y velocidad\n• Señales y marcas viales\n• Condiciones meteorológicas y del asfalto\n• Declaraciones de testigos y grabaciones\n\nLa negligencia contributiva puede reducir tu indemnización. Usa la herramienta de Evaluación de Culpa en tu informe.",
      pl: "Winę ocenia się na podstawie:\n• Rodzaju kolizji i miejsca uderzenia\n• Pozycji na drodze i prędkości\n• Sygnalizacji i oznakowania\n• Warunków atmosferycznych i stanu drogi\n• Zeznań świadków i nagrań\n\nPrzyczynienie się do wypadku może zmniejszyć Twoje odszkodowanie. Skorzystaj z narzędzia Oceny Winy w raporcie.",
      mt: "Il-ħtija tiġi evalwata skont:\n• It-tip ta' kolliżjoni u l-punt ta' impatt\n• Il-pożizzjoni fit-triq u l-veloċità\n• Is-sinjali tat-traffiku u l-marka fit-triq\n• Il-kondizzjonijiet tal-temp u tat-triq\n• Dikjarazzjonijiet tax-xhieda u reġistrazzjonijiet\n\nNegliġenza kontributiva tista' tnaqqas il-kumpens tiegħek. Uża l-għodda tal-Valutazzjoni tal-Ħtija fir-rapport.",
    },
    mtExtra:
      "Under Malta Civil Code Arts. 1031–1033, fault is assessed proportionally. Courts apply contributory negligence principles.",
    ukExtra:
      "UK courts apply the Law Reform (Contributory Negligence) Act 1945 to apportion fault. Landmark case: Froom v Butcher [1976].",
  },
  {
    keywords: [
      "compens",
      "claim",
      "how do i",
      "damages",
      "money",
      "pay",
      "compensación",
      "reclamar",
      "indemnización",
      "odszkodowanie",
      "jak",
      "ubiegać",
      "kumpens",
      "kif",
      "titlob",
    ],
    answer: {
      en: "To make a compensation claim:\n1. Document everything — complete your accident report in this app with photos, witness details and a narrative.\n2. Report to your insurer promptly.\n3. Get a medical assessment for any injuries (keep all receipts).\n4. Send a formal Demand Letter — use the generator in this app.\n5. If the other driver's insurer disputes liability, use the Liability Dispute Response template.\n6. Consider legal advice if your claim is high-value or complex.",
      es: "Para reclamar compensación:\n1. Documenta todo — completa tu informe en esta app con fotos, testigos y narrativa.\n2. Notifica a tu aseguradora rápidamente.\n3. Obtén una evaluación médica por cualquier lesión (guarda los recibos).\n4. Envía una Carta de Reclamación — usa el generador de esta app.\n5. Si hay disputa, usa la plantilla de Respuesta a Disputa de Responsabilidad.\n6. Considera asesoramiento legal si la reclamación es importante.",
      pl: "Aby ubiegać się o odszkodowanie:\n1. Udokumentuj wszystko — wypełnij raport w tej aplikacji ze zdjęciami i świadkami.\n2. Niezwłocznie zgłoś ubezpieczycielowi.\n3. Uzyskaj ocenę medyczną za wszelkie obrażenia (zachowaj rachunki).\n4. Wyślij formalne Pismo Roszczeniowe — skorzystaj z generatora w tej aplikacji.\n5. W razie sporu użyj szablonu Odpowiedzi na Spór.\n6. Rozważ poradę prawną przy poważnych roszczeniach.",
      mt: "Biex titlob kumpens:\n1. Iddisokkja kollox — Ilħaq il-formola tal-inċident f'din l-app.\n2. Avża lill-assiguratur tiegħek malajr.\n3. Ikseb valutazzjoni medika għal kull ferita (żomm il-irċevuti).\n4. Ibgħat Ittra ta' Talba Formali — uża l-ġeneratur f'din l-app.\n5. Jekk hemm tilwima, uża t-template tar-Risposta għat-Tilwima.\n6. Ikkunsidra parir minn avukat għal talbiet kumplessi.",
    },
    mtExtra:
      "In Malta the prescription period is 2 years (Civil Code Art. 2153). Claims go to the Magistrates' Court (up to €15,000) or Civil Court First Hall.",
    ukExtra:
      "UK personal injury claims must be started within 3 years (Limitation Act 1980). Small claims up to £10,000, Fast Track up to £25,000.",
  },
  {
    keywords: [
      "fill",
      "form",
      "how",
      "complete",
      "wizard",
      "step",
      "rellenar",
      "formulario",
      "completar",
      "wypełnić",
      "formularz",
      "imla",
      "formola",
      "kif",
    ],
    answer: {
      en: "How to fill in the accident report:\n1. Step 1 — Select the incident type (vehicle, cycling, etc.) and upload photos or dash cam footage.\n2. Step 2 — Enter your vehicle or personal details.\n3. Step 3 — Describe the accident: date, time, location, weather, police reference.\n4. Step 4 — Add other parties involved (other vehicles, pedestrians, cyclists).\n5. Step 5 — Review, sign digitally and generate your formal report.\n\nTip: Use the 📍 button to fetch your GPS coordinates automatically, and the weather fetch button for instant weather data.",
      es: "Cómo rellenar el informe:\n1. Paso 1 — Selecciona el tipo de incidente y sube fotos o vídeo del dashcam.\n2. Paso 2 — Introduce los datos de tu vehículo o personales.\n3. Paso 3 — Describe el accidente: fecha, hora, lugar, clima, referencia policial.\n4. Paso 4 — Añade las otras partes implicadas.\n5. Paso 5 — Revisa, firma digitalmente y genera tu informe formal.\n\nConsejo: Usa el botón 📍 para coordenadas GPS y el botón de clima para datos automáticos.",
      pl: "Jak wypełnić raport:\n1. Krok 1 — Wybierz typ zdarzenia i prześlij zdjęcia lub nagranie dashcamu.\n2. Krok 2 — Podaj dane pojazdu lub swoje dane osobowe.\n3. Krok 3 — Opisz wypadek: data, godzina, miejsce, pogoda, numer zgłoszenia policji.\n4. Krok 4 — Dodaj inne strony (inne pojazdy, pieszych, rowerzystów).\n5. Krok 5 — Przejrzyj, podpisz cyfrowo i wygeneruj raport.\n\nWskazówka: Użyj przycisku 📍 do automatycznych współrzędnych GPS.",
      mt: "Kif timla r-rapport:\n1. Pass 1 — Agħżel it-tip ta' inċident u itla' ritratti jew vidjow.\n2. Pass 2 — Daħħal id-dettalji tal-vettura jew personali tiegħek.\n3. Pass 3 — Iddeskrivi l-inċident: data, ħin, post, temp, referenza tal-pulizija.\n4. Pass 4 — Żid partijiet oħra involuti.\n5. Pass 5 — Irrevedi, iffirma diġitalment u oħloq ir-rapport formali.\n\nTip: Uża l-buttuna 📍 għall-koordinati GPS awtomatiċi.",
    },
  },
  {
    keywords: [
      "insurance",
      "insurer",
      "policy",
      "notify",
      "seguro",
      "aseguradora",
      "póliza",
      "ubezpieczenie",
      "ubezpieczyciel",
      "assigurazzjoni",
      "assiguratur",
    ],
    answer: {
      en: "When notifying your insurer:\n• Contact them as soon as possible — most policies require notification within 24–48 hours.\n• Provide your claim reference number (generated by this app), photos and the accident report.\n• Do not admit liability at the scene or in writing before seeking legal advice.\n• Keep copies of all correspondence.\n• If the other party's insurer contacts you, you are not obliged to give a recorded statement without legal advice.",
      es: "Al notificar a tu aseguradora:\n• Contacta lo antes posible — la mayoría de pólizas exigen notificación en 24–48 horas.\n• Proporciona el número de referencia del siniestro, fotos y el informe.\n• No admitas responsabilidad sin asesoramiento legal previo.\n• Guarda copias de toda la correspondencia.",
      pl: "Przy zgłaszaniu do ubezpieczyciela:\n• Skontaktuj się jak najszybciej — większość polis wymaga zgłoszenia w ciągu 24–48 godzin.\n• Podaj numer referencyjny roszczenia, zdjęcia i raport z wypadku.\n• Nie przyznawaj się do winy bez wcześniejszej porady prawnej.\n• Zachowaj kopie całej korespondencji.",
      mt: "Meta tavża lill-assiguratur:\n• Ikkuntattjah kemm jista' jkun malajr — il-biċċa l-kbira tal-poloz jeħtieġu notifika fi 24–48 siegħa.\n• Ipprovdi n-numru ta' referenza, ritratti u r-rapport tal-inċident.\n• Tammetti l-ħtija mingħajr parir legali.\n• Żomm kopji ta' kull korrispondenza.",
    },
    mtExtra:
      "In Malta, third-party motor insurance is mandatory under TRO Cap. 65. Uninsured drivers can be reported to Fond tal-Kumpens (Guarantee Fund).",
    ukExtra:
      "In the UK, third-party motor insurance is mandatory under Road Traffic Act 1988 s.143. Uninsured drivers can be claimed against through the Motor Insurers' Bureau (MIB).",
  },
  {
    keywords: [
      "police",
      "report",
      "pulizija",
      "policja",
      "policía",
      "zgłosz",
      "denunciar",
      "rapport",
    ],
    answer: {
      en: "Reporting to the police:\n• You must report a road accident to police if there are injuries, or if the other driver fails to give their details.\n• In the UK, report within 24 hours at your nearest police station if not done at the scene (Road Traffic Act 1988 s.170).\n• In Malta, call 119 (police non-emergency) or go to the nearest police station. A Rapport tal-Pulizija is required if there are injuries.",
      es: "Denuncia policial:\n• Debes denunciar si hay heridos o si el otro conductor no facilita sus datos.\n• En el Reino Unido, denuncia en 24 horas si no se hizo en el lugar del accidente.\n• En Malta, llama al 119 o acude a la comisaría más cercana.",
      pl: "Zgłoszenie policji:\n• Musisz zgłosić wypadek, jeśli są ranni lub drugi kierowca nie podał swoich danych.\n• W UK zgłoś w ciągu 24 godzin na najbliższy posterunek policji.\n• Na Malcie zadzwoń pod 119 lub udaj się na komisariat.",
      mt: "Rapport tal-Pulizija:\n• Trid tirrapporta inċident jekk hemm feruti jew jekk is-sewwieq l-ieħor ma jagħtix id-dettalji tiegħu.\n• F'Malta, ċempel 119 (pulizija mhux emerġenza) jew mur l-eqreb stazzjon tal-pulizija. Rapport formali meħtieġ jekk hemm korrimenti.",
    },
  },
  {
    keywords: [
      "time limit",
      "deadline",
      "how long",
      "too late",
      "limitation",
      "prescription",
      "plazo",
      "límite",
      "caducidad",
      "termin",
      "przedawnienie",
      "limitu",
      "skadenza",
      "kemm",
    ],
    answer: {
      en: "Time limits for making a claim:\n• UK personal injury: 3 years from the date of accident (Limitation Act 1980)\n• UK property damage: 6 years from the date of accident\n• Malta personal injury and property damage: 2 years (Civil Code Art. 2153)\n\nDo not delay — gather evidence and start your claim as soon as possible. The Statute of Limitations countdown tool in your report tracks this automatically.",
      es: "Plazos para reclamar:\n• UK daños personales: 3 años desde el accidente (Limitation Act 1980)\n• UK daños materiales: 6 años\n• Malta daños personales y materiales: 2 años (Código Civil Art. 2153)\n\nNo demores — recoge pruebas e inicia la reclamación lo antes posible.",
      pl: "Terminy przedawnienia:\n• UK obrażenia osobiste: 3 lata od wypadku (Limitation Act 1980)\n• UK szkody majątkowe: 6 lat\n• Malta obrażenia i szkody majątkowe: 2 lata (Kodeks Cywilny Art. 2153)\n\nNie zwlekaj — zbieraj dowody i złóż roszczenie jak najszybciej.",
      mt: "Limiti ta' żmien:\n• UK korrimenti personali: 3 snin mid-data tal-inċident (Limitation Act 1980)\n• UK ħsarat fil-proprjetà: 6 snin\n• Malta korrimenti u ħsarat fil-proprjetà: 2 snin (Kodiċi Ċivili Art. 2153)\n\nTdewwimx — iġbor evidenza u ibda t-talba tiegħek kemm jista' jkun malajr.",
    },
  },
];

const FALLBACK_DEFAULT: Record<"en" | "es" | "pl" | "mt", string> = {
  en: "I'm currently unable to reach the AI assistant. Here are some things I can help with — just ask:\n• What to do right after an accident\n• Who is at fault\n• How to claim compensation\n• How to fill in the form\n• Time limits for making a claim\n• Reporting to the police or insurers",
  es: "En este momento no puedo conectar con el asistente. Puedo ayudarte con:\n• Qué hacer justo después de un accidente\n• Quién tiene la culpa\n• Cómo reclamar compensación\n• Cómo rellenar el formulario\n• Plazos para reclamar\n• Cómo reportar a la policía o aseguradoras",
  pl: "Nie mogę teraz połączyć się z asystentem AI. Mogę pomóc w kwestiach:\n• Co zrobić tuż po wypadku\n• Kto jest winny\n• Jak ubiegać się o odszkodowanie\n• Jak wypełnić formularz\n• Terminy roszczeń\n• Jak zgłosić policji lub ubezpieczycielowi",
  mt: "Bħalissa ma nistax nilħaq l-assistent AI. Nista' ngħinek b'dawn:\n• X'tagħmel eżatt wara inċident\n• Min hu ħati\n• Kif titlob kumpens\n• Kif timla l-formola\n• Limiti ta' żmien\n• Kif tirrapporta lill-pulizija jew assiguratur",
};

function getSmartFallback(
  question: string,
  language: string,
  jurisdiction: "UK" | "Malta",
): string {
  const lang =
    (language as "en" | "es" | "pl" | "mt") in FALLBACK_DEFAULT
      ? (language as "en" | "es" | "pl" | "mt")
      : "en";

  const q = question.toLowerCase();

  for (const entry of FALLBACK_RESPONSES) {
    if (entry.keywords.some((kw) => q.includes(kw))) {
      let answer = entry.answer[lang];
      if (jurisdiction === "Malta" && entry.mtExtra) {
        answer += `\n\n⚖️ ${entry.mtExtra}`;
      } else if (jurisdiction === "UK" && entry.ukExtra) {
        answer += `\n\n⚖️ ${entry.ukExtra}`;
      }
      const offlineNotice: Record<"en" | "es" | "pl" | "mt", string> = {
        en: "\n\n_(Offline guidance — AI unavailable)_",
        es: "\n\n_(Orientación sin conexión — IA no disponible)_",
        pl: "\n\n_(Wskazówki offline — AI niedostępne)_",
        mt: "\n\n_(Gwida offline — AI mhux disponibbli)_",
      };
      return answer + offlineNotice[lang];
    }
  }

  return FALLBACK_DEFAULT[lang];
}

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

function buildSystemPrompt(
  jurisdiction: "UK" | "Malta",
  language: string,
  report: Partial<AccidentReport> | null,
  claimId: string | null,
): string {
  const langName: Record<string, string> = {
    en: "English",
    es: "Español",
    pl: "Polski",
    mt: "Malti",
  };
  const langLabel = langName[language] ?? "English";

  let reportCtx = "";
  if (report) {
    const crashType =
      report.aiAnalysisResult?.inferredCrashType || "unknown crash type";
    const pA =
      report.party1Liability != null ? Number(report.party1Liability) : null;
    const pB =
      report.party2Liability != null ? Number(report.party2Liability) : null;
    const faultInfo =
      pA != null && pB != null
        ? `Party A ${pA}% / Party B ${pB}%`
        : "fault split not yet assessed";
    const id = claimId || "unassigned";
    reportCtx = `Active claim: ${id}, crash: ${crashType}, fault: ${faultInfo}.`;
  }

  const legalRefs =
    jurisdiction === "Malta"
      ? "Refer to TRO Cap. 65, Civil Code Cap. 16, Malta Road Code, and Civil Code Art. 2153 (2-year prescription)."
      : "Refer to Highway Code, Road Traffic Act 1988, WRP 2021, CPR Pre-Action Protocol, and Limitation Act 1980.";

  const solicitorNote =
    jurisdiction === "Malta"
      ? "Recommend consulting a qualified avukat (advocate) for formal legal advice."
      : "Recommend consulting a qualified solicitor for formal legal advice.";

  return [
    `You are a legal accident documentation assistant for the iamthe.law app. Jurisdiction: ${jurisdiction}. Respond ONLY in ${langLabel}.`,
    reportCtx,
    "Help users document accidents, understand legal rights, assess fault, and navigate claims. Keep answers concise and compassionate.",
    legalRefs,
    solicitorNote,
  ]
    .filter(Boolean)
    .join(" ");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatAssistant() {
  const { country } = useCountry();
  const { language, t } = useLanguage();
  const jurisdiction = country === "mt" ? "Malta" : "UK";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulseShown, setPulseShown] = useState(false);

  const [reportContext, setReportContext] =
    useState<Partial<AccidentReport> | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load report context from localStorage on open
  useEffect(() => {
    if (!open) return;
    try {
      const draft = localStorage.getItem("iamthelaw_draft");
      if (draft) {
        const parsed = JSON.parse(draft) as Partial<AccidentReport> & {
          claimId?: string;
        };
        setReportContext(parsed);
        if ((parsed as { claimId?: string }).claimId) {
          setClaimId((parsed as { claimId?: string }).claimId ?? null);
        }
        return;
      }
      const reportsRaw = localStorage.getItem("iamthelaw_reports");
      if (reportsRaw) {
        const reports = JSON.parse(reportsRaw) as Array<
          Partial<AccidentReport> & { claimId?: string }
        >;
        if (reports.length > 0) {
          const last = reports[reports.length - 1];
          setReportContext(last);
          if (last.claimId) setClaimId(last.claimId);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [open]);

  // Check if pulse animation was already shown
  useEffect(() => {
    const shown = localStorage.getItem("iamthelaw_chat_pulse_shown");
    if (!shown) setPulseShown(true);
  }, []);

  const dismissPulse = () => {
    setPulseShown(false);
    localStorage.setItem("iamthelaw_chat_pulse_shown", "1");
  };

  // Auto-scroll on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollRef is stable
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, loading]);

  const startNewChat = () => {
    setMessages([]);
    setInput("");
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = buildSystemPrompt(
      jurisdiction,
      language,
      reportContext,
      claimId,
    );

    try {
      const res = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "anthropic/bedrock/claude-sonnet-4-6",
          messages: [
            { role: "system", content: systemPrompt },
            ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "(no body)");
        console.error("Chat API error", res.status, errText);
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const reply: string =
        data?.choices?.[0]?.message?.content ?? t("chat.error");
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat send error:", err);
      // Use smart fallback instead of generic error
      const fallbackReply = getSmartFallback(trimmed, language, jurisdiction);
      setMessages([
        ...nextMessages,
        { role: "assistant", content: fallbackReply, isFallback: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const quickPrompts = [
    t("chat.prompt1"),
    t("chat.prompt2"),
    t("chat.prompt3"),
    t("chat.prompt4"),
  ];

  const hasReportContext = !!reportContext;

  return (
    <>
      {/* Floating button */}
      <div
        className="fixed bottom-6 right-6 z-50 sm:bottom-6 sm:right-6 bottom-20 right-4"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute bottom-16 right-0 w-[92vw] max-w-sm rounded-2xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col overflow-hidden"
              style={{ height: "480px" }}
              data-ocid="chat.panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {t("chat.panel_title")}
                  </span>
                  {hasReportContext && claimId && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                    >
                      {t("chat.aware_of_report")} {claimId}
                    </Badge>
                  )}
                  {hasReportContext && !claimId && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                    >
                      {t("chat.aware_of_report")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground"
                    onClick={startNewChat}
                    title={t("chat.new_chat")}
                    data-ocid="chat.secondary_button"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground"
                    onClick={() => setOpen(false)}
                    data-ocid="chat.close_button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea
                className="flex-1 px-4 py-3"
                ref={scrollRef as React.Ref<HTMLDivElement>}
              >
                {messages.length === 0 && !loading && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center">
                      {t("chat.panel_title")} — {jurisdiction}{" "}
                      {jurisdiction === "Malta" ? "🇲🇹" : "🇬🇧"}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="text-left text-xs px-3 py-2 rounded-lg border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                          data-ocid="chat.button"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: messages have no stable id
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : msg.isFallback
                              ? "bg-amber-50 border border-amber-200 text-foreground rounded-bl-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-muted-foreground">
                        {t("chat.thinking")}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="px-3 py-3 border-t border-border bg-card shrink-0">
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("chat.placeholder")}
                    className="min-h-[40px] max-h-[100px] resize-none text-sm bg-background"
                    rows={1}
                    disabled={loading}
                    data-ocid="chat.textarea"
                  />
                  <Button
                    size="icon"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="shrink-0 h-9 w-9"
                    data-ocid="chat.submit_button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger button */}
        <div className="relative">
          {pulseShown && !open && (
            <span className="absolute inset-0 rounded-full bg-primary opacity-40 animate-ping" />
          )}
          <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 relative"
            onClick={() => {
              setOpen((v) => !v);
              if (pulseShown) dismissPulse();
            }}
            title={t("chat.button_label")}
            data-ocid="chat.open_modal_button"
          >
            {open ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

export default ChatAssistant;

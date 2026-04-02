import type { AccidentReport } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import { useLanguage } from "../contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
    const hasInjuries =
      report.witnesses && report.witnesses.length > 0
        ? `${report.witnesses.length} witness(es) recorded`
        : "no injuries recorded";
    const id = claimId || "unassigned";
    reportCtx = `The user has an active report: Claim ID ${id}, crash type: ${crashType}, fault split: ${faultInfo}, ${hasInjuries}. Reference this context when relevant.`;
  }

  const ukRefs =
    "For UK: reference Highway Code, Road Traffic Act 1988, WRP 2021, CPR Pre-Action Protocol, Limitation Act 1980, Contributory Negligence Act 1945.";
  const mtRefs =
    "For Malta: reference Traffic Regulation Ordinance Cap. 65, Civil Code Cap. 16, Malta Road Code (Transport Malta), EU Motor Insurance Directive 2009/103/EC, and the 2-year prescription period under Civil Code Art. 2153.";

  const solicitorNote =
    jurisdiction === "Malta"
      ? "Always recommend consulting a qualified avukat (advocate) for formal legal advice."
      : "Always recommend consulting a qualified solicitor for formal legal advice.";

  return [
    "You are a legal accident documentation assistant for the iamthe.law app.",
    "You help users document road accidents, understand their legal rights, and navigate the claims process.",
    `Jurisdiction: ${jurisdiction}`,
    `Language: ${langLabel}. Respond ONLY in ${langLabel}.`,
    reportCtx,
    "Answer questions about what to do after an accident, legal rights, fault, compensation, and how to use this app.",
    jurisdiction === "UK" ? ukRefs : mtRefs,
    "Keep answers concise, practical, and compassionate — users may have just had an accident.",
    solicitorNote,
  ]
    .filter(Boolean)
    .join(" ");
}

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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const reply: string =
        data?.choices?.[0]?.message?.content ?? t("chat.error");
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: t("chat.error") },
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
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
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

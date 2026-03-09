import type { AccidentReport } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, Download, Send, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { InsurerContact } from "../pages/InsurerContactsPage";

interface InsurerContactsPanelProps {
  reportId: bigint;
  report: AccidentReport;
}

const STORAGE_KEY = "insurer_contacts";
const POLICE_INFO_DELIMITER = "---POLICE_INFO---\n";

function loadContacts(): InsurerContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InsurerContact[];
  } catch {
    return [];
  }
}

function parsePoliceInfo(
  accidentMarker: string,
): { policeRef: string; officerName: string } | null {
  const idx = accidentMarker.indexOf(POLICE_INFO_DELIMITER);
  if (idx === -1) return null;
  try {
    const json = accidentMarker
      .slice(idx + POLICE_INFO_DELIMITER.length)
      .trim();
    return JSON.parse(json) as { policeRef: string; officerName: string };
  } catch {
    return null;
  }
}

function stripPoliceInfo(marker: string): string {
  const idx = marker.indexOf(POLICE_INFO_DELIMITER);
  if (idx === -1) return marker;
  const trimIdx = marker.lastIndexOf("\n", idx - 1);
  return trimIdx > 0
    ? marker.slice(0, trimIdx).trim()
    : marker.slice(0, idx).trim();
}

function buildClaimSummary(
  reportId: bigint,
  report: AccidentReport,
  insurer: InsurerContact,
): string {
  const generated = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  const policeInfo = report.accidentMarker
    ? parsePoliceInfo(report.accidentMarker)
    : null;
  const cleanMarker = report.accidentMarker
    ? stripPoliceInfo(report.accidentMarker)
    : "";

  const lines: string[] = [];

  // Addressee block
  lines.push("WITHOUT PREJUDICE SAVE AS TO COSTS");
  lines.push("");
  lines.push(`To: ${insurer.insurerName}`);
  if (insurer.claimContactName) lines.push(`Attn: ${insurer.claimContactName}`);
  if (insurer.address) lines.push(`Address: ${insurer.address}`);
  if (insurer.phone) lines.push(`Tel: ${insurer.phone}`);
  if (insurer.notes) lines.push(`Notes: ${insurer.notes}`);
  lines.push("");
  lines.push(`Date: ${generated}`);
  lines.push(`Claim Reference: REPORT #${reportId.toString()}`);
  lines.push("═══════════════════════════════════════════════════════");
  lines.push("");

  // Section 1 — Incident summary
  lines.push("RE: ROAD TRAFFIC ACCIDENT CLAIM");
  lines.push("");
  const incidentDate = report.timestamp
    ? new Date(Number(report.timestamp)).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Date not recorded";
  lines.push(`Incident Date/Time: ${incidentDate}`);
  if (cleanMarker) lines.push(`Incident Location: ${cleanMarker}`);
  lines.push("");

  // Section 2 — Claimant vehicle
  lines.push("1. CLAIMANT VEHICLE DETAILS");
  const vi = report.vehicleInfo;
  if (vi) {
    if (vi.make || vi.model)
      lines.push(
        `  Make / Model: ${[vi.make, vi.model].filter(Boolean).join(" ")}`,
      );
    if (vi.colour) lines.push(`  Colour: ${vi.colour}`);
    if (vi.licencePlate) lines.push(`  Licence Plate: ${vi.licencePlate}`);
    if (vi.year && Number(vi.year) > 0)
      lines.push(`  Year: ${Number(vi.year)}`);
    if (vi.mot) lines.push(`  MOT: ${vi.mot}`);
  } else {
    lines.push("  Vehicle details not recorded.");
  }
  lines.push("");

  // Section 3 — Other vehicle
  const ov = report.otherVehicle;
  if (ov && (ov.make || ov.model || ov.licencePlate || ov.ownerName)) {
    lines.push("2. THIRD PARTY VEHICLE DETAILS");
    if (ov.make || ov.model)
      lines.push(
        `  Make / Model: ${[ov.make, ov.model].filter(Boolean).join(" ")}`,
      );
    if (ov.colour) lines.push(`  Colour: ${ov.colour}`);
    if (ov.licencePlate) lines.push(`  Licence Plate: ${ov.licencePlate}`);
    if (ov.ownerName) lines.push(`  Driver / Owner: ${ov.ownerName}`);
    if (ov.phone) lines.push(`  Phone: ${ov.phone}`);
    if (ov.insurer) lines.push(`  Their Insurer: ${ov.insurer}`);
    if (ov.insurancePolicyNumber)
      lines.push(`  Their Policy No.: ${ov.insurancePolicyNumber}`);
    if (ov.claimReference)
      lines.push(`  Their Claim Ref: ${ov.claimReference}`);
    lines.push("");
  }

  // Section 4 — Conditions
  const sur = report.surroundings;
  if (sur) {
    lines.push("3. CONDITIONS AT TIME OF INCIDENT");
    if (sur.weather) lines.push(`  Weather: ${sur.weather}`);
    if (sur.roadCondition) lines.push(`  Road Condition: ${sur.roadCondition}`);
    if (sur.visibility) lines.push(`  Visibility: ${sur.visibility}`);
    if (report.vehicleSpeed != null)
      lines.push(`  Recorded Speed: ${Number(report.vehicleSpeed)} mph`);
    if (report.stopLocation)
      lines.push(`  Stop Location: ${report.stopLocation}`);
    lines.push("");
  }

  // Section 5 — Damage
  if (report.damageDescription) {
    lines.push("4. DAMAGE DESCRIPTION");
    lines.push(`  ${report.damageDescription}`);
    lines.push("");
  }

  // Damage severity from structured data
  const ds = report.damageSeverity;
  if (ds) {
    lines.push("5. DAMAGE SEVERITY ASSESSMENT");
    lines.push(
      `  Severity: ${ds.severityLabel} (${Number(ds.priorityScore)}/10)`,
    );
    lines.push(`  Total Loss Probability: ${Number(ds.totalLossProbability)}%`);
    if (ds.vehicleZones && ds.vehicleZones.length > 0) {
      lines.push("  Zones Affected:");
      for (const zone of ds.vehicleZones) {
        lines.push(
          `    - ${zone.zone}: ${Number(zone.score)}/10 — ${zone.damageType}`,
        );
      }
    }
    lines.push("");
  }

  // Section 6 — Violations
  if (report.violations && report.violations.length > 0) {
    lines.push("6. TRAFFIC VIOLATIONS RECORDED");
    for (const v of report.violations) {
      lines.push(`  • [${v.violationType}] ${v.description}`);
    }
    lines.push("");
  }

  // Section 7 — Fault assessment
  const fla = report.faultLikelihoodAssessment;
  if (fla) {
    lines.push("7. LIABILITY ASSESSMENT");
    lines.push(`  Party A (Claimant): ${Number(fla.partyAPercentage)}%`);
    lines.push(`  Party B (Third Party): ${Number(fla.partyBPercentage)}%`);
    if (fla.reasoning) lines.push(`  Basis: ${fla.reasoning}`);
    if (fla.roadPositionImpact)
      lines.push(`  Road Position Impact: ${fla.roadPositionImpact}`);
    lines.push("");
  } else if (report.party1Liability != null && report.party2Liability != null) {
    lines.push("7. LIABILITY ASSESSMENT");
    lines.push(`  Party A (Claimant): ${Number(report.party1Liability)}%`);
    lines.push(`  Party B (Third Party): ${Number(report.party2Liability)}%`);
    if (report.faultReasoning) lines.push(`  Basis: ${report.faultReasoning}`);
    lines.push("");
  }

  // Section 8 — Witness statement
  if (report.witnessStatement) {
    lines.push("8. WITNESS STATEMENT");
    lines.push(`  ${report.witnessStatement}`);
    lines.push("");
  }

  // Structured witnesses
  if (report.witnesses && report.witnesses.length > 0) {
    lines.push("9. WITNESS DETAILS");
    for (const w of report.witnesses) {
      lines.push(`  Name: ${w.name || "—"}`);
      if (w.phone) lines.push(`  Phone: ${w.phone}`);
      if (w.address) lines.push(`  Address: ${w.address}`);
      if (w.statement) lines.push(`  Statement: ${w.statement}`);
      lines.push("");
    }
  }

  // Section 10 — AI narrative
  const narrativeText =
    report.accidentNarrative?.narrativeText ??
    report.aiAnalysisResult?.narrativeText;
  if (narrativeText) {
    lines.push("10. AI-ASSISTED ACCIDENT NARRATIVE");
    lines.push(narrativeText);
    lines.push("");
  }

  // Section 11 — Photo analysis
  const photoAnalysis = report.aiAnalysisResult?.photoAnalysis;
  if (photoAnalysis) {
    lines.push("11. PHOTO EVIDENCE ANALYSIS");
    lines.push(photoAnalysis);
    lines.push("");
  }

  // Section 12 — Police info
  if (policeInfo && (policeInfo.policeRef || policeInfo.officerName)) {
    lines.push("12. POLICE INFORMATION");
    if (policeInfo.policeRef)
      lines.push(`  Police Reference No.: ${policeInfo.policeRef}`);
    if (policeInfo.officerName)
      lines.push(`  Attending Officer: ${policeInfo.officerName}`);
    lines.push("");
  }

  lines.push("───────────────────────────────────────────────────────");
  lines.push(
    "This document was prepared using the Legal Accident Documentation App.",
  );
  lines.push("For legal advice, please consult a qualified solicitor.");

  return lines.join("\n");
}

export default function InsurerContactsPanel({
  reportId,
  report,
}: InsurerContactsPanelProps) {
  const [contacts] = useState<InsurerContact[]>(loadContacts);
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Re-read contacts from localStorage when component mounts in case they were
  // added on the Insurers page earlier in the session.
  const [liveContacts, setLiveContacts] = useState<InsurerContact[]>(contacts);
  useEffect(() => {
    setLiveContacts(loadContacts());
  }, []);

  const selectedInsurer = useMemo(
    () => liveContacts.find((c) => c.id === selectedId) ?? null,
    [liveContacts, selectedId],
  );

  const summaryText = useMemo(() => {
    if (!selectedInsurer) return "";
    return buildClaimSummary(reportId, report, selectedInsurer);
  }, [reportId, report, selectedInsurer]);

  const handleCopy = async () => {
    if (!summaryText) return;
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Clipboard API fallback
      const el = document.createElement("textarea");
      el.value = summaryText;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summaryText) return;
    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim-report-${reportId.toString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-primary/30 shadow-sm" data-print-hide>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Send size={16} className="text-primary" />
          Share &amp; Send to Insurer
        </CardTitle>
        <p className="text-xs text-muted-foreground pt-0.5">
          Generate a formal claim summary addressed to your saved insurer. Copy
          or download and send it directly.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Insurer selector */}
        {liveContacts.length === 0 ? (
          <div
            className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground flex items-center gap-2"
            data-ocid="share.panel"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>
              No insurers saved — add one on the{" "}
              <a
                href="/insurers"
                className="underline text-primary hover:opacity-80 transition-opacity"
              >
                Insurers
              </a>{" "}
              page.
            </span>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label
                htmlFor="insurer-select"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Select Insurer
              </label>
              <select
                id="insurer-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                data-ocid="share.select"
              >
                <option value="">Select an insurer…</option>
                {liveContacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.insurerName}
                    {c.claimContactName ? ` — ${c.claimContactName}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedInsurer && (
              <>
                <Separator />

                {/* Summary textarea */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="claim-summary-text"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    Formal Claim Summary
                  </label>
                  <Textarea
                    id="claim-summary-text"
                    value={summaryText}
                    readOnly
                    rows={12}
                    className="font-mono text-xs resize-y bg-muted/40 focus:bg-background transition-colors"
                    data-ocid="share.textarea"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap" data-print-hide>
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 flex-1 sm:flex-none"
                    data-ocid="share.primary_button"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-300" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2 flex-1 sm:flex-none"
                    data-ocid="share.secondary_button"
                  >
                    <Download size={14} />
                    Download .txt
                  </Button>
                </div>

                {copied && (
                  <output
                    className="text-xs text-green-600 dark:text-green-400 block"
                    aria-live="polite"
                    data-ocid="share.success_state"
                  >
                    ✓ Summary copied to clipboard — ready to paste into an email
                    or message.
                  </output>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

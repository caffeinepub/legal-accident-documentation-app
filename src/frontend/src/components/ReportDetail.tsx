import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Camera,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Scale,
  ScanSearch,
  Shield,
  Trash2,
  Video,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { AccidentReport } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import {
  type ClaimStatus,
  STATUS_CONFIG,
  getReportStatus,
  setReportStatus,
} from "../utils/reportStatus";
import AIConsistencyChecker from "./AIConsistencyChecker";
import AccidentNarrativePanel from "./AccidentNarrativePanel";
import ClaimSummaryPanel from "./ClaimSummaryPanel";
import ContributoryNegligencePanel from "./ContributoryNegligencePanel";
import DamageSeverityPanel from "./DamageSeverityPanel";
import DashCamAnalysisPanel from "./DashCamAnalysisPanel";
import DashCamGallery from "./DashCamGallery";
import DemandLetterPanel from "./DemandLetterPanel";
import DiscrepancyAlert from "./DiscrepancyAlert";
import ExportReportPanel from "./ExportReportPanel";
import FaultLikelihoodPanel from "./FaultLikelihoodPanel";
import FaultMatrixPanel from "./FaultMatrixPanel";
import InjuryAnalysisPanel from "./InjuryAnalysisPanel";
import InjuryProgressionTracker from "./InjuryProgressionTracker";
import LegalReferencePanel from "./LegalReferencePanel";
import LiabilityDisplay from "./LiabilityDisplay";
import NegotiationLetterBuilder from "./NegotiationLetterBuilder";
import NextStepsPanel from "./NextStepsPanel";
import PhotoGallery from "./PhotoGallery";
import PostIncidentChecklist from "./PostIncidentChecklist";
import PreActionProtocolPanel from "./PreActionProtocolPanel";
import RepairCostEstimatorPanel from "./RepairCostEstimatorPanel";
import StatuteLimitationsPanel from "./StatuteLimitationsPanel";
import SubmissionCredibilityBadge from "./SubmissionCredibilityBadge";
import TrafficSignsDisplay from "./TrafficSignsDisplay";
import ViolationsDisplay from "./ViolationsDisplay";
import WhiplashClassifierPanel from "./WhiplashClassifierPanel";

interface ReportDetailProps {
  reportId: bigint;
  report: AccidentReport;
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              </div>
              {open ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

const POLICE_INFO_DELIMITER = "---POLICE_INFO---\n";

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

function stripPoliceInfo(accidentMarker: string): string {
  const idx = accidentMarker.indexOf(
    `\n\n${POLICE_INFO_DELIMITER.trimStart()}`,
  );
  if (idx === -1) {
    const idx2 = accidentMarker.indexOf(POLICE_INFO_DELIMITER);
    if (idx2 === -1) return accidentMarker;
    return accidentMarker.slice(0, idx2).trim();
  }
  return accidentMarker.slice(0, idx).trim();
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ClaimStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── GDPR / Data & Privacy Panel ─────────────────────────────────────────────
function GdprPanel({ reportId }: { reportId: string }) {
  const { t } = useLanguage();
  const [evidenceDeleted, setEvidenceDeleted] = useState(false);
  const [reportDeleted, setReportDeleted] = useState(false);
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleDeleteEvidence = () => {
    // Clear photo/dashcam blobs from localStorage for this report key
    const keys = Object.keys(localStorage).filter(
      (k) =>
        k.startsWith(`report_${reportId}_photo`) ||
        k.startsWith(`report_${reportId}_dashcam`) ||
        k.startsWith(`injury_photos_${reportId}`) ||
        k.includes(`injuryPhotos_${reportId}`),
    );
    for (const k of keys) localStorage.removeItem(k);
    setEvidenceDeleted(true);
    setEvidenceDialogOpen(false);
  };

  const handleDeleteReport = () => {
    // Remove all keys related to this report
    const keys = Object.keys(localStorage).filter((k) => k.includes(reportId));
    for (const k of keys) localStorage.removeItem(k);
    setReportDeleted(true);
    setReportDialogOpen(false);
  };

  if (reportDeleted) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Report deleted from local storage.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Storage notice */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm space-y-1">
        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">{t("gdpr.title")}</p>
            <p className="text-muted-foreground mt-1">
              {t("gdpr.data_stored_locally")}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Delete evidence files */}
        <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-950/30"
              disabled={evidenceDeleted}
              data-ocid="gdpr.delete_evidence.button"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {evidenceDeleted ? "Evidence Cleared" : t("gdpr.delete_evidence")}
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="gdpr.delete_evidence.dialog">
            <DialogHeader>
              <DialogTitle>{t("gdpr.delete_evidence")}</DialogTitle>
              <DialogDescription>
                {t("gdpr.delete_evidence_confirm")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEvidenceDialogOpen(false)}
                data-ocid="gdpr.delete_evidence.cancel_button"
              >
                {t("action.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteEvidence}
                data-ocid="gdpr.delete_evidence.confirm_button"
              >
                {t("action.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete entire report */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
              data-ocid="gdpr.delete_report.button"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("gdpr.delete_report")}
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="gdpr.delete_report.dialog">
            <DialogHeader>
              <DialogTitle>{t("gdpr.delete_report")}</DialogTitle>
              <DialogDescription>
                {t("gdpr.delete_report_confirm")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReportDialogOpen(false)}
                data-ocid="gdpr.delete_report.cancel_button"
              >
                {t("action.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteReport}
                data-ocid="gdpr.delete_report.confirm_button"
              >
                {t("action.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function ReportDetail({ reportId, report }: ReportDetailProps) {
  const { t } = useLanguage();
  const reportIdStr = reportId.toString();

  const [status, setStatusState] = useState<ClaimStatus>(() =>
    getReportStatus(reportIdStr),
  );

  const handleStatusChange = (val: ClaimStatus) => {
    setStatusState(val);
    setReportStatus(reportIdStr, val);
  };

  const primaryViolation =
    report.violations && report.violations.length > 0
      ? report.violations[0].violationType
      : undefined;

  const photoAnalysis = report.aiAnalysisResult?.photoAnalysis ?? "";
  const dashCamAnalysisText = report.aiAnalysisResult?.dashCamAnalysis ?? "";
  const evidenceGaps = report.aiAnalysisResult?.evidenceGaps ?? [];

  const policeInfo = report.accidentMarker
    ? parsePoliceInfo(report.accidentMarker)
    : null;
  const cleanAccidentMarker = report.accidentMarker
    ? stripPoliceInfo(report.accidentMarker)
    : "";

  const evidenceTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      photo: "Photo",
      video: "Video",
      witness_statement: "Witness",
      gps_data: "GPS",
    };
    return map[type] ?? type;
  };

  const hasFootage = report.dashCamFootage && report.dashCamFootage.length > 0;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Report header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Report #{reportId.toString()}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(Number(report.timestamp)).toLocaleString("en-GB")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Claim status badge */}
          <StatusBadge status={status} />
          {report.isAtFault && <Badge variant="destructive">At Fault</Badge>}
          {report.isRedLightViolation && (
            <Badge variant="destructive">Red Light</Badge>
          )}
          {!report.isAtFault && !report.isRedLightViolation && (
            <Badge variant="secondary">No Fault</Badge>
          )}
        </div>
      </div>

      {/* Claim Status Tracker */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground shrink-0">
              {t("status.label")}:
            </span>
            <Select
              value={status}
              onValueChange={(v) => handleStatusChange(v as ClaimStatus)}
            >
              <SelectTrigger
                className="w-40 h-8 text-xs"
                data-ocid="report.status.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("status.draft")}</SelectItem>
                <SelectItem value="submitted">
                  {t("status.submitted")}
                </SelectItem>
                <SelectItem value="under_review">
                  {t("status.under_review")}
                </SelectItem>
                <SelectItem value="settled">{t("status.settled")}</SelectItem>
              </SelectContent>
            </Select>
            {/* Visual pipeline */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              {(
                [
                  "draft",
                  "submitted",
                  "under_review",
                  "settled",
                ] as ClaimStatus[]
              ).map((s, i) => (
                <span key={s} className="flex items-center gap-1">
                  {i > 0 && <span className="text-border">›</span>}
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      s === status
                        ? "bg-primary/10 text-primary font-semibold"
                        : ""
                    }`}
                  >
                    {STATUS_CONFIG[s].label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust & Credibility Badge */}
      <SubmissionCredibilityBadge
        witnessStatement={report.witnessStatement ?? ""}
        timestamp={report.timestamp}
        reportId={reportId}
      />

      {/* Export Claim Report */}
      <ExportReportPanel reportId={reportId} report={report} />

      {/* AI Core Panels */}
      <AccidentNarrativePanel
        reportId={reportId}
        report={report}
        narrative={report.accidentNarrative}
      />
      <DamageSeverityPanel
        reportId={reportId}
        report={report}
        damageSeverity={report.damageSeverity}
      />
      <FaultLikelihoodPanel
        reportId={reportId}
        report={report}
        faultLikelihoodAssessment={report.faultLikelihoodAssessment}
      />

      {/* AI Enhancements */}
      <WhiplashClassifierPanel
        reportId={reportId}
        injuryDescription={report.damageDescription}
      />
      <RepairCostEstimatorPanel
        damageSeverity={report.damageSeverity}
        crashType={report.aiAnalysisResult?.inferredCrashType}
      />

      {/* Legal & Insurance Utility */}
      <CollapsibleSection
        title="Legal & Insurance Utility"
        icon={Scale}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <DemandLetterPanel report={report} />
          <NegotiationLetterBuilder report={report} reportId={reportId} />
          <PreActionProtocolPanel />
          <PostIncidentChecklist />
          <StatuteLimitationsPanel
            accidentDate={
              report.timestamp ? new Date(Number(report.timestamp)) : undefined
            }
          />
        </div>
      </CollapsibleSection>

      {/* Photo AI Analysis */}
      {photoAnalysis && (
        <CollapsibleSection title="Photo AI Analysis" icon={Camera} defaultOpen>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {photoAnalysis}
          </p>
        </CollapsibleSection>
      )}

      {/* Dash Cam Cross-Analysis */}
      {dashCamAnalysisText && (
        <CollapsibleSection
          title="Dash Cam Cross-Analysis"
          icon={Video}
          defaultOpen
        >
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {dashCamAnalysisText}
          </p>
        </CollapsibleSection>
      )}

      {/* Evidence Gaps */}
      {evidenceGaps.length > 0 && (
        <CollapsibleSection
          title="Evidence Gaps Detected"
          icon={AlertTriangle}
          defaultOpen
        >
          <ul className="space-y-2">
            {evidenceGaps.map((gap) => (
              <li
                key={gap.description}
                className="flex items-start gap-2 text-sm"
              >
                <Badge
                  variant="outline"
                  className="shrink-0 text-xs border-amber-500 text-amber-700 dark:text-amber-400"
                >
                  {evidenceTypeLabel(gap.evidenceType)}
                </Badge>
                <span className="text-muted-foreground">{gap.description}</span>
                <span className="ml-auto text-xs text-muted-foreground shrink-0">
                  {Number(gap.confidenceLevel)}% confidence
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}

      {/* Claim Summary */}
      <ClaimSummaryPanel
        reportId={reportId}
        aiAnalysisResult={report.aiAnalysisResult}
      />

      {/* Liability */}
      {report.party1Liability != null && report.party2Liability != null && (
        <LiabilityDisplay
          party1Liability={report.party1Liability}
          party2Liability={report.party2Liability}
        />
      )}

      {/* Violations */}
      {report.violations && report.violations.length > 0 && (
        <ViolationsDisplay violations={report.violations} />
      )}

      {/* Traffic Signs */}
      {report.trafficSigns && report.trafficSigns.length > 0 && (
        <TrafficSignsDisplay signs={report.trafficSigns} />
      )}

      {/* Discrepancy Alert */}
      {report.trafficSignalState && (
        <DiscrepancyAlert
          trafficSignalState={report.trafficSignalState}
          isRedLightViolation={report.isRedLightViolation}
        />
      )}

      {/* Photos */}
      {((report.imageData && report.imageData.length > 0) ||
        (report.photos && report.photos.length > 0)) && (
        <CollapsibleSection
          title="Accident Scene Photos"
          icon={Camera}
          defaultOpen
        >
          <PhotoGallery photos={report.photos} imageData={report.imageData} />
        </CollapsibleSection>
      )}

      {/* Dash Cam Footage */}
      {hasFootage && (
        <CollapsibleSection title="Dash Cam Footage" icon={Video} defaultOpen>
          <DashCamGallery footage={report.dashCamFootage} />
        </CollapsibleSection>
      )}

      {/* Dash Cam Analysis Panel */}
      <DashCamAnalysisPanel
        analysis={report.dashCamAnalysis ?? null}
        hasFootage={!!hasFootage}
        isAnalysing={false}
        onAnalyse={() => {}}
      />

      {/* Injury Analysis */}
      <InjuryAnalysisPanel reportId={reportId} />
      <InjuryProgressionTracker reportId={reportId} />

      {/* Legal Reference */}
      <LegalReferencePanel violations={report.violations} />

      {/* Fault Matrix */}
      <FaultMatrixPanel violationType={primaryViolation} />

      {/* Contributory Negligence */}
      <ContributoryNegligencePanel
        faultLikelihoodAssessment={report.faultLikelihoodAssessment}
      />

      {/* Next Steps */}
      <NextStepsPanel />

      {/* Vehicle Info */}
      <CollapsibleSection title="Vehicle Information" icon={FileText}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Make / Model</div>
          <div>
            {report.vehicleInfo?.make} {report.vehicleInfo?.model}
          </div>
          <div className="text-muted-foreground">Colour</div>
          <div>{report.vehicleInfo?.colour || "\u2014"}</div>
          <div className="text-muted-foreground">Licence Plate</div>
          <div>{report.vehicleInfo?.licencePlate || "\u2014"}</div>
          <div className="text-muted-foreground">Year</div>
          <div>
            {report.vehicleInfo?.year
              ? Number(report.vehicleInfo.year)
              : "\u2014"}
          </div>
          <div className="text-muted-foreground">MOT</div>
          <div>{report.vehicleInfo?.mot || "\u2014"}</div>
          <div className="text-muted-foreground">Registration</div>
          <div>{report.vehicleInfo?.registration || "\u2014"}</div>
        </div>
      </CollapsibleSection>

      {/* Other Vehicle */}
      {report.otherVehicle && (
        <CollapsibleSection title="Other Vehicle" icon={FileText}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Make / Model</div>
            <div>
              {report.otherVehicle.make} {report.otherVehicle.model}
            </div>
            <div className="text-muted-foreground">Owner</div>
            <div>{report.otherVehicle.ownerName || "\u2014"}</div>
            <div className="text-muted-foreground">Licence Plate</div>
            <div>{report.otherVehicle.licencePlate || "\u2014"}</div>
            <div className="text-muted-foreground">Insurer</div>
            <div>{report.otherVehicle.insurer || "\u2014"}</div>
            <div className="text-muted-foreground">Policy Number</div>
            <div>{report.otherVehicle.insurancePolicyNumber || "\u2014"}</div>
          </div>
        </CollapsibleSection>
      )}

      {/* Accident Details */}
      <CollapsibleSection title="Accident Details" icon={ScanSearch}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Speed</div>
          <div>{Number(report.vehicleSpeed)} mph</div>
          <div className="text-muted-foreground">Weather</div>
          <div>{report.surroundings?.weather || "\u2014"}</div>
          <div className="text-muted-foreground">Road Condition</div>
          <div>{report.surroundings?.roadCondition || "\u2014"}</div>
          <div className="text-muted-foreground">Visibility</div>
          <div>{report.surroundings?.visibility || "\u2014"}</div>
          <div className="text-muted-foreground">Stop Location</div>
          <div>{report.stopLocation || "\u2014"}</div>
          <div className="text-muted-foreground">Accident Marker</div>
          <div>{cleanAccidentMarker || "\u2014"}</div>
        </div>
        {report.damageDescription && (
          <div className="mt-3">
            <p className="text-muted-foreground text-sm mb-1">
              Damage Description
            </p>
            <p className="text-sm">{report.damageDescription}</p>
          </div>
        )}
        {report.witnessStatement && (
          <div className="mt-3">
            <p className="text-muted-foreground text-sm mb-1">
              Witness Statement
            </p>
            <p className="text-sm">{report.witnessStatement}</p>
          </div>
        )}
        {policeInfo && (policeInfo.policeRef || policeInfo.officerName) && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">Police Information</p>
              {policeInfo.policeRef && (
                <p className="text-muted-foreground">
                  Reference:{" "}
                  <span className="text-foreground font-mono">
                    {policeInfo.policeRef}
                  </span>
                </p>
              )}
              {policeInfo.officerName && (
                <p className="text-muted-foreground">
                  Attending Officer:{" "}
                  <span className="text-foreground">
                    {policeInfo.officerName}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* Data & Privacy (GDPR) */}
      <CollapsibleSection
        title="Data & Privacy"
        icon={Lock}
        defaultOpen={false}
      >
        <GdprPanel reportId={reportIdStr} />
      </CollapsibleSection>
    </div>
  );
}

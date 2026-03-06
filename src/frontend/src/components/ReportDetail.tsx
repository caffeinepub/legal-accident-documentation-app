import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  Camera,
  ChevronDown,
  ChevronUp,
  FileText,
  ScanSearch,
  Video,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { AccidentReport } from "../backend";
import AccidentNarrativePanel from "./AccidentNarrativePanel";
import ClaimSummaryPanel from "./ClaimSummaryPanel";
import ContributoryNegligencePanel from "./ContributoryNegligencePanel";
import DamageSeverityPanel from "./DamageSeverityPanel";
import DashCamAnalysisPanel from "./DashCamAnalysisPanel";
import DashCamGallery from "./DashCamGallery";
import DiscrepancyAlert from "./DiscrepancyAlert";
import ExportReportPanel from "./ExportReportPanel";
import FaultLikelihoodPanel from "./FaultLikelihoodPanel";
import FaultMatrixPanel from "./FaultMatrixPanel";
import InjuryAnalysisPanel from "./InjuryAnalysisPanel";
import LegalReferencePanel from "./LegalReferencePanel";
import LiabilityDisplay from "./LiabilityDisplay";
import NextStepsPanel from "./NextStepsPanel";
import PhotoGallery from "./PhotoGallery";
import TrafficSignsDisplay from "./TrafficSignsDisplay";
import ViolationsDisplay from "./ViolationsDisplay";

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

export default function ReportDetail({ reportId, report }: ReportDetailProps) {
  const primaryViolation =
    report.violations && report.violations.length > 0
      ? report.violations[0].violationType
      : undefined;

  const photoAnalysis = report.aiAnalysisResult?.photoAnalysis ?? "";
  const dashCamAnalysisText = report.aiAnalysisResult?.dashCamAnalysis ?? "";
  const evidenceGaps = report.aiAnalysisResult?.evidenceGaps ?? [];

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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">Report #{reportId.toString()}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(Number(report.timestamp)).toLocaleString("en-GB")}
          </p>
        </div>
        <div className="flex gap-2">
          {report.isAtFault && <Badge variant="destructive">At Fault</Badge>}
          {report.isRedLightViolation && (
            <Badge variant="destructive">Red Light</Badge>
          )}
          {!report.isAtFault && !report.isRedLightViolation && (
            <Badge variant="secondary">No Fault</Badge>
          )}
        </div>
      </div>

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

      {/* Claim Summary — uses reportId + aiAnalysisResult */}
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

      {/* Traffic Signs — prop is `signs` */}
      {report.trafficSigns && report.trafficSigns.length > 0 && (
        <TrafficSignsDisplay signs={report.trafficSigns} />
      )}

      {/* Discrepancy Alert — requires isRedLightViolation */}
      {report.trafficSignalState && (
        <DiscrepancyAlert
          trafficSignalState={report.trafficSignalState}
          isRedLightViolation={report.isRedLightViolation}
        />
      )}

      {/* Photos — requires both photos and imageData */}
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

      {/* Dash Cam Footage — prop is `footage` */}
      {hasFootage && (
        <CollapsibleSection title="Dash Cam Footage" icon={Video} defaultOpen>
          <DashCamGallery footage={report.dashCamFootage} />
        </CollapsibleSection>
      )}

      {/* Dash Cam Analysis Panel — uses correct props */}
      <DashCamAnalysisPanel
        analysis={report.dashCamAnalysis ?? null}
        hasFootage={!!hasFootage}
        isAnalysing={false}
        onAnalyse={() => {}}
      />

      {/* Injury Analysis — only accepts reportId */}
      <InjuryAnalysisPanel reportId={reportId} />

      {/* Legal Reference */}
      <LegalReferencePanel violations={report.violations} />

      {/* Fault Matrix — only accepts violationType */}
      <FaultMatrixPanel violationType={primaryViolation} />

      {/* Contributory Negligence */}
      <ContributoryNegligencePanel />

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
          <div>{report.vehicleInfo?.colour || "—"}</div>
          <div className="text-muted-foreground">Licence Plate</div>
          <div>{report.vehicleInfo?.licencePlate || "—"}</div>
          <div className="text-muted-foreground">Year</div>
          <div>
            {report.vehicleInfo?.year ? Number(report.vehicleInfo.year) : "—"}
          </div>
          <div className="text-muted-foreground">MOT</div>
          <div>{report.vehicleInfo?.mot || "—"}</div>
          <div className="text-muted-foreground">Registration</div>
          <div>{report.vehicleInfo?.registration || "—"}</div>
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
            <div>{report.otherVehicle.ownerName || "—"}</div>
            <div className="text-muted-foreground">Licence Plate</div>
            <div>{report.otherVehicle.licencePlate || "—"}</div>
            <div className="text-muted-foreground">Insurer</div>
            <div>{report.otherVehicle.insurer || "—"}</div>
            <div className="text-muted-foreground">Policy Number</div>
            <div>{report.otherVehicle.insurancePolicyNumber || "—"}</div>
          </div>
        </CollapsibleSection>
      )}

      {/* Accident Details */}
      <CollapsibleSection title="Accident Details" icon={ScanSearch}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Speed</div>
          <div>{Number(report.vehicleSpeed)} mph</div>
          <div className="text-muted-foreground">Weather</div>
          <div>{report.surroundings?.weather || "—"}</div>
          <div className="text-muted-foreground">Road Condition</div>
          <div>{report.surroundings?.roadCondition || "—"}</div>
          <div className="text-muted-foreground">Visibility</div>
          <div>{report.surroundings?.visibility || "—"}</div>
          <div className="text-muted-foreground">Stop Location</div>
          <div>{report.stopLocation || "—"}</div>
          <div className="text-muted-foreground">Accident Marker</div>
          <div>{report.accidentMarker || "—"}</div>
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
      </CollapsibleSection>
    </div>
  );
}

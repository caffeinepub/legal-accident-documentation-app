import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  CheckCircle,
  Car,
  MapPin,
  Clock,
  Eye,
  CloudRain,
  FileText,
  Camera,
  Users,
  Video,
  Phone,
  Mail,
  ShieldCheck,
  Download,
} from 'lucide-react';
import type { AccidentReport } from '../backend';
import LiabilityDisplay from './LiabilityDisplay';
import ViolationsDisplay from './ViolationsDisplay';
import TrafficSignsDisplay from './TrafficSignsDisplay';
import DiscrepancyAlert from './DiscrepancyAlert';
import PhotoGallery from './PhotoGallery';
import LegalReferencePanel from './LegalReferencePanel';
import ContributoryNegligencePanel from './ContributoryNegligencePanel';
import FaultMatrixPanel from './FaultMatrixPanel';
import NextStepsPanel from './NextStepsPanel';
import InjuryAnalysisPanel from './InjuryAnalysisPanel';
import ClaimSummaryPanel from './ClaimSummaryPanel';

interface ReportDetailProps {
  reportId: bigint;
  report: AccidentReport;
}

export default function ReportDetail({ reportId, report }: ReportDetailProps) {
  const date = new Date(Number(report.timestamp) / 1_000_000);

  const primaryViolationType =
    report.violations.length > 0 ? report.violations[0].violationType : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Accident Report #{reportId.toString()}
          </h2>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4" />
            {date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {report.isAtFault ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              At Fault
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center gap-1 bg-green-600">
              <CheckCircle className="h-3 w-3" />
              Not at Fault
            </Badge>
          )}
          {report.isRedLightViolation && (
            <Badge variant="destructive">Red Light Violation</Badge>
          )}
        </div>
      </div>

      {/* Liability Display */}
      <LiabilityDisplay
        party1Liability={report.party1Liability}
        party2Liability={report.party2Liability}
      />

      {/* AI Incident Analysis & Claim Summary */}
      <ClaimSummaryPanel
        reportId={reportId}
        aiAnalysisResult={report.aiAnalysisResult}
      />

      {/* Discrepancy Alert */}
      {report.trafficSignalState && (
        <DiscrepancyAlert
          trafficSignalState={report.trafficSignalState}
          isRedLightViolation={report.isRedLightViolation}
        />
      )}

      {/* My Vehicle Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="h-4 w-4" />
            My Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Make</p>
              <p className="font-medium">{report.vehicleInfo.make || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="font-medium">{report.vehicleInfo.model || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Colour</p>
              <p className="font-medium">{report.vehicleInfo.colour || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Licence Plate</p>
              <p className="font-medium">{report.vehicleInfo.licencePlate || '—'}</p>
            </div>
            {Number(report.vehicleInfo.year) > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="font-medium">{report.vehicleInfo.year.toString()}</p>
              </div>
            )}
            {report.vehicleInfo.registration && (
              <div>
                <p className="text-xs text-muted-foreground">Registration</p>
                <p className="font-medium">{report.vehicleInfo.registration}</p>
              </div>
            )}
            {report.vehicleInfo.mot && (
              <div>
                <p className="text-xs text-muted-foreground">MOT Expiry</p>
                <p className="font-medium">{report.vehicleInfo.mot}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Other Vehicle Info */}
      {report.otherVehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="h-4 w-4 text-amber-500" />
              Other Vehicle Involved
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Driver Contact */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Driver Contact Details
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {report.otherVehicle.ownerName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium">{report.otherVehicle.ownerName}</p>
                  </div>
                )}
                {report.otherVehicle.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-medium">{report.otherVehicle.phone}</p>
                  </div>
                )}
                {report.otherVehicle.email && (
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-medium">{report.otherVehicle.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Insurance */}
            {(report.otherVehicle.insurer || report.otherVehicle.insurancePolicyNumber || report.otherVehicle.claimReference) && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Insurance Information
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {report.otherVehicle.insurer && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Insurer
                        </p>
                        <p className="font-medium">{report.otherVehicle.insurer}</p>
                      </div>
                    )}
                    {report.otherVehicle.insurancePolicyNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground">Policy Number</p>
                        <p className="font-medium">{report.otherVehicle.insurancePolicyNumber}</p>
                      </div>
                    )}
                    {report.otherVehicle.claimReference && (
                      <div>
                        <p className="text-xs text-muted-foreground">Claim Reference</p>
                        <p className="font-medium">{report.otherVehicle.claimReference}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Vehicle Details */}
            {(report.otherVehicle.make || report.otherVehicle.model || report.otherVehicle.licencePlate) && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Vehicle Details
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {report.otherVehicle.make && (
                      <div>
                        <p className="text-xs text-muted-foreground">Make</p>
                        <p className="font-medium">{report.otherVehicle.make}</p>
                      </div>
                    )}
                    {report.otherVehicle.model && (
                      <div>
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="font-medium">{report.otherVehicle.model}</p>
                      </div>
                    )}
                    {Number(report.otherVehicle.year) > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="font-medium">{report.otherVehicle.year.toString()}</p>
                      </div>
                    )}
                    {report.otherVehicle.colour && (
                      <div>
                        <p className="text-xs text-muted-foreground">Colour</p>
                        <p className="font-medium">{report.otherVehicle.colour}</p>
                      </div>
                    )}
                    {report.otherVehicle.licencePlate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Licence Plate</p>
                        <p className="font-medium">{report.otherVehicle.licencePlate}</p>
                      </div>
                    )}
                    {report.otherVehicle.registration && (
                      <div>
                        <p className="text-xs text-muted-foreground">Registration</p>
                        <p className="font-medium">{report.otherVehicle.registration}</p>
                      </div>
                    )}
                    {report.otherVehicle.mot && (
                      <div>
                        <p className="text-xs text-muted-foreground">MOT Expiry</p>
                        <p className="font-medium">{report.otherVehicle.mot}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Witnesses */}
      {report.witnesses && report.witnesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Witnesses ({report.witnesses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.witnesses.map((witness, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Witness {index + 1}{witness.name ? `: ${witness.name}` : ''}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {witness.phone && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Phone
                        </p>
                        <p className="text-sm font-medium">{witness.phone}</p>
                      </div>
                    )}
                    {witness.email && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> Email
                        </p>
                        <p className="text-sm font-medium">{witness.email}</p>
                      </div>
                    )}
                    {witness.address && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Address
                        </p>
                        <p className="text-sm font-medium">{witness.address}</p>
                      </div>
                    )}
                  </div>
                  {witness.statement && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Statement</p>
                      <p className="text-sm bg-muted/40 rounded-md p-3 border border-border">
                        {witness.statement}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Video Evidence */}
      {report.videos && report.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="h-4 w-4" />
              Video Evidence ({report.videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.videos.map((video, index) => {
              const url = video.getDirectURL();
              return (
                <div key={index} className="space-y-2">
                  {index > 0 && <Separator />}
                  <p className="text-sm font-medium text-muted-foreground">
                    Video {index + 1}
                  </p>
                  <video
                    src={url}
                    controls
                    className="w-full rounded-md border border-border max-h-64 bg-black"
                    preload="metadata"
                  />
                  <a
                    href={url}
                    download={`video-evidence-${index + 1}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <Download className="h-3 w-3" />
                    Download video {index + 1}
                  </a>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Stop Location
              </p>
              <p className="font-medium">{report.stopLocation || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Accident Marker</p>
              <p className="font-medium">{report.accidentMarker || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vehicle Speed</p>
              <p className="font-medium">{report.vehicleSpeed.toString()} mph</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fault Reasoning</p>
              <p className="font-medium">{report.faultReasoning || '—'}</p>
            </div>
          </div>

          {report.damageDescription && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Damage Description</p>
                <p className="text-sm">{report.damageDescription}</p>
              </div>
            </>
          )}

          {report.witnessStatement && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">General Witness Statement</p>
                <p className="text-sm">{report.witnessStatement}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Surroundings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudRain className="h-4 w-4" />
            Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Weather</p>
              <p className="font-medium capitalize">{report.surroundings.weather || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Road Condition</p>
              <p className="font-medium capitalize">{report.surroundings.roadCondition || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" /> Visibility
              </p>
              <p className="font-medium capitalize">{report.surroundings.visibility || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations */}
      {report.violations.length > 0 && (
        <ViolationsDisplay violations={report.violations} />
      )}

      {/* Traffic Signs */}
      {report.trafficSigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Detected Traffic Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficSignsDisplay signs={report.trafficSigns} />
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {report.imageData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4" />
              Scene Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoGallery photos={report.photos} imageData={report.imageData} />
          </CardContent>
        </Card>
      )}

      {/* Fault Analysis Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Fault Analysis</h3>
        <FaultMatrixPanel violationType={primaryViolationType} />
        <InjuryAnalysisPanel reportId={reportId} />
        <LegalReferencePanel violations={report.violations} />
        <ContributoryNegligencePanel />
        <NextStepsPanel />
      </div>
    </div>
  );
}

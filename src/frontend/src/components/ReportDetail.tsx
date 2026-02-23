import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, MapPin, AlertCircle, CheckCircle, Loader2, BookOpen, TrafficCone } from 'lucide-react';
import { useGetReport } from '../hooks/useQueries';
import SpeedDisplay from './SpeedDisplay';
import PhotoGallery from './PhotoGallery';
import TrafficSignsDisplay from './TrafficSignsDisplay';
import DiscrepancyAlert from './DiscrepancyAlert';
import ViolationsDisplay from './ViolationsDisplay';
import LiabilityDisplay from './LiabilityDisplay';

interface ReportDetailProps {
  reportId: bigint;
}

export default function ReportDetail({ reportId }: ReportDetailProps) {
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useGetReport(reportId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load report. Please try again.</p>
          </div>
          <Button onClick={() => navigate({ to: '/reports' })}>Back to Reports</Button>
        </CardContent>
      </Card>
    );
  }

  const date = new Date(Number(report.timestamp));
  const speedMph = Number(report.vehicleSpeed) / 100;
  const speedMs = speedMph / 2.23694;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate({ to: '/reports' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        <div className="flex items-center gap-2">
          {report.isAtFault ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              At Fault
            </Badge>
          ) : (
            <Badge className="flex items-center gap-1 bg-[oklch(0.7_0.15_145)] text-white">
              <CheckCircle className="h-3 w-3" />
              No Fault
            </Badge>
          )}
          {report.isRedLightViolation && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Red Light Violation
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report #{reportId.toString()}</CardTitle>
          <CardDescription>
            Created on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
      </Card>

      <LiabilityDisplay 
        party1Liability={report.party1Liability}
        party2Liability={report.party2Liability}
      />

      {report.trafficSignalState && report.isRedLightViolation && (
        <DiscrepancyAlert 
          trafficSignalState={report.trafficSignalState}
          isRedLightViolation={report.isRedLightViolation}
        />
      )}

      <ViolationsDisplay violations={report.violations} />

      <Card>
        <CardHeader>
          <CardTitle>Velocity Data</CardTitle>
          <CardDescription>Calculated vehicle speed from observed measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <SpeedDisplay velocityMs={speedMs} velocityMph={speedMph} />
        </CardContent>
      </Card>

      {report.photos && report.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accident Scene Photos</CardTitle>
            <CardDescription>
              {report.photos.length} photo{report.photos.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoGallery photos={report.photos} imageData={report.imageData} />
          </CardContent>
        </Card>
      )}

      {report.trafficSigns && report.trafficSigns.length > 0 && (
        <Card className="border-[oklch(0.65_0.2_30)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrafficCone className="h-5 w-5" />
              AI-Detected Traffic Signs & Road Markings
            </CardTitle>
            <CardDescription>
              Traffic control devices and road markings identified in accident photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficSignsDisplay signs={report.trafficSigns} />
          </CardContent>
        </Card>
      )}

      {report.trafficSignalState && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Signal Information</CardTitle>
            <CardDescription>Witness testimony about traffic light state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-semibold text-foreground">Traffic Light Color (Witness):</span>
              <Badge className="bg-[oklch(0.7_0.15_145)] text-white capitalize">
                {report.trafficSignalState.witnessTestimony}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-semibold text-foreground">Position:</span>
              <span className="text-sm text-muted-foreground">{report.trafficSignalState.position}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Accident Location
            </div>
            <p className="text-muted-foreground pl-6">
              {report.accidentMarker || 'Not specified'}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-[oklch(0.7_0.15_145)]" />
              Stop Location
            </div>
            <p className="text-muted-foreground pl-6">
              {report.stopLocation || 'Not specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Road Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{report.roadCondition || 'Not specified'}</p>
          {report.faultAnalysis?.weatherConditions && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-semibold text-foreground mb-1">AI-Detected Conditions:</p>
              <p className="text-sm text-muted-foreground">{report.faultAnalysis.weatherConditions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Witness Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground whitespace-pre-wrap">
            {report.witnessStatement || 'No witness statement provided'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Damage Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground whitespace-pre-wrap">
            {report.damageDescription || 'No damage description provided'}
          </p>
        </CardContent>
      </Card>

      {report.faultAnalysis && (
        <Card className="border-[oklch(0.65_0.2_30)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              AI Fault Analysis
            </CardTitle>
            <CardDescription>Automated assessment based on UK Highway Code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-2">Analysis Result:</p>
              <p className="text-foreground">{report.faultAnalysis.reason}</p>
            </div>

            {report.faultAnalysis.speedLimit && report.faultAnalysis.actualSpeed && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Speed Limit</p>
                  <p className="text-lg font-bold text-foreground">
                    {Number(report.faultAnalysis.speedLimit)} mph
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Actual Speed</p>
                  <p className="text-lg font-bold text-foreground">
                    {(Number(report.faultAnalysis.actualSpeed) / 100).toFixed(1)} mph
                  </p>
                </div>
              </div>
            )}

            {report.faultAnalysis.violatedRules && report.faultAnalysis.violatedRules.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Violated Highway Code Rules:</p>
                {report.faultAnalysis.violatedRules.map((rule, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rule.ruleNumber}</Badge>
                      <p className="font-semibold text-foreground">{rule.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    {rule.applicableScenarios && rule.applicableScenarios.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Applicable to:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                          {rule.applicableScenarios.map((scenario, idx) => (
                            <li key={idx}>{scenario}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {report.applicableRules && report.applicableRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Applicable Highway Code Rules
            </CardTitle>
            <CardDescription>Relevant rules for this accident scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.applicableRules.map((rule, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{rule.ruleNumber}</Badge>
                  <p className="font-semibold text-foreground">{rule.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

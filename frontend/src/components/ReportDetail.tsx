import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { AccidentReport } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Car, Camera, MapPin, CloudRain, AlertTriangle, CheckCircle,
  ArrowLeft, Calendar, Gauge, Eye, FileText, Users
} from 'lucide-react';
import PhotoGallery from './PhotoGallery';
import LiabilityDisplay from './LiabilityDisplay';
import ViolationsDisplay from './ViolationsDisplay';
import LegalReferencePanel from './LegalReferencePanel';

interface ReportDetailProps {
  reportId: bigint;
  report: AccidentReport;
}

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp)).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function capitalize(s: string): string {
  if (!s) return '—';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ReportDetail({ reportId, report }: ReportDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/reports' })} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        My Reports
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report #{reportId.toString()}</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(report.timestamp)}
          </p>
        </div>
        <Badge variant={report.isAtFault ? 'destructive' : 'default'}>
          {report.isAtFault ? 'At Fault' : 'Not At Fault'}
        </Badge>
      </div>

      <Separator />

      {/* Liability Split */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-primary" />
            Liability Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LiabilityDisplay
            party1Liability={report.party1Liability}
            party2Liability={report.party2Liability}
          />
        </CardContent>
      </Card>

      {/* Violations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="w-4 h-4 text-primary" />
            Detected Violations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ViolationsDisplay violations={report.violations} />
        </CardContent>
      </Card>

      {/* Legal Reference Panel — collapsed by default */}
      <LegalReferencePanel violations={report.violations} />

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="w-4 h-4 text-primary" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Make</p>
            <p className="font-medium">{capitalize(report.vehicleInfo.make)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Model</p>
            <p className="font-medium">{capitalize(report.vehicleInfo.model)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Colour</p>
            <p className="font-medium">{capitalize(report.vehicleInfo.colour)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Licence Plate</p>
            <p className="font-medium font-mono">{report.vehicleInfo.licencePlate.toUpperCase()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-primary" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Gauge className="w-3 h-3" /> Vehicle Speed
              </p>
              <p className="font-medium">{Number(report.vehicleSpeed)} mph</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Stop Location</p>
              <p className="font-medium">{report.stopLocation || '—'}</p>
            </div>
          </div>
          {report.accidentMarker && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Accident Description</p>
              <p className="font-medium">{report.accidentMarker}</p>
            </div>
          )}
          {report.witnessStatement && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Witness Statement</p>
              <p className="text-sm">{report.witnessStatement}</p>
            </div>
          )}
          {report.damageDescription && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Damage Description</p>
              <p className="text-sm">{report.damageDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Surroundings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudRain className="w-4 h-4 text-primary" />
            Surroundings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Weather</p>
            <p className="font-medium">{capitalize(report.surroundings.weather)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Road Condition</p>
            <p className="font-medium">{capitalize(report.surroundings.roadCondition)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Eye className="w-3 h-3" /> Visibility
            </p>
            <p className="font-medium">{capitalize(report.surroundings.visibility)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Fault Analysis */}
      {report.faultAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-primary" />
              Fault Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              {report.faultAnalysis.isAtFault ? (
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              )}
              <p className="text-sm">{report.faultAnalysis.reason}</p>
            </div>
            {report.faultAnalysis.speedLimit !== undefined && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Speed Limit: </span>
                  <span className="font-medium">{Number(report.faultAnalysis.speedLimit)} mph</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Actual Speed: </span>
                  <span className="font-medium">{Number(report.faultAnalysis.actualSpeed)} mph</span>
                </div>
              </div>
            )}
            {report.applicableRules && report.applicableRules.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Applicable Highway Code Rules
                </p>
                {report.applicableRules.map((rule, i) => (
                  <div key={i} className="text-sm bg-muted/50 rounded p-2">
                    <span className="font-semibold">{rule.ruleNumber}: </span>
                    <span>{rule.title}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {report.imageData && report.imageData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="w-4 h-4 text-primary" />
              Incident Photos ({report.imageData.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoGallery photos={report.photos} imageData={report.imageData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

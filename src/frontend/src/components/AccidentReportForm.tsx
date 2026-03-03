import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Camera, FileVideo, Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { ExternalBlob } from "../backend";
import { useCreateReport } from "../hooks/useQueries";
import DashCamUpload, { type DashCamClip } from "./DashCamUpload";
import PhotoUpload from "./PhotoUpload";

interface EvidenceGap {
  description: string;
  confidenceLevel: bigint;
  evidenceType: string;
}

export default function AccidentReportForm() {
  const navigate = useNavigate();
  const createReport = useCreateReport();

  // Media & AI Analysis state
  const [photos, setPhotos] = useState<
    Array<{ blob: ExternalBlob; filename: string; contentType: string }>
  >([]);
  const [dashCamClips, setDashCamClips] = useState<DashCamClip[]>([]);
  const [photoAnalysisDescription, setPhotoAnalysisDescription] = useState("");
  const [dashCamCrossAnalysisDescription, setDashCamCrossAnalysisDescription] =
    useState("");
  const [photoEvidenceGaps, setPhotoEvidenceGaps] = useState<EvidenceGap[]>([]);

  // Vehicle info
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [licencePlate, setLicencePlate] = useState("");
  const [year, setYear] = useState("");
  const [mot, setMot] = useState("");
  const [registration, setRegistration] = useState("");

  // Accident details
  const [vehicleSpeed, setVehicleSpeed] = useState("");
  const [damageDescription, setDamageDescription] = useState("");
  const [witnessStatement, setWitnessStatement] = useState("");
  const [stopLocation, setStopLocation] = useState("");
  const [accidentMarker, setAccidentMarker] = useState("");
  const [weather, setWeather] = useState("");
  const [roadCondition, setRoadCondition] = useState("");
  const [visibility, setVisibility] = useState("");
  const [roadType, setRoadType] = useState<
    "urban" | "dualCarriageway" | "motorway"
  >("urban");
  const [speedLimit, setSpeedLimit] = useState("30");

  // Other vehicle
  const [otherMake, setOtherMake] = useState("");
  const [otherModel, setOtherModel] = useState("");
  const [otherOwnerName, setOtherOwnerName] = useState("");
  const [otherEmail, setOtherEmail] = useState("");
  const [otherPhone, setOtherPhone] = useState("");
  const [otherInsurer, setOtherInsurer] = useState("");
  const [otherPolicyNumber, setOtherPolicyNumber] = useState("");
  const [otherClaimRef, setOtherClaimRef] = useState("");
  const [otherLicencePlate, setOtherLicencePlate] = useState("");
  const [otherYear, setOtherYear] = useState("");
  const [otherColour, setOtherColour] = useState("");
  const [otherMot, setOtherMot] = useState("");
  const [otherRegistration, setOtherRegistration] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roadTypeValue =
      roadType === "urban"
        ? { __kind__: "urban" as const, urban: BigInt(speedLimit || 30) }
        : roadType === "dualCarriageway"
          ? {
              __kind__: "dualCarriageway" as const,
              dualCarriageway: BigInt(speedLimit || 70),
            }
          : {
              __kind__: "motorway" as const,
              motorway: BigInt(speedLimit || 70),
            };

    const photoMetadata = photos.map((p) => ({
      filename: p.filename,
      contentType: p.contentType,
      uploadTimestamp: BigInt(Date.now()),
      description: "",
    }));

    const hasOtherVehicle =
      otherMake || otherModel || otherOwnerName || otherLicencePlate;

    const otherVehicle = hasOtherVehicle
      ? {
          make: otherMake,
          model: otherModel,
          ownerName: otherOwnerName,
          email: otherEmail,
          phone: otherPhone,
          insurer: otherInsurer,
          insurancePolicyNumber: otherPolicyNumber,
          claimReference: otherClaimRef,
          licencePlate: otherLicencePlate,
          year: BigInt(otherYear || 0),
          colour: otherColour,
          mot: otherMot,
          registration: otherRegistration,
        }
      : null;

    await createReport.mutateAsync({
      vehicleSpeed: BigInt(vehicleSpeed || 0),
      witnessStatement,
      damageDescription,
      stopLocation,
      accidentMarker,
      timestamp: BigInt(Date.now()),
      roadType: roadTypeValue,
      photos: photoMetadata,
      images: [],
      trafficSignalState: null,
      trafficSigns: [],
      gpsLocation: "",
      surroundings: {
        weather,
        roadCondition,
        visibility,
      },
      vehicleInfo: {
        make,
        model,
        colour,
        licencePlate,
        year: BigInt(year || 0),
        mot,
        registration,
      },
      otherVehicle,
      witnessDetails: [],
      videoFiles: [],
      dashCamFootage: dashCamClips.map((c) => c.blob),
      accidentNarrative: null,
      damageSeverity: null,
      faultLikelihoodAssessment: null,
      aiPhotoAnalysis: photoAnalysisDescription,
      aiDashCamAnalyses: dashCamCrossAnalysisDescription,
      evidenceGaps: photoEvidenceGaps,
    });

    navigate({ to: "/reports" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* ── Media & AI Analysis ── */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5 text-primary" />
            Media &amp; AI Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload photos and dash cam footage. Use the analyse buttons to
            generate AI descriptions that complement each other.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Accident Scene Photos</h3>
            </div>
            <PhotoUpload
              onPhotosSelected={setPhotos}
              onPhotoAnalysisChange={setPhotoAnalysisDescription}
              onPhotoEvidenceGapsChange={setPhotoEvidenceGaps}
              vehicleContext={{
                make: make || undefined,
                model: model || undefined,
                colour: colour || undefined,
                licencePlate: licencePlate || undefined,
                year: year || undefined,
              }}
            />
          </div>

          <div className="border-t border-border" />

          {/* Dash cam upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Dash Cam Footage</h3>
            </div>
            <DashCamUpload
              onChange={setDashCamClips}
              onDashCamCrossAnalysisChange={setDashCamCrossAnalysisDescription}
              photoAnalysisDescription={photoAnalysisDescription}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Vehicle Information ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Ford"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Focus"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="colour">Colour</Label>
            <Input
              id="colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. Silver"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="licencePlate">Licence Plate</Label>
            <Input
              id="licencePlate"
              value={licencePlate}
              onChange={(e) => setLicencePlate(e.target.value)}
              placeholder="e.g. AB12 CDE"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2019"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mot">MOT Expiry</Label>
            <Input
              id="mot"
              value={mot}
              onChange={(e) => setMot(e.target.value)}
              placeholder="e.g. 2025-06-01"
            />
          </div>
          <div className="space-y-1 col-span-2">
            <Label htmlFor="registration">Registration</Label>
            <Input
              id="registration"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="Registration number"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Accident Details ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Accident Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="vehicleSpeed">Vehicle Speed (mph)</Label>
              <Input
                id="vehicleSpeed"
                type="number"
                value={vehicleSpeed}
                onChange={(e) => setVehicleSpeed(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="roadType">Road Type</Label>
              <Select
                value={roadType}
                onValueChange={(v) => setRoadType(v as typeof roadType)}
              >
                <SelectTrigger id="roadType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="dualCarriageway">
                    Dual Carriageway
                  </SelectItem>
                  <SelectItem value="motorway">Motorway</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="speedLimit">Speed Limit (mph)</Label>
              <Input
                id="speedLimit"
                type="number"
                value={speedLimit}
                onChange={(e) => setSpeedLimit(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="weather">Weather</Label>
              <Input
                id="weather"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g. Clear"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="roadCondition">Road Condition</Label>
              <Input
                id="roadCondition"
                value={roadCondition}
                onChange={(e) => setRoadCondition(e.target.value)}
                placeholder="e.g. Dry"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="visibility">Visibility</Label>
              <Input
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                placeholder="e.g. Good"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="stopLocation">Stop Location</Label>
            <Input
              id="stopLocation"
              value={stopLocation}
              onChange={(e) => setStopLocation(e.target.value)}
              placeholder="Where did the vehicle stop?"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="accidentMarker">Accident Marker / Location</Label>
            <Input
              id="accidentMarker"
              value={accidentMarker}
              onChange={(e) => setAccidentMarker(e.target.value)}
              placeholder="e.g. Junction of High St and Mill Rd"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="damageDescription">Damage Description</Label>
            <Textarea
              id="damageDescription"
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              rows={3}
              placeholder="Describe the damage to your vehicle…"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="witnessStatement">Witness Statement</Label>
            <Textarea
              id="witnessStatement"
              value={witnessStatement}
              onChange={(e) => setWitnessStatement(e.target.value)}
              rows={3}
              placeholder="Any witness accounts of the incident…"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Other Vehicle ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Other Vehicle (if applicable)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="otherMake">Make</Label>
            <Input
              id="otherMake"
              value={otherMake}
              onChange={(e) => setOtherMake(e.target.value)}
              placeholder="e.g. Toyota"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherModel">Model</Label>
            <Input
              id="otherModel"
              value={otherModel}
              onChange={(e) => setOtherModel(e.target.value)}
              placeholder="e.g. Corolla"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherOwnerName">Owner Name</Label>
            <Input
              id="otherOwnerName"
              value={otherOwnerName}
              onChange={(e) => setOtherOwnerName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherLicencePlate">Licence Plate</Label>
            <Input
              id="otherLicencePlate"
              value={otherLicencePlate}
              onChange={(e) => setOtherLicencePlate(e.target.value)}
              placeholder="e.g. XY34 ZAB"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherEmail">Email</Label>
            <Input
              id="otherEmail"
              type="email"
              value={otherEmail}
              onChange={(e) => setOtherEmail(e.target.value)}
              placeholder="owner@email.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherPhone">Phone</Label>
            <Input
              id="otherPhone"
              value={otherPhone}
              onChange={(e) => setOtherPhone(e.target.value)}
              placeholder="+44 7700 000000"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherInsurer">Insurer</Label>
            <Input
              id="otherInsurer"
              value={otherInsurer}
              onChange={(e) => setOtherInsurer(e.target.value)}
              placeholder="Insurance company"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherPolicyNumber">Policy Number</Label>
            <Input
              id="otherPolicyNumber"
              value={otherPolicyNumber}
              onChange={(e) => setOtherPolicyNumber(e.target.value)}
              placeholder="Policy number"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherClaimRef">Claim Reference</Label>
            <Input
              id="otherClaimRef"
              value={otherClaimRef}
              onChange={(e) => setOtherClaimRef(e.target.value)}
              placeholder="Claim reference"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherYear">Year</Label>
            <Input
              id="otherYear"
              type="number"
              value={otherYear}
              onChange={(e) => setOtherYear(e.target.value)}
              placeholder="e.g. 2020"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherColour">Colour</Label>
            <Input
              id="otherColour"
              value={otherColour}
              onChange={(e) => setOtherColour(e.target.value)}
              placeholder="e.g. Blue"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="otherMot">MOT Expiry</Label>
            <Input
              id="otherMot"
              value={otherMot}
              onChange={(e) => setOtherMot(e.target.value)}
              placeholder="e.g. 2025-03-01"
            />
          </div>
          <div className="space-y-1 col-span-2">
            <Label htmlFor="otherRegistration">Registration</Label>
            <Input
              id="otherRegistration"
              value={otherRegistration}
              onChange={(e) => setOtherRegistration(e.target.value)}
              placeholder="Registration number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        disabled={createReport.isPending}
        className="w-full"
        size="lg"
      >
        {createReport.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Report…
          </>
        ) : (
          "Submit Accident Report"
        )}
      </Button>

      {createReport.isError && (
        <p className="text-sm text-destructive text-center">
          Failed to submit report. Please try again.
        </p>
      )}
    </form>
  );
}

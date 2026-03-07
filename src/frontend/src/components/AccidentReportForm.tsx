import { Badge } from "@/components/ui/badge";
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
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  FileVideo,
  Loader2,
  Plus,
  RotateCcw,
  Users,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExternalBlob } from "../backend";
import { useCreateReport } from "../hooks/useQueries";
import DashCamUpload, { type DashCamClip } from "./DashCamUpload";
import PartyVehicleCard, { type AdditionalParty } from "./PartyVehicleCard";
import PhotoUpload from "./PhotoUpload";
import RestoreDraftBanner from "./RestoreDraftBanner";
import SubmissionTrustPanel from "./SubmissionTrustPanel";
import WizardProgress from "./WizardProgress";

const ADDITIONAL_PARTIES_DELIMITER = "\n\n---ADDITIONAL_PARTIES---\n";
const DRAFT_KEY = "accident_draft_v1";

const WIZARD_STEPS = [
  { number: 1, label: "Media" },
  { number: 2, label: "Vehicle" },
  { number: 3, label: "Details" },
  { number: 4, label: "Parties" },
  { number: 5, label: "Review" },
];

function createEmptyParty(id: string): AdditionalParty {
  return {
    id,
    vehicleType: "car",
    make: "",
    model: "",
    colour: "",
    licencePlate: "",
    year: "",
    mot: "",
    ownerName: "",
    email: "",
    phone: "",
    insurer: "",
    policyNumber: "",
    claimRef: "",
    description: "",
  };
}

interface EvidenceGap {
  description: string;
  confidenceLevel: bigint;
  evidenceType: string;
}

interface DraftData {
  make: string;
  model: string;
  colour: string;
  licencePlate: string;
  year: string;
  mot: string;
  registration: string;
  vehicleSpeed: string;
  damageDescription: string;
  witnessStatement: string;
  stopLocation: string;
  accidentMarker: string;
  weather: string;
  roadCondition: string;
  visibility: string;
  roadType: "urban" | "dualCarriageway" | "motorway";
  speedLimit: string;
  additionalParties: AdditionalParty[];
  photoAnalysisDescription: string;
  dashCamCrossAnalysisDescription: string;
  savedAt: string;
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AccidentReportForm() {
  const navigate = useNavigate();
  const createReport = useCreateReport();

  // Wizard step (1-indexed)
  const [currentStep, setCurrentStep] = useState(1);

  // Draft restore banner
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState("");
  const [lastSavedTime, setLastSavedTime] = useState("");

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

  // Additional parties (multi-party support)
  const [additionalParties, setAdditionalParties] = useState<AdditionalParty[]>(
    [],
  );

  // Trust & credibility state
  const [signatoryName, setSignatoryName] = useState("");
  const [trustAgreed, setTrustAgreed] = useState(false);

  // Auto-save debounce ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildDraft = useCallback((): DraftData => {
    return {
      make,
      model,
      colour,
      licencePlate,
      year,
      mot,
      registration,
      vehicleSpeed,
      damageDescription,
      witnessStatement,
      stopLocation,
      accidentMarker,
      weather,
      roadCondition,
      visibility,
      roadType,
      speedLimit,
      additionalParties,
      photoAnalysisDescription,
      dashCamCrossAnalysisDescription,
      savedAt: new Date().toISOString(),
    };
  }, [
    make,
    model,
    colour,
    licencePlate,
    year,
    mot,
    registration,
    vehicleSpeed,
    damageDescription,
    witnessStatement,
    stopLocation,
    accidentMarker,
    weather,
    roadCondition,
    visibility,
    roadType,
    speedLimit,
    additionalParties,
    photoAnalysisDescription,
    dashCamCrossAnalysisDescription,
  ]);

  const applyDraft = useCallback((draft: DraftData) => {
    setMake(draft.make ?? "");
    setModel(draft.model ?? "");
    setColour(draft.colour ?? "");
    setLicencePlate(draft.licencePlate ?? "");
    setYear(draft.year ?? "");
    setMot(draft.mot ?? "");
    setRegistration(draft.registration ?? "");
    setVehicleSpeed(draft.vehicleSpeed ?? "");
    setDamageDescription(draft.damageDescription ?? "");
    setWitnessStatement(draft.witnessStatement ?? "");
    setStopLocation(draft.stopLocation ?? "");
    setAccidentMarker(draft.accidentMarker ?? "");
    setWeather(draft.weather ?? "");
    setRoadCondition(draft.roadCondition ?? "");
    setVisibility(draft.visibility ?? "");
    setRoadType(draft.roadType ?? "urban");
    setSpeedLimit(draft.speedLimit ?? "30");
    setAdditionalParties(draft.additionalParties ?? []);
    setPhotoAnalysisDescription(draft.photoAnalysisDescription ?? "");
    setDashCamCrossAnalysisDescription(
      draft.dashCamCrossAnalysisDescription ?? "",
    );
  }, []);

  const resetForm = useCallback(() => {
    setMake("");
    setModel("");
    setColour("");
    setLicencePlate("");
    setYear("");
    setMot("");
    setRegistration("");
    setVehicleSpeed("");
    setDamageDescription("");
    setWitnessStatement("");
    setStopLocation("");
    setAccidentMarker("");
    setWeather("");
    setRoadCondition("");
    setVisibility("");
    setRoadType("urban");
    setSpeedLimit("30");
    setAdditionalParties([]);
    setPhotoAnalysisDescription("");
    setDashCamCrossAnalysisDescription("");
    setPhotos([]);
    setDashCamClips([]);
    setPhotoEvidenceGaps([]);
  }, []);

  // On mount: check for saved draft
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw) as DraftData;
        setDraftSavedAt(draft.savedAt ? formatTime(draft.savedAt) : "");
        setShowRestoreBanner(true);
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const draft = buildDraft();
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSavedTime(formatTime(draft.savedAt));
    }, 800);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [buildDraft]);

  const handleRestoreDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw) as DraftData;
        applyDraft(draft);
      } catch {
        // ignore
      }
    }
    setShowRestoreBanner(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowRestoreBanner(false);
    resetForm();
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setLastSavedTime("");
    resetForm();
    setCurrentStep(1);
  };

  const addParty = () => {
    setAdditionalParties((prev) => [
      ...prev,
      createEmptyParty(crypto.randomUUID()),
    ]);
  };

  const removeParty = (id: string) => {
    setAdditionalParties((prev) => prev.filter((p) => p.id !== id));
  };

  const updateParty = (id: string, updated: AdditionalParty) => {
    setAdditionalParties((prev) =>
      prev.map((p) => (p.id === id ? updated : p)),
    );
  };

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

    // Map first additional party → backend OtherVehicle (backward compat)
    const firstParty = additionalParties[0] ?? null;
    const otherVehicle =
      firstParty &&
      (firstParty.make ||
        firstParty.model ||
        firstParty.ownerName ||
        firstParty.licencePlate ||
        firstParty.description)
        ? {
            make: firstParty.make,
            model: firstParty.model,
            ownerName: firstParty.ownerName,
            email: firstParty.email,
            phone: firstParty.phone,
            insurer: firstParty.insurer,
            insurancePolicyNumber: firstParty.policyNumber,
            claimReference: firstParty.claimRef,
            licencePlate: firstParty.licencePlate,
            year: BigInt(firstParty.year || 0),
            colour: firstParty.colour,
            mot: firstParty.mot,
            registration: firstParty.licencePlate, // use plate as registration fallback
          }
        : null;

    // Parties index 1+ are serialised and appended to the witness statement
    const extraParties = additionalParties.slice(1);
    const baseWitnessStatement =
      extraParties.length > 0
        ? `${witnessStatement}${ADDITIONAL_PARTIES_DELIMITER}${JSON.stringify(extraParties)}`
        : witnessStatement;

    // Compute SHA-256 trust seal at submission time
    const submittedAt = new Date().toISOString();
    const canonicalData = {
      make,
      model,
      colour,
      licencePlate,
      year,
      vehicleSpeed,
      damageDescription,
      stopLocation,
      accidentMarker,
      weather,
      roadCondition,
      roadType,
      speedLimit,
      timestamp: Date.now(),
    };
    const canonicalStr = JSON.stringify(canonicalData);
    let trustHash = "";
    try {
      const msgBuffer = new TextEncoder().encode(canonicalStr);
      const hashBuffer = await window.crypto.subtle.digest(
        "SHA-256",
        msgBuffer,
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      trustHash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      // Fallback: use a simple timestamp-based identifier if SubtleCrypto unavailable
      trustHash = Date.now().toString(16);
    }

    const trustSeal = JSON.stringify({
      signatory: signatoryName.trim(),
      hash: trustHash,
      submittedAt,
    });
    const TRUST_SEAL_DELIMITER = "\n\n---TRUST_SEAL---\n";
    const witnessStatementWithExtras = `${baseWitnessStatement}${TRUST_SEAL_DELIMITER}${trustSeal}`;

    await createReport.mutateAsync({
      vehicleSpeed: BigInt(vehicleSpeed || 0),
      witnessStatement: witnessStatementWithExtras,
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

    // Clear draft after successful submit
    localStorage.removeItem(DRAFT_KEY);
    navigate({ to: "/reports" });
  };

  // ── Step content ──────────────────────────────────────────────────────────

  const StepMedia = (
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
  );

  const StepVehicle = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Vehicle</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter the details of your vehicle. These will be used to contextualise
          the AI photo analysis.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Ford"
            data-ocid="vehicle.make.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Focus"
            data-ocid="vehicle.model.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="colour">Colour</Label>
          <Input
            id="colour"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            placeholder="e.g. Silver"
            data-ocid="vehicle.colour.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="licencePlate">Licence Plate / Registration</Label>
          <Input
            id="licencePlate"
            value={licencePlate}
            onChange={(e) => {
              setLicencePlate(e.target.value);
              setRegistration(e.target.value); // keep registration in sync
            }}
            placeholder="e.g. AB12 CDE"
            data-ocid="vehicle.licencePlate.input"
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
            data-ocid="vehicle.year.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="mot">MOT Expiry</Label>
          <Input
            id="mot"
            value={mot}
            onChange={(e) => setMot(e.target.value)}
            placeholder="e.g. 2025-06-01"
            data-ocid="vehicle.mot.input"
          />
        </div>
      </CardContent>
    </Card>
  );

  const StepDetails = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Accident Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe the conditions and circumstances at the time of the accident.
        </p>
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
              data-ocid="details.vehicleSpeed.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="roadType">Road Type</Label>
            <Select
              value={roadType}
              onValueChange={(v) => setRoadType(v as typeof roadType)}
            >
              <SelectTrigger id="roadType" data-ocid="details.roadType.select">
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
              data-ocid="details.speedLimit.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="weather">Weather</Label>
            <Input
              id="weather"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="e.g. Clear"
              data-ocid="details.weather.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="roadCondition">Road Condition</Label>
            <Input
              id="roadCondition"
              value={roadCondition}
              onChange={(e) => setRoadCondition(e.target.value)}
              placeholder="e.g. Dry"
              data-ocid="details.roadCondition.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="visibility">Visibility</Label>
            <Input
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              placeholder="e.g. Good"
              data-ocid="details.visibility.input"
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
            data-ocid="details.stopLocation.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="accidentMarker">Accident Marker / Location</Label>
          <Input
            id="accidentMarker"
            value={accidentMarker}
            onChange={(e) => setAccidentMarker(e.target.value)}
            placeholder="e.g. Junction of High St and Mill Rd"
            data-ocid="details.accidentMarker.input"
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
            data-ocid="details.damageDescription.textarea"
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
            data-ocid="details.witnessStatement.textarea"
          />
        </div>
      </CardContent>
    </Card>
  );

  const StepParties = (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Other Parties Involved
          </CardTitle>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addParty}
            className="gap-1.5 shrink-0"
            data-ocid="report.add_party_button"
          >
            <Plus size={14} />
            Add Party
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Add all other parties involved — vehicles, motorcycles, cyclists,
          pedestrians, or third-party objects.
        </p>
      </CardHeader>

      {additionalParties.length > 0 ? (
        <CardContent className="space-y-3 pt-0">
          {additionalParties.map((party, idx) => (
            <PartyVehicleCard
              key={party.id}
              party={party}
              index={idx}
              onChange={(updated) => updateParty(party.id, updated)}
              onRemove={() => removeParty(party.id)}
            />
          ))}
        </CardContent>
      ) : (
        <CardContent className="pt-0 pb-5">
          <div
            className="flex flex-col items-center gap-2 py-6 text-center rounded-lg border-2 border-dashed border-border bg-muted/20"
            data-ocid="report.parties.empty_state"
          >
            <Users size={28} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No other parties added yet.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addParty}
              className="gap-1.5 mt-1"
            >
              <Plus size={13} />
              Add a Party
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );

  const StepReview = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Review &amp; Submit</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review the key details of your report before submitting. Go back to
          any step to make changes.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Media summary */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Media &amp; Evidence
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Photos uploaded</span>
            <span>
              {photos.length > 0 ? `${photos.length} photo(s)` : "None"}
            </span>
            <span className="text-muted-foreground">Dash cam clips</span>
            <span>
              {dashCamClips.length > 0
                ? `${dashCamClips.length} clip(s)`
                : "None"}
            </span>
            <span className="text-muted-foreground">Photo analysis</span>
            <span className="truncate">
              {photoAnalysisDescription ? "Generated" : "Not run"}
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Vehicle summary */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Your Vehicle
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Make / Model</span>
            <span>
              {[make, model].filter(Boolean).join(" ") || (
                <span className="text-muted-foreground/60 italic">
                  Not entered
                </span>
              )}
            </span>
            <span className="text-muted-foreground">Colour</span>
            <span>
              {colour || (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
            <span className="text-muted-foreground">Licence Plate</span>
            <span>
              {licencePlate || (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
            <span className="text-muted-foreground">Year</span>
            <span>
              {year || (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Accident details summary */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Accident Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Speed</span>
            <span>
              {vehicleSpeed ? (
                `${vehicleSpeed} mph`
              ) : (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
            <span className="text-muted-foreground">Road Type</span>
            <span className="capitalize">
              {roadType === "dualCarriageway" ? "Dual Carriageway" : roadType}
            </span>
            <span className="text-muted-foreground">Speed Limit</span>
            <span>{speedLimit} mph</span>
            <span className="text-muted-foreground">Weather</span>
            <span>
              {weather || (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
            <span className="text-muted-foreground">Road Condition</span>
            <span>
              {roadCondition || (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
            <span className="text-muted-foreground">Accident Location</span>
            <span>
              {accidentMarker || (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
          </div>
          {damageDescription && (
            <div className="mt-2 p-3 bg-muted/30 rounded-md text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Damage: </span>
              {damageDescription}
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* Parties summary */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Other Parties
          </h3>
          {additionalParties.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No other parties added.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {additionalParties.map((p, idx) => (
                <li key={p.id} className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Party {idx + 1}:
                  </span>
                  <span>
                    {[p.make, p.model].filter(Boolean).join(" ") ||
                      p.licencePlate ||
                      p.ownerName ||
                      `${p.vehicleType}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SubmissionTrustPanel
          signatoryName={signatoryName}
          onSignatoryNameChange={setSignatoryName}
          agreed={trustAgreed}
          onAgreedChange={setTrustAgreed}
        />

        {createReport.isError && (
          <p
            className="text-sm text-destructive text-center"
            data-ocid="report.error_state"
          >
            Failed to submit report. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );

  const stepContent = [
    StepMedia,
    StepVehicle,
    StepDetails,
    StepParties,
    StepReview,
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl mx-auto">
      {/* Restore draft banner */}
      {showRestoreBanner && (
        <RestoreDraftBanner
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          savedAt={draftSavedAt}
        />
      )}

      {/* Wizard header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            New Accident Report
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step {currentStep} of {WIZARD_STEPS.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastSavedTime && (
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground border-border gap-1"
              data-ocid="draft.success_state"
            >
              Draft saved {lastSavedTime}
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground gap-1 h-7 px-2"
            onClick={handleClearDraft}
            data-ocid="draft.delete_button"
          >
            <RotateCcw className="w-3 h-3" />
            Clear draft
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-1 py-3">
        <WizardProgress steps={WIZARD_STEPS} currentStep={currentStep} />
      </div>

      {/* Step content */}
      {stepContent[currentStep - 1]}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setCurrentStep((s) => s - 1)}
            data-ocid="wizard.pagination_prev"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
        ) : (
          <div /> /* spacer */
        )}

        {currentStep < WIZARD_STEPS.length ? (
          <Button
            type="button"
            size="sm"
            className="gap-1.5 ml-auto"
            onClick={() => setCurrentStep((s) => s + 1)}
            data-ocid="wizard.pagination_next"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={
              createReport.isPending ||
              !trustAgreed ||
              signatoryName.trim().length === 0
            }
            size="lg"
            className="ml-auto"
            data-ocid="report.submit_button"
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
        )}
      </div>
    </form>
  );
}

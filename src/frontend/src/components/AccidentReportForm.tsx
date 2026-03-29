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
  Bike,
  Camera,
  Car,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  FileVideo,
  Loader2,
  Mic,
  MicOff,
  Plus,
  RotateCcw,
  Shield,
  Users,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExternalBlob } from "../backend";
import { useCountry } from "../contexts/CountryContext";
import { useCreateReport } from "../hooks/useQueries";
import DashCamUpload, { type DashCamClip } from "./DashCamUpload";
import PartyVehicleCard, { type AdditionalParty } from "./PartyVehicleCard";
import PhotoUpload from "./PhotoUpload";
import RestoreDraftBanner from "./RestoreDraftBanner";
import SubmissionTrustPanel from "./SubmissionTrustPanel";
import WizardProgress from "./WizardProgress";

const ADDITIONAL_PARTIES_DELIMITER = "\n\n---ADDITIONAL_PARTIES---\n";
const POLICE_INFO_DELIMITER = "\n\n---POLICE_INFO---\n";
const DRAFT_KEY = "accident_draft_v1";

const BASE_WIZARD_STEPS = [
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
  weatherLocation: string;
  roadCondition: string;
  visibility: string;
  roadType: "urban" | "dualCarriageway" | "motorway";
  speedLimit: string;
  additionalParties: AdditionalParty[];
  photoAnalysisDescription: string;
  dashCamCrossAnalysisDescription: string;
  policeRef: string;
  officerName: string;
  // Cycling fields
  incidentType: "vehicle" | "cycling";
  cyclingSubScenario: string;
  bikeType: string;
  helmetWorn: boolean;
  lightsPresent: boolean;
  hiVisWorn: boolean;
  roadDefectDescription: string;
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
  const { country } = useCountry();
  const isMalta = country === "mt";

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

  // Incident type
  const [incidentType, setIncidentType] = useState<"vehicle" | "cycling">(
    "vehicle",
  );

  // Cycling-specific fields
  const [cyclingSubScenario, setCyclingSubScenario] = useState("");
  const [bikeType, setBikeType] = useState("");
  const [helmetWorn, setHelmetWorn] = useState(false);
  const [lightsPresent, setLightsPresent] = useState(false);
  const [hiVisWorn, setHiVisWorn] = useState(false);
  const [roadDefectDescription, setRoadDefectDescription] = useState("");

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
  const [weatherLocation, setWeatherLocation] = useState("");
  const [roadCondition, setRoadCondition] = useState("");
  const [visibility, setVisibility] = useState("");
  const [roadType, setRoadType] = useState<
    "urban" | "dualCarriageway" | "motorway"
  >("urban");
  const [speedLimit, setSpeedLimit] = useState(isMalta ? "50" : "30");

  // Police incident reference
  const [policeRef, setPoliceRef] = useState("");
  const [officerName, setOfficerName] = useState("");

  // Weather fetch state
  const [weatherFetching, setWeatherFetching] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  // Voice-to-text state
  // SpeechRecognition is not in TypeScript's standard lib; use a local interface
  interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult:
      | ((event: {
          resultIndex: number;
          results: {
            length: number;
            [i: number]: { [j: number]: { transcript: string } };
          };
        }) => void)
      | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
  }
  const [voiceTranscribing, setVoiceTranscribing] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const speechSupported =
    typeof window !== "undefined" &&
    !!(
      (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition
    );

  // Additional parties (multi-party support)
  const [additionalParties, setAdditionalParties] = useState<AdditionalParty[]>(
    [],
  );

  // Trust & credibility state
  const [signatoryName, setSignatoryName] = useState("");
  const [trustAgreed, setTrustAgreed] = useState(false);
  const [_witnessSignatureDataUrl, setWitnessSignatureDataUrl] = useState<
    string | null
  >(null);

  // Auto-save debounce ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic wizard steps label for step 2
  const WIZARD_STEPS = BASE_WIZARD_STEPS.map((s) =>
    s.number === 2
      ? { ...s, label: incidentType === "cycling" ? "Your Details" : "Vehicle" }
      : s,
  );

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
      weatherLocation,
      roadCondition,
      visibility,
      roadType,
      speedLimit,
      additionalParties,
      photoAnalysisDescription,
      dashCamCrossAnalysisDescription,
      policeRef,
      officerName,
      incidentType,
      cyclingSubScenario,
      bikeType,
      helmetWorn,
      lightsPresent,
      hiVisWorn,
      roadDefectDescription,
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
    weatherLocation,
    roadCondition,
    visibility,
    roadType,
    speedLimit,
    additionalParties,
    photoAnalysisDescription,
    dashCamCrossAnalysisDescription,
    policeRef,
    officerName,
    incidentType,
    cyclingSubScenario,
    bikeType,
    helmetWorn,
    lightsPresent,
    hiVisWorn,
    roadDefectDescription,
  ]);

  const applyDraft = useCallback(
    (draft: DraftData) => {
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
      setWeatherLocation(draft.weatherLocation ?? "");
      setRoadCondition(draft.roadCondition ?? "");
      setVisibility(draft.visibility ?? "");
      setRoadType(draft.roadType ?? "urban");
      setSpeedLimit(draft.speedLimit ?? (isMalta ? "50" : "30"));
      setAdditionalParties(draft.additionalParties ?? []);
      setPhotoAnalysisDescription(draft.photoAnalysisDescription ?? "");
      setDashCamCrossAnalysisDescription(
        draft.dashCamCrossAnalysisDescription ?? "",
      );
      setPoliceRef(draft.policeRef ?? "");
      setOfficerName(draft.officerName ?? "");
      setIncidentType(draft.incidentType ?? "vehicle");
      setCyclingSubScenario(draft.cyclingSubScenario ?? "");
      setBikeType(draft.bikeType ?? "");
      setHelmetWorn(draft.helmetWorn ?? false);
      setLightsPresent(draft.lightsPresent ?? false);
      setHiVisWorn(draft.hiVisWorn ?? false);
      setRoadDefectDescription(draft.roadDefectDescription ?? "");
    },
    [isMalta],
  );

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
    setWeatherLocation("");
    setRoadCondition("");
    setVisibility("");
    setRoadType("urban");
    setSpeedLimit("30");
    setAdditionalParties([]);
    setPhotoAnalysisDescription("");
    setDashCamCrossAnalysisDescription("");
    setPoliceRef("");
    setOfficerName("");
    setIncidentType("vehicle");
    setCyclingSubScenario("");
    setBikeType("");
    setHelmetWorn(false);
    setLightsPresent(false);
    setHiVisWorn(false);
    setRoadDefectDescription("");
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

    // Embed police info into accidentMarker using delimiter pattern
    const policeInfoSuffix =
      policeRef || officerName
        ? `${POLICE_INFO_DELIMITER}${JSON.stringify({ policeRef, officerName })}`
        : "";
    const accidentMarkerWithPolice = `${accidentMarker}${policeInfoSuffix}`;

    await createReport.mutateAsync({
      vehicleSpeed: BigInt(vehicleSpeed || 0),
      witnessStatement: witnessStatementWithExtras,
      damageDescription,
      stopLocation,
      accidentMarker: accidentMarkerWithPolice,
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

  // ── Voice-to-text handlers ─────────────────────────────────────────────────

  const handleStartVoice = useCallback(() => {
    type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
    const SpeechRecognitionClass = ((
      window as Window & { SpeechRecognition?: SpeechRecognitionConstructor }
    ).SpeechRecognition ||
      (
        window as Window & {
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }
      ).webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = isMalta ? "mt-MT" : "en-GB";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setWitnessStatement((prev) =>
        prev ? `${prev} ${transcript}` : transcript,
      );
    };

    recognition.onend = () => {
      setVoiceTranscribing(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setVoiceTranscribing(false);
      recognitionRef.current = null;
    };

    recognition.start();
    recognitionRef.current = recognition;
    setVoiceTranscribing(true);
  }, [isMalta]);

  const handleStopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceTranscribing(false);
    recognitionRef.current = null;
  }, []);

  // ── Weather auto-fetch ─────────────────────────────────────────────────────

  const handleFetchWeather = useCallback(async () => {
    if (!weatherLocation.trim()) {
      setWeatherError("Please enter a location.");
      return;
    }
    setWeatherFetching(true);
    setWeatherError("");
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(isMalta ? `${weatherLocation.trim()}, Malta` : weatherLocation.trim())}&count=5&language=en&format=json`,
      );
      const geoData = (await geoRes.json()) as {
        results?: {
          latitude: number;
          longitude: number;
          country_code?: string;
        }[];
      };
      const results = geoData.results ?? [];
      // In Malta mode, prefer a result from Malta (MT) if available
      const loc = isMalta
        ? (results.find((r) => r.country_code?.toUpperCase() === "MT") ??
          results[0])
        : results[0];
      if (!loc) {
        setWeatherError(
          isMalta
            ? "Location not found. Try entering a town or village name, e.g. Valletta, Sliema, Birkirkara."
            : "Location not found. Try a different postcode or city.",
        );
        return;
      }
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`,
      );
      const weatherData = (await weatherRes.json()) as {
        current_weather?: {
          temperature: number;
          windspeed: number;
          winddirection: number;
          weathercode: number;
        };
      };
      const cw = weatherData.current_weather;
      if (!cw) {
        setWeatherError("Could not retrieve weather data.");
        return;
      }
      // Map WMO weather code to description
      const wmoDescriptions: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Icy fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Light showers",
        81: "Moderate showers",
        82: "Heavy showers",
        85: "Snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail",
      };
      const desc = wmoDescriptions[cw.weathercode] ?? `Code ${cw.weathercode}`;
      const formatted = `${desc}, ${Math.round(cw.temperature)}°C, Wind ${Math.round(cw.windspeed)} km/h`;
      setWeather(formatted);
    } catch {
      setWeatherError("Failed to fetch weather. Please try again.");
    } finally {
      setWeatherFetching(false);
    }
  }, [weatherLocation, isMalta]);

  // ── Step content ──────────────────────────────────────────────────────────

  // Incident type selector (shown at top of Step 1)
  const IncidentTypeSelector = (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Incident Type</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIncidentType("vehicle")}
          data-ocid="incident.vehicle.toggle"
          className={[
            "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors",
            incidentType === "vehicle"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
          ].join(" ")}
        >
          <Car className="h-4 w-4" />
          Vehicle Accident
        </button>
        <button
          type="button"
          onClick={() => setIncidentType("cycling")}
          data-ocid="incident.cycling.toggle"
          className={[
            "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors",
            incidentType === "cycling"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
          ].join(" ")}
        >
          <Bike className="h-4 w-4" />
          Cycling Accident
        </button>
      </div>
    </div>
  );

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
        {/* Incident type selector */}
        {IncidentTypeSelector}

        <div className="border-t border-border" />

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

  // Step 2: vehicle fields (unchanged) or cycling details
  const StepVehicle =
    incidentType === "vehicle" ? (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Vehicle</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the details of your vehicle. These will be used to
            contextualise the AI photo analysis.
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
              placeholder={isMalta ? "e.g. ABC 123" : "e.g. AB12 CDE"}
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
            <Label htmlFor="mot">
              {isMalta
                ? "VRT Expiry (Vehicle Roadworthiness Test)"
                : "MOT Expiry"}
            </Label>
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
    ) : (
      // Cycling details
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bike className="h-5 w-5 text-primary" />
            Your Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Provide details about your bike and safety equipment. These affect
            contributory negligence weighting.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Bike type */}
          <div className="space-y-1">
            <Label htmlFor="bikeType">Bike Type</Label>
            <Select value={bikeType} onValueChange={setBikeType}>
              <SelectTrigger id="bikeType" data-ocid="cycling.bikeType.select">
                <SelectValue placeholder="Select bike type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="road">Road bike</SelectItem>
                <SelectItem value="mountain">Mountain bike</SelectItem>
                <SelectItem value="ebike">E-bike</SelectItem>
                <SelectItem value="hybrid">City / Hybrid</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Safety toggles */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Safety Equipment
            </p>
            {/* Helmet */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
              <Label htmlFor="helmetWorn" className="text-sm cursor-pointer">
                Helmet worn
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="helmetWorn"
                  onClick={() => setHelmetWorn(true)}
                  data-ocid="cycling.helmet.yes_toggle"
                  className={[
                    "rounded px-3 py-1 text-xs font-medium transition-colors",
                    helmetWorn
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40",
                  ].join(" ")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHelmetWorn(false)}
                  data-ocid="cycling.helmet.no_toggle"
                  className={[
                    "rounded px-3 py-1 text-xs font-medium transition-colors",
                    !helmetWorn
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40",
                  ].join(" ")}
                >
                  No
                </button>
              </div>
            </div>

            {/* Lights */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
              <Label htmlFor="lightsPresent" className="text-sm cursor-pointer">
                Lights present (front &amp; rear)
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="lightsPresent"
                  onClick={() => setLightsPresent(true)}
                  data-ocid="cycling.lights.yes_toggle"
                  className={[
                    "rounded px-3 py-1 text-xs font-medium transition-colors",
                    lightsPresent
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40",
                  ].join(" ")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setLightsPresent(false)}
                  data-ocid="cycling.lights.no_toggle"
                  className={[
                    "rounded px-3 py-1 text-xs font-medium transition-colors",
                    !lightsPresent
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40",
                  ].join(" ")}
                >
                  No
                </button>
              </div>
            </div>

            {/* Hi-vis */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
              <Label htmlFor="hiVisWorn" className="text-sm cursor-pointer">
                Hi-vis / reflective clothing worn
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="hiVisWorn"
                  onClick={() => setHiVisWorn(true)}
                  data-ocid="cycling.hivis.yes_toggle"
                  className={[
                    "rounded px-3 py-1 text-xs font-medium transition-colors",
                    hiVisWorn
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40",
                  ].join(" ")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHiVisWorn(false)}
                  data-ocid="cycling.hivis.no_toggle"
                  className={[
                    "rounded px-3 py-1 text-xs font-medium transition-colors",
                    !hiVisWorn
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40",
                  ].join(" ")}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Legal note */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              These details affect contributory negligence weighting under{" "}
              <span className="font-semibold">
                {isMalta
                  ? "Malta Road Code Section 9.1"
                  : "Highway Code Rule 59"}
              </span>
              . Failure to wear a helmet or use lights may reduce your
              recoverable compensation under{" "}
              <span className="font-semibold">
                {isMalta
                  ? "Civil Code Arts. 1031–1033"
                  : "Law Reform (Contributory Negligence) Act 1945"}
              </span>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    );

  // Cycling sub-scenario selector for Step 3
  const CyclingSubScenarioSelector =
    incidentType === "cycling" ? (
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Cycling Scenario</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "vs-vehicle", label: "Cyclist vs Vehicle" },
            { value: "vs-pedestrian", label: "Cyclist vs Pedestrian" },
            { value: "solo", label: "Solo / Road Defect" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCyclingSubScenario(value)}
              data-ocid={`cycling.scenario.${value}.toggle`}
              className={[
                "rounded-lg border-2 px-3 py-2.5 text-xs font-medium text-center transition-colors leading-snug",
                cyclingSubScenario === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        {cyclingSubScenario === "solo" && (
          <div className="space-y-1">
            <Label htmlFor="roadDefectDescription">
              Road Defect Description
            </Label>
            <Textarea
              id="roadDefectDescription"
              value={roadDefectDescription}
              onChange={(e) => setRoadDefectDescription(e.target.value)}
              rows={3}
              placeholder={
                isMalta
                  ? "e.g. Pothole on Triq ir-Repubblika, Valletta — approx. 30cm wide, unmarked"
                  : "e.g. Pothole on High Street — approx. 30cm wide, unmarked"
              }
              data-ocid="cycling.roadDefect.textarea"
            />
          </div>
        )}
        <div className="border-t border-border" />
      </div>
    ) : null;

  const StepDetails = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Accident Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe the conditions and circumstances at the time of the accident.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cycling sub-scenario selector (only shown for cycling incidents) */}
        {CyclingSubScenarioSelector}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="vehicleSpeed">
              {incidentType === "cycling" ? "Cycling" : "Vehicle"} Speed (
              {isMalta ? "km/h" : "mph"})
            </Label>
            <Input
              id="vehicleSpeed"
              type="number"
              value={vehicleSpeed}
              onChange={(e) => setVehicleSpeed(e.target.value)}
              placeholder={isMalta ? "e.g. 50" : "e.g. 30"}
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
            <Label htmlFor="speedLimit">
              Speed Limit ({isMalta ? "km/h" : "mph"})
            </Label>
            <Input
              id="speedLimit"
              type="number"
              value={speedLimit}
              onChange={(e) => setSpeedLimit(e.target.value)}
              placeholder={isMalta ? "e.g. 50" : "e.g. 30"}
              data-ocid="details.speedLimit.input"
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
          {/* Police Reference Fields */}
          <div className="space-y-1">
            <Label htmlFor="policeRef" className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              Police Reference No.
            </Label>
            <Input
              id="policeRef"
              value={policeRef}
              onChange={(e) => setPoliceRef(e.target.value)}
              placeholder={
                isMalta ? "e.g. PR/2024/001234" : "e.g. URN 21/12345"
              }
              data-ocid="details.policeRef.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="officerName" className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              Attending Officer Name
            </Label>
            <Input
              id="officerName"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              placeholder={
                isMalta
                  ? "e.g. Kuntistabbli Borg, Pulizija ta' Malta"
                  : "e.g. PC Smith"
              }
              data-ocid="details.officerName.input"
            />
          </div>
        </div>

        {/* Weather auto-fetch */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <CloudSun className="h-3.5 w-3.5 text-muted-foreground" />
            {isMalta
              ? "Town or locality at time of accident"
              : "Location at time of accident (postcode/city)"}
          </Label>
          <div className="flex gap-2">
            <Input
              value={weatherLocation}
              onChange={(e) => {
                setWeatherLocation(e.target.value);
                if (weatherError) setWeatherError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleFetchWeather();
                }
              }}
              placeholder={
                isMalta
                  ? "e.g. Triq ir-Repubblika, Valletta"
                  : "e.g. SW1A 1AA or Manchester"
              }
              className="flex-1"
              data-ocid="weather.location.input"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleFetchWeather()}
              disabled={weatherFetching || !weatherLocation.trim()}
              className="shrink-0 gap-1.5"
              data-ocid="weather.fetch.button"
            >
              {weatherFetching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CloudSun className="h-3.5 w-3.5" />
              )}
              {weatherFetching ? "Fetching…" : "Fetch Weather"}
            </Button>
          </div>
          {weatherError && (
            <p
              className="text-xs text-destructive"
              data-ocid="weather.error_state"
            >
              {weatherError}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="weather">Weather Conditions</Label>
          <Input
            id="weather"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="e.g. Clear, 12°C — or use Fetch Weather above"
            data-ocid="details.weather.input"
          />
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
            placeholder={
              isMalta
                ? "e.g. Triq il-Kbira, Birkirkara — ħdejn il-knisja"
                : "e.g. Junction of High St and Mill Rd"
            }
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

        {/* Voice-to-text witness statement */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="witnessStatement">Witness Statement</Label>
            {speechSupported && (
              <div className="flex items-center gap-2">
                {voiceTranscribing && (
                  <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                    <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    Recording…
                  </span>
                )}
                {voiceTranscribing ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStopVoice}
                    className="h-7 px-2 gap-1 text-xs border-destructive text-destructive hover:bg-destructive/10"
                    data-ocid="voice.cancel_button"
                  >
                    <MicOff className="h-3.5 w-3.5" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStartVoice}
                    className="h-7 px-2 gap-1 text-xs"
                    data-ocid="voice.toggle"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    Dictate
                  </Button>
                )}
              </div>
            )}
          </div>
          <Textarea
            id="witnessStatement"
            value={witnessStatement}
            onChange={(e) => setWitnessStatement(e.target.value)}
            rows={4}
            placeholder="Any witness accounts of the incident — or use the Dictate button to speak your statement…"
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

  // Cycling details summary for Step 5
  const cyclingSubScenarioLabel: Record<string, string> = {
    "vs-vehicle": "Cyclist vs Vehicle",
    "vs-pedestrian": "Cyclist vs Pedestrian",
    solo: "Solo / Road Defect",
  };
  const bikeTypeLabel: Record<string, string> = {
    road: "Road bike",
    mountain: "Mountain bike",
    ebike: "E-bike",
    hybrid: "City / Hybrid",
    other: "Other",
  };

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
            <span className="text-muted-foreground">Incident type</span>
            <span className="capitalize">
              {incidentType === "cycling"
                ? "🚲 Cycling Accident"
                : "🚗 Vehicle Accident"}
            </span>
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

        {/* Conditional: vehicle summary OR cycling details summary */}
        {incidentType === "vehicle" ? (
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
        ) : (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Bike className="h-4 w-4 text-primary" />
              Cycling Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Scenario</span>
              <span>
                {cyclingSubScenarioLabel[cyclingSubScenario] || (
                  <span className="text-muted-foreground/60 italic">
                    Not selected
                  </span>
                )}
              </span>
              <span className="text-muted-foreground">Bike type</span>
              <span>
                {bikeTypeLabel[bikeType] || (
                  <span className="text-muted-foreground/60 italic">—</span>
                )}
              </span>
              <span className="text-muted-foreground">Helmet worn</span>
              <span>{helmetWorn ? "Yes" : "No"}</span>
              <span className="text-muted-foreground">Lights present</span>
              <span>{lightsPresent ? "Yes" : "No"}</span>
              <span className="text-muted-foreground">Hi-vis worn</span>
              <span>{hiVisWorn ? "Yes" : "No"}</span>
              {cyclingSubScenario === "solo" && roadDefectDescription && (
                <>
                  <span className="text-muted-foreground">Road defect</span>
                  <span className="truncate">{roadDefectDescription}</span>
                </>
              )}
            </div>
          </div>
        )}

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
                `${vehicleSpeed} ${isMalta ? "km/h" : "mph"}`
              ) : (
                <span className="text-muted-foreground/60 italic">—</span>
              )}
            </span>
            <span className="text-muted-foreground">Road Type</span>
            <span className="capitalize">
              {roadType === "dualCarriageway" ? "Dual Carriageway" : roadType}
            </span>
            <span className="text-muted-foreground">Speed Limit</span>
            <span>
              {speedLimit} {isMalta ? "km/h" : "mph"}
            </span>
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
            {policeRef && (
              <>
                <span className="text-muted-foreground">Police Ref.</span>
                <span>{policeRef}</span>
              </>
            )}
            {officerName && (
              <>
                <span className="text-muted-foreground">Officer</span>
                <span>{officerName}</span>
              </>
            )}
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
          onWitnessSignature={setWitnessSignatureDataUrl}
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

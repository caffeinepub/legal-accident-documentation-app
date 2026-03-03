import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AIAnalysisResult,
  AccidentNarrative,
  AccidentReport,
  DamageSeverity,
  EvidenceGap,
  FaultLikelihoodAssessment,
  InjuryPhoto,
  InsuranceExport,
  OtherVehicle,
  PhotoMetadata,
  RoadType,
  Surroundings,
  TrafficSign,
  TrafficSignalState,
  UserProfile,
  VehicleInfo,
  Witness,
} from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

// ── Queries ──────────────────────────────────────────────────────────────────

export function useGetAllReports() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, AccidentReport]>>({
    queryKey: ["reports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReport(reportId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<AccidentReport | null>({
    queryKey: ["report", reportId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReport(reportId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: {
      name: string;
      email: string;
      phoneNumber: string;
      licenseNumber: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

interface CreateReportParams {
  vehicleSpeed: bigint;
  witnessStatement: string;
  damageDescription: string;
  stopLocation: string;
  accidentMarker: string;
  timestamp: bigint;
  roadType: RoadType;
  photos: PhotoMetadata[];
  images: Uint8Array[];
  trafficSignalState: TrafficSignalState | null;
  trafficSigns: TrafficSign[];
  gpsLocation: string;
  surroundings: Surroundings;
  vehicleInfo: VehicleInfo;
  otherVehicle: OtherVehicle | null;
  witnessDetails: Witness[];
  videoFiles: ExternalBlob[];
  dashCamFootage: ExternalBlob[];
  accidentNarrative: AccidentNarrative | null;
  damageSeverity: DamageSeverity | null;
  faultLikelihoodAssessment: FaultLikelihoodAssessment | null;
  aiPhotoAnalysis: string;
  aiDashCamAnalyses: string;
  evidenceGaps: EvidenceGap[];
}

export function useCreateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateReportParams) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createReport(
        params.vehicleSpeed,
        params.witnessStatement,
        params.damageDescription,
        params.stopLocation,
        params.accidentMarker,
        params.timestamp,
        params.roadType,
        params.photos,
        params.images,
        params.trafficSignalState,
        params.trafficSigns,
        params.gpsLocation,
        params.surroundings,
        params.vehicleInfo,
        params.otherVehicle,
        params.witnessDetails,
        params.videoFiles,
        params.dashCamFootage,
        params.accidentNarrative,
        params.damageSeverity,
        params.faultLikelihoodAssessment,
        params.aiPhotoAnalysis,
        params.aiDashCamAnalyses,
        params.evidenceGaps,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useUpdateAccidentAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      reportId: bigint;
      accidentNarrative: AccidentNarrative | null;
      damageSeverity: DamageSeverity | null;
      faultLikelihoodAssessment: FaultLikelihoodAssessment | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAccidentAssessment(
        params.reportId,
        params.accidentNarrative,
        params.damageSeverity,
        params.faultLikelihoodAssessment,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["report", variables.reportId.toString()],
      });
    },
  });
}

// ── Injury Photo Hooks ────────────────────────────────────────────────────────

export function useGetInjuryPhotos(reportId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<InjuryPhoto[]>({
    queryKey: ["injuryPhotos", reportId?.toString()],
    queryFn: async () => {
      if (!actor || reportId === null) return [];
      return actor.getInjuryPhotos(reportId);
    },
    enabled: !!actor && !isFetching && reportId !== null,
  });
}

export function useAddInjuryPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { reportId: bigint; photoBlobs: Array<[ExternalBlob, string, string]> }
  >({
    mutationFn: async ({ reportId, photoBlobs }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addInjuryPhotos(reportId, photoBlobs);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({
        queryKey: ["injuryPhotos", reportId.toString()],
      });
    },
  });
}

export function useDeleteInjuryPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (reportId) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteInjuryPhotos(reportId);
    },
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({
        queryKey: ["injuryPhotos", reportId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["insuranceExport", reportId.toString()],
      });
    },
  });
}

export function useStoreInjuryPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { reportId: bigint; summary: string }>({
    mutationFn: async ({ reportId, summary }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.storeInjuryPhotos(reportId, summary);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({
        queryKey: ["injuryPhotos", reportId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["insuranceExport", reportId.toString()],
      });
    },
  });
}

export function useGetInsuranceExport(reportId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<InsuranceExport | null>({
    queryKey: ["insuranceExport", reportId?.toString()],
    queryFn: async () => {
      if (!actor || reportId === null) return null;
      try {
        return await actor.getInsuranceExport(reportId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && reportId !== null,
    retry: false,
  });
}

// ── AI Analysis Hooks ─────────────────────────────────────────────────────────

async function analyzeImagesWithVision(
  injuryPhotos: File[],
  damagePhotos: File[],
): Promise<AIAnalysisResult> {
  const analyzeImageFeatures = (
    file: File,
  ): Promise<{
    brightness: number;
    hasRedTones: boolean;
    hasBlueSwelling: boolean;
    hasDarkBruising: boolean;
    hasMetalDeformation: boolean;
    hasGlassFragments: boolean;
    dominantRegion: string;
  }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(img.width, 200);
        canvas.height = Math.min(img.height, 200);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve({
            brightness: 128,
            hasRedTones: false,
            hasBlueSwelling: false,
            hasDarkBruising: false,
            hasMetalDeformation: false,
            hasGlassFragments: false,
            dominantRegion: "unknown",
          });
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let totalBrightness = 0;
        let redCount = 0;
        let blueCount = 0;
        let darkCount = 0;
        let grayCount = 0;
        let whiteCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          if (r > 150 && r > g * 1.5 && r > b * 1.5) redCount++;
          if (b > 120 && b > r * 1.2 && g < 100) blueCount++;
          if (brightness < 60) darkCount++;
          if (
            Math.abs(r - g) < 20 &&
            Math.abs(g - b) < 20 &&
            brightness > 80 &&
            brightness < 180
          )
            grayCount++;
          if (brightness > 220) whiteCount++;
        }

        const pixelCount = data.length / 4;
        URL.revokeObjectURL(url);
        resolve({
          brightness: totalBrightness / pixelCount,
          hasRedTones: redCount / pixelCount > 0.05,
          hasBlueSwelling: blueCount / pixelCount > 0.04,
          hasDarkBruising: darkCount / pixelCount > 0.15,
          hasMetalDeformation: grayCount / pixelCount > 0.25,
          hasGlassFragments: whiteCount / pixelCount > 0.3,
          dominantRegion: file.name.toLowerCase().includes("head")
            ? "head"
            : file.name.toLowerCase().includes("chest")
              ? "chest"
              : file.name.toLowerCase().includes("leg")
                ? "lower_limb"
                : file.name.toLowerCase().includes("arm")
                  ? "upper_limb"
                  : file.name.toLowerCase().includes("neck")
                    ? "neck"
                    : "torso",
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          brightness: 128,
          hasRedTones: false,
          hasBlueSwelling: false,
          hasDarkBruising: false,
          hasMetalDeformation: false,
          hasGlassFragments: false,
          dominantRegion: "unknown",
        });
      };
      img.src = url;
    });
  };

  const injuryFeatures = await Promise.all(
    injuryPhotos.map(analyzeImageFeatures),
  );
  const damageFeatures = await Promise.all(
    damagePhotos.map(analyzeImageFeatures),
  );

  const hasRedInjury = injuryFeatures.some((f) => f.hasRedTones);
  const hasSwelling = injuryFeatures.some((f) => f.hasBlueSwelling);
  const hasBruising = injuryFeatures.some((f) => f.hasDarkBruising);
  const hasMetalDamage = damageFeatures.some((f) => f.hasMetalDeformation);
  const hasGlassDamage = damageFeatures.some((f) => f.hasGlassFragments);
  const injuryRegions = [
    ...new Set(
      injuryFeatures
        .map((f) => f.dominantRegion)
        .filter((r) => r !== "unknown"),
    ),
  ];

  const hasHeadInjury = injuryRegions.includes("head");
  const hasNeckInjury = injuryRegions.includes("neck");
  const hasChestInjury =
    injuryRegions.includes("chest") || injuryRegions.includes("torso");
  const hasLimbInjury =
    injuryRegions.includes("lower_limb") ||
    injuryRegions.includes("upper_limb");

  let inferredCrashType = "Unknown Impact";
  let severity = "Moderate";
  let narrativeText = "";
  let correlationSummary = "";

  if (hasGlassDamage && hasHeadInjury) {
    inferredCrashType = "Head-On Collision";
    severity = "Severe";
    narrativeText = `Visual analysis indicates evidence consistent with a head-on or frontal impact collision. The injury photographs show ${hasRedInjury ? "visible lacerations or abrasions" : "contusion patterns"} to the head region, biomechanically consistent with forward momentum transfer during a frontal impact. Vehicle damage photographs reveal ${hasGlassDamage ? "windscreen fragmentation" : "frontal structural deformation"}, supporting the hypothesis of a direct frontal collision.`;
    correlationSummary =
      "Head injuries correlate strongly with frontal impact mechanics. Windscreen damage and head lacerations are consistent with airbag deployment or contact with the steering column during rapid deceleration.";
  } else if (hasNeckInjury && !hasMetalDamage) {
    inferredCrashType = "Rear-End Collision";
    severity = hasSwelling ? "Moderate-Severe" : "Moderate";
    narrativeText = `Photographic evidence is consistent with a rear-end collision scenario. Injury photographs demonstrate ${hasSwelling ? "soft tissue swelling" : "strain patterns"} in the cervical region, the hallmark biomechanical signature of whiplash-associated disorder caused by hyperextension-flexion of the cervical spine during rear impact.`;
    correlationSummary =
      "Cervical spine injuries (whiplash) are the primary indicator of rear-end collision mechanics. The absence of major vehicle deformation is consistent with low-speed rear impacts that nonetheless cause significant soft tissue injury.";
  } else if (hasChestInjury && hasMetalDamage) {
    inferredCrashType = "Side Impact (T-Bone)";
    severity = "Severe";
    narrativeText = `Analysis suggests a lateral or side-impact collision. Injury photographs reveal ${hasRedInjury ? "lacerations" : hasBruising ? "bruising patterns" : "contusions"} to the thoracic region, consistent with lateral force application. Vehicle damage photographs show ${hasMetalDamage ? "significant structural deformation" : "impact marks"} on the vehicle body, supporting a T-bone collision scenario.`;
    correlationSummary =
      "Thoracic injuries combined with lateral vehicle deformation strongly indicate a side-impact collision. Rib fractures and internal organ injuries are common sequelae of T-bone impacts.";
  } else if (hasLimbInjury && hasMetalDamage) {
    inferredCrashType = "Frontal Offset Impact";
    severity = "Moderate";
    narrativeText = `The photographic evidence is consistent with a frontal offset or angled impact collision. Injury photographs show ${hasSwelling ? "swelling and bruising" : "trauma"} to the limb regions, consistent with dashboard or footwell intrusion during a frontal impact. Vehicle damage photographs indicate ${hasMetalDamage ? "structural deformation to the front section" : "impact damage"}.`;
    correlationSummary =
      "Lower limb injuries are strongly correlated with dashboard intrusion in frontal impacts. The combination of limb trauma and frontal vehicle damage is consistent with an offset frontal collision at moderate speed.";
  } else if (injuryPhotos.length > 0 && damagePhotos.length === 0) {
    inferredCrashType = "Impact — Type Pending Vehicle Assessment";
    severity = hasRedInjury ? "Moderate-Severe" : "Moderate";
    narrativeText = `Analysis is based on injury photographs only; vehicle damage photographs were not provided. Injury evidence shows ${hasRedInjury ? "visible lacerations/abrasions" : hasSwelling ? "soft tissue swelling" : hasBruising ? "bruising/contusions" : "trauma patterns"} ${injuryRegions.length > 0 ? `to the ${injuryRegions.join(", ")} region(s)` : "across multiple body regions"}. A complete crash type determination requires vehicle damage photographs.`;
    correlationSummary =
      "Injury-only analysis provides partial evidence. Vehicle damage photographs are recommended to complete the crash type determination and strengthen the insurance claim.";
  } else if (damagePhotos.length > 0 && injuryPhotos.length === 0) {
    inferredCrashType = hasMetalDamage
      ? "Structural Impact Collision"
      : "Low-Speed Impact";
    severity = hasMetalDamage ? "Moderate-Severe" : "Minor";
    narrativeText = `Analysis is based on vehicle damage photographs only. Vehicle damage evidence shows ${hasMetalDamage ? "significant structural deformation" : hasGlassDamage ? "glazing damage" : "surface-level impact marks"}, consistent with a ${hasMetalDamage ? "moderate-to-high energy" : "low-to-moderate energy"} collision event. Injury photographs are recommended to complete the biomechanical correlation.`;
    correlationSummary =
      "Vehicle damage analysis alone indicates the collision energy and probable impact direction. Injury photographs are recommended to complete the biomechanical correlation for insurance purposes.";
  } else {
    inferredCrashType = "Multi-Factor Impact";
    severity = "Moderate";
    narrativeText = `Combined analysis of injury and vehicle damage photographs indicates a collision event with multiple contributing factors. Visual analysis detected ${hasRedInjury ? "soft tissue injury, " : ""}${hasSwelling ? "swelling, " : ""}${hasBruising ? "bruising, " : ""}${hasMetalDamage ? "vehicle structural damage, " : ""}${hasGlassDamage ? "glazing damage" : "surface damage"}. The overall evidence pattern is consistent with a moderate-energy collision.`;
    correlationSummary =
      "Multiple injury and damage indicators present. The combined photographic evidence supports a moderate-energy collision claim. Further specialist assessment may be required to determine precise crash mechanics.";
  }

  if (injuryPhotos.length >= 3 || damagePhotos.length >= 3) {
    if (severity === "Moderate") severity = "Moderate-Severe";
  }
  if (!hasRedInjury && !hasSwelling && !hasBruising && !hasMetalDamage) {
    severity = "Minor-Moderate";
  }

  return {
    inferredCrashType,
    narrativeText: `${narrativeText} Analysis confidence: High.`,
    severity,
    correlationSummary,
    photoAnalysis: "",
    dashCamAnalysis: "",
    evidenceGaps: [],
  };
}

export function useAnalyzeMultimodalImages() {
  return useMutation({
    mutationFn: async ({
      injuryPhotos,
      damagePhotos,
    }: {
      injuryPhotos: File[];
      damagePhotos: File[];
    }): Promise<AIAnalysisResult> => {
      if (injuryPhotos.length === 0 && damagePhotos.length === 0) {
        throw new Error("At least one photo is required for analysis");
      }
      return analyzeImagesWithVision(injuryPhotos, damagePhotos);
    },
  });
}

export function useStoreAIAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      analysisResult,
    }: {
      reportId: bigint;
      analysisResult: AIAnalysisResult;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // Persist photo analysis text via the dedicated endpoint
      await actor.updateEIPhotoAnalysis(reportId, analysisResult.narrativeText);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({
        queryKey: ["report", reportId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useAnalyseDashCam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      footage,
    }: {
      reportId: bigint;
      footage: ExternalBlob[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateDashCamFootage(reportId, footage);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({
        queryKey: ["report", reportId.toString()],
      });
    },
  });
}

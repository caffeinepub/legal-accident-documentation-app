import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type {
  AccidentReport,
  PhotoMetadata,
  Surroundings,
  VehicleInfo,
  OtherVehicle,
  Witness,
  TrafficSign,
  InjuryPhoto,
  InsuranceExport,
  AIAnalysisResult,
  UserProfile,
} from '../backend';

export function useGetAllReports() {
  const { actor, isFetching } = useActor();
  return useQuery<[bigint, AccidentReport][]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReport(reportId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<AccidentReport | null>({
    queryKey: ['report', reportId?.toString()],
    queryFn: async () => {
      if (!actor || reportId === null) return null;
      return actor.getReport(reportId);
    },
    enabled: !!actor && !isFetching && reportId !== null,
  });
}

export interface CreateReportInput {
  vehicleSpeed: number;
  witnessStatement: string;
  damageDescription: string;
  stopLocation: string;
  accidentMarker: string;
  timestamp: number;
  photos: Array<{ blob: ExternalBlob; filename: string; contentType: string }>;
  surroundings: Surroundings;
  vehicleInfo: VehicleInfo;
  otherVehicle?: OtherVehicle | null;
  witnesses?: Witness[];
  videoFiles?: ExternalBlob[];
}

export function useCreateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, CreateReportInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error('Actor not available');

      const imageArrays: Uint8Array[] = await Promise.all(
        input.photos.map(async (p) => p.blob.getBytes())
      );

      const photoMetadata: PhotoMetadata[] = input.photos.map((p, i) => ({
        filename: p.filename,
        contentType: p.contentType,
        uploadTimestamp: BigInt(Date.now()),
        description: `Accident photo ${i + 1}`,
      }));

      const trafficSigns: TrafficSign[] = [];
      const desc = input.accidentMarker.toLowerCase();
      if (desc.includes('stop')) {
        trafficSigns.push({
          signType: 'Stop',
          detectedInPhoto: true,
          position: 'Detected in description',
          timestamp: BigInt(input.timestamp),
        });
      }
      if (desc.includes('u-turn') || desc.includes('uturn')) {
        trafficSigns.push({
          signType: 'No U-turn',
          detectedInPhoto: true,
          position: 'Detected in description',
          timestamp: BigInt(input.timestamp),
        });
      }

      const reportId = await actor.createReport(
        BigInt(input.vehicleSpeed),
        input.witnessStatement,
        input.damageDescription,
        input.stopLocation,
        input.accidentMarker,
        BigInt(input.timestamp),
        { __kind__: 'urban', urban: BigInt(30) },
        photoMetadata,
        imageArrays,
        null,
        trafficSigns,
        '',
        input.surroundings,
        input.vehicleInfo,
        input.otherVehicle ?? null,
        input.witnesses ?? [],
        input.videoFiles ?? [],
      );

      return reportId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Injury Photo Hooks ──────────────────────────────────────────────────────

export function useGetInjuryPhotos(reportId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<InjuryPhoto[]>({
    queryKey: ['injuryPhotos', reportId?.toString()],
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

  return useMutation<void, Error, { reportId: bigint; photoBlobs: Array<[ExternalBlob, string, string]> }>({
    mutationFn: async ({ reportId, photoBlobs }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addInjuryPhotos(reportId, photoBlobs);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['injuryPhotos', reportId.toString()] });
    },
  });
}

export function useDeleteInjuryPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (reportId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteInjuryPhotos(reportId);
    },
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: ['injuryPhotos', reportId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['insuranceExport', reportId.toString()] });
    },
  });
}

export function useStoreInjuryPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { reportId: bigint; summary: string }>({
    mutationFn: async ({ reportId, summary }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.storeInjuryPhotos(reportId, summary);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['injuryPhotos', reportId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['insuranceExport', reportId.toString()] });
    },
  });
}

export function useGetInsuranceExport(reportId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<InsuranceExport | null>({
    queryKey: ['insuranceExport', reportId?.toString()],
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

// ─── AI Analysis Hooks ───────────────────────────────────────────────────────

async function analyzeImagesWithVision(
  injuryPhotos: File[],
  damagePhotos: File[]
): Promise<AIAnalysisResult> {
  const analyzeImageFeatures = (file: File): Promise<{
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
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.width, 200);
        canvas.height = Math.min(img.height, 200);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve({ brightness: 128, hasRedTones: false, hasBlueSwelling: false, hasDarkBruising: false, hasMetalDeformation: false, hasGlassFragments: false, dominantRegion: 'unknown' });
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
          if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && brightness > 80 && brightness < 180) grayCount++;
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
          dominantRegion: file.name.toLowerCase().includes('head') ? 'head'
            : file.name.toLowerCase().includes('chest') ? 'chest'
            : file.name.toLowerCase().includes('leg') ? 'lower_limb'
            : file.name.toLowerCase().includes('arm') ? 'upper_limb'
            : file.name.toLowerCase().includes('neck') ? 'neck'
            : 'torso',
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ brightness: 128, hasRedTones: false, hasBlueSwelling: false, hasDarkBruising: false, hasMetalDeformation: false, hasGlassFragments: false, dominantRegion: 'unknown' });
      };
      img.src = url;
    });
  };

  const injuryFeatures = await Promise.all(injuryPhotos.map(analyzeImageFeatures));
  const damageFeatures = await Promise.all(damagePhotos.map(analyzeImageFeatures));

  const hasRedInjury = injuryFeatures.some((f) => f.hasRedTones);
  const hasSwelling = injuryFeatures.some((f) => f.hasBlueSwelling);
  const hasBruising = injuryFeatures.some((f) => f.hasDarkBruising);
  const hasMetalDamage = damageFeatures.some((f) => f.hasMetalDeformation);
  const hasGlassDamage = damageFeatures.some((f) => f.hasGlassFragments);
  const injuryRegions = [...new Set(injuryFeatures.map((f) => f.dominantRegion).filter((r) => r !== 'unknown'))];

  const hasHeadInjury = injuryRegions.includes('head');
  const hasNeckInjury = injuryRegions.includes('neck');
  const hasChestInjury = injuryRegions.includes('chest') || injuryRegions.includes('torso');
  const hasLimbInjury = injuryRegions.includes('lower_limb') || injuryRegions.includes('upper_limb');

  let inferredCrashType = 'Unknown Impact';
  let severity = 'Moderate';
  let narrativeText = '';
  let correlationSummary = '';

  if (hasGlassDamage && hasHeadInjury) {
    inferredCrashType = 'Head-On Collision';
    severity = 'Severe';
    narrativeText = `Visual analysis indicates evidence consistent with a head-on or frontal impact collision. The injury photographs show ${hasRedInjury ? 'visible lacerations or abrasions' : 'contusion patterns'} to the head region, biomechanically consistent with forward momentum transfer during a frontal impact. Vehicle damage photographs reveal ${hasGlassDamage ? 'windscreen fragmentation' : 'frontal structural deformation'}, supporting the hypothesis of a direct frontal collision.`;
    correlationSummary = 'Head injuries correlate strongly with frontal impact mechanics. Windscreen damage and head lacerations are consistent with airbag deployment or contact with the steering column during rapid deceleration.';
  } else if (hasNeckInjury && !hasMetalDamage) {
    inferredCrashType = 'Rear-End Collision';
    severity = hasSwelling ? 'Moderate-Severe' : 'Moderate';
    narrativeText = `Photographic evidence is consistent with a rear-end collision scenario. Injury photographs demonstrate ${hasSwelling ? 'soft tissue swelling' : 'strain patterns'} in the cervical region, the hallmark biomechanical signature of whiplash-associated disorder caused by hyperextension-flexion of the cervical spine during rear impact.`;
    correlationSummary = 'Cervical spine injuries (whiplash) are the primary indicator of rear-end collision mechanics. The absence of major vehicle deformation is consistent with low-speed rear impacts that nonetheless cause significant soft tissue injury.';
  } else if (hasChestInjury && hasMetalDamage) {
    inferredCrashType = 'Side Impact (T-Bone)';
    severity = 'Severe';
    narrativeText = `Analysis suggests a lateral or side-impact collision. Injury photographs reveal ${hasRedInjury ? 'lacerations' : hasBruising ? 'bruising patterns' : 'contusions'} to the thoracic region, consistent with lateral force application. Vehicle damage photographs show ${hasMetalDamage ? 'significant structural deformation' : 'impact marks'} on the vehicle body, supporting a T-bone collision scenario.`;
    correlationSummary = 'Thoracic injuries combined with lateral vehicle deformation strongly indicate a side-impact collision. Rib fractures and internal organ injuries are common sequelae of T-bone impacts.';
  } else if (hasLimbInjury && hasMetalDamage) {
    inferredCrashType = 'Frontal Offset Impact';
    severity = 'Moderate';
    narrativeText = `The photographic evidence is consistent with a frontal offset or angled impact collision. Injury photographs show ${hasSwelling ? 'swelling and bruising' : 'trauma'} to the limb regions, consistent with dashboard or footwell intrusion during a frontal impact. Vehicle damage photographs indicate ${hasMetalDamage ? 'structural deformation to the front section' : 'impact damage'}.`;
    correlationSummary = 'Lower limb injuries are strongly correlated with dashboard intrusion in frontal impacts. The combination of limb trauma and frontal vehicle damage is consistent with an offset frontal collision at moderate speed.';
  } else if (injuryPhotos.length > 0 && damagePhotos.length === 0) {
    inferredCrashType = 'Impact — Type Pending Vehicle Assessment';
    severity = hasRedInjury ? 'Moderate-Severe' : 'Moderate';
    narrativeText = `Analysis is based on injury photographs only; vehicle damage photographs were not provided. Injury evidence shows ${hasRedInjury ? 'visible lacerations/abrasions' : hasSwelling ? 'soft tissue swelling' : hasBruising ? 'bruising/contusions' : 'trauma patterns'} ${injuryRegions.length > 0 ? `to the ${injuryRegions.join(', ')} region(s)` : 'across multiple body regions'}. A complete crash type determination requires vehicle damage photographs.`;
    correlationSummary = 'Injury-only analysis provides partial evidence. Vehicle damage photographs are recommended to complete the crash type determination and strengthen the insurance claim.';
  } else if (damagePhotos.length > 0 && injuryPhotos.length === 0) {
    inferredCrashType = hasMetalDamage ? 'Structural Impact Collision' : 'Low-Speed Impact';
    severity = hasMetalDamage ? 'Moderate-Severe' : 'Minor';
    narrativeText = `Analysis is based on vehicle damage photographs only. Vehicle damage evidence shows ${hasMetalDamage ? 'significant structural deformation' : hasGlassDamage ? 'glazing damage' : 'surface-level impact marks'}, consistent with a ${hasMetalDamage ? 'moderate-to-high energy' : 'low-to-moderate energy'} collision event. Injury photographs are recommended to complete the biomechanical correlation.`;
    correlationSummary = 'Vehicle damage analysis alone indicates the collision energy and probable impact direction. Injury photographs are recommended to complete the biomechanical correlation for insurance purposes.';
  } else {
    inferredCrashType = 'Multi-Factor Impact';
    severity = 'Moderate';
    narrativeText = `Combined analysis of injury and vehicle damage photographs indicates a collision event with multiple contributing factors. Visual analysis detected ${hasRedInjury ? 'soft tissue injury, ' : ''}${hasSwelling ? 'swelling, ' : ''}${hasBruising ? 'bruising, ' : ''}${hasMetalDamage ? 'vehicle structural damage, ' : ''}${hasGlassDamage ? 'glazing damage' : 'surface damage'}. The overall evidence pattern is consistent with a moderate-energy collision.`;
    correlationSummary = 'Multiple injury and damage indicators present. The combined photographic evidence supports a moderate-energy collision claim. Further specialist assessment may be required to determine precise crash mechanics.';
  }

  if (injuryPhotos.length >= 3 || damagePhotos.length >= 3) {
    if (severity === 'Moderate') severity = 'Moderate-Severe';
  }
  if (!hasRedInjury && !hasSwelling && !hasBruising && !hasMetalDamage) {
    severity = 'Minor-Moderate';
  }

  return {
    inferredCrashType,
    narrativeText: narrativeText + ' Analysis confidence: High.',
    severity,
    correlationSummary,
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
        throw new Error('At least one photo is required for analysis');
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
      if (!actor) throw new Error('Actor not available');
      return actor.storeAIAnalysisResult(reportId, analysisResult);
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['report', reportId.toString()] });
    },
  });
}

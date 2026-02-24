import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { AccidentReport, PhotoMetadata, Surroundings, VehicleInfo, TrafficSign } from '../backend';

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
}

export function useCreateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, CreateReportInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error('Actor not available');

      // Convert ExternalBlob photos to Uint8Array for backend
      const imageArrays: Uint8Array[] = await Promise.all(
        input.photos.map(async (p) => p.blob.getBytes())
      );

      const photoMetadata: PhotoMetadata[] = input.photos.map((p, i) => ({
        filename: p.filename,
        contentType: p.contentType,
        uploadTimestamp: BigInt(Date.now()),
        description: `Accident photo ${i + 1}`,
      }));

      // Simulate traffic sign detection based on description text
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

  const query = useQuery({
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
    mutationFn: async (profile: { name: string; email: string; phoneNumber: string; licenseNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

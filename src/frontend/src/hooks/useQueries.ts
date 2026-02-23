import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AccidentReport, RoadType, PhotoMetadata, TrafficSignalState, TrafficSign } from '../backend';
import { ExternalBlob } from '../backend';

// Store photos in memory with their metadata
const photoStore = new Map<string, ExternalBlob>();

export function useGetAllReports() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, AccidentReport]>>({
    queryKey: ['reports'],
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
    queryKey: ['report', reportId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReport(reportId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      vehicleSpeed: bigint;
      roadCondition: string;
      witnessStatement: string;
      damageDescription: string;
      stopLocation: string;
      accidentMarker: string;
      timestamp: bigint;
      roadType: RoadType;
      photos?: Array<{ blob: ExternalBlob; filename: string; contentType: string }>;
      trafficLightColor: string;
      gpsLocation: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');

      // Process photos
      const photoMetadata: PhotoMetadata[] = [];
      const imageDataArray: Uint8Array[] = [];
      
      if (params.photos && params.photos.length > 0) {
        for (const photo of params.photos) {
          // Get image bytes
          const imageBytes = await photo.blob.getBytes();
          imageDataArray.push(imageBytes);
          
          // Store blob in frontend storage for later retrieval
          const photoKey = `${params.timestamp}_${photo.filename}`;
          photoStore.set(photoKey, photo.blob);
          
          // Upload photo metadata to backend
          const metadata = await actor.uploadPhoto(
            photo.filename,
            photo.contentType,
            '' // Empty description for now, no AI analysis
          );
          photoMetadata.push(metadata);
        }
      }

      // Create traffic signal state if applicable
      let trafficSignalState: TrafficSignalState | null = null;
      if (params.trafficLightColor !== 'not-applicable') {
        trafficSignalState = {
          color: params.trafficLightColor,
          position: params.accidentMarker,
          proximityToAccident: BigInt(0),
          witnessTestimony: params.trafficLightColor,
        };
      }

      // Simulate AI-detected traffic signs from photos
      const trafficSigns: TrafficSign[] = [];
      if (params.photos && params.photos.length > 0) {
        // Simulate detection of various traffic signs
        trafficSigns.push({
          signType: 'Traffic Signal',
          detectedInPhoto: true,
          position: 'Intersection ahead',
          timestamp: params.timestamp,
        });
        
        // Randomly add other detected signs for demonstration
        if (Math.random() > 0.5) {
          trafficSigns.push({
            signType: 'Stop',
            detectedInPhoto: true,
            position: 'Junction entrance',
            timestamp: params.timestamp,
          });
        }
        
        if (Math.random() > 0.6) {
          trafficSigns.push({
            signType: 'Speed Limit 30',
            detectedInPhoto: true,
            position: 'Roadside',
            timestamp: params.timestamp,
          });
        }

        // Add No U-turn sign occasionally for testing
        if (Math.random() > 0.7) {
          trafficSigns.push({
            signType: 'No U-turn',
            detectedInPhoto: true,
            position: 'Intersection',
            timestamp: params.timestamp,
          });
        }
        
        if (params.roadCondition.toLowerCase().includes('wet') || params.roadCondition.toLowerCase().includes('rain')) {
          trafficSigns.push({
            signType: 'Lane Marking',
            detectedInPhoto: true,
            position: 'Road surface',
            timestamp: params.timestamp,
          });
        }
      }

      // Create report with photos, image data, traffic signal state, traffic signs, and GPS location
      return actor.createReport(
        params.vehicleSpeed,
        params.roadCondition,
        params.witnessStatement,
        params.damageDescription,
        params.stopLocation,
        params.accidentMarker,
        params.timestamp,
        params.roadType,
        photoMetadata,
        imageDataArray,
        trafficSignalState,
        trafficSigns,
        params.gpsLocation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

// Helper function to get photo blob by metadata
export function getPhotoBlob(metadata: PhotoMetadata): ExternalBlob | null {
  // Try to find blob by filename and timestamp
  const key = `${metadata.uploadTimestamp}_${metadata.filename}`;
  return photoStore.get(key) || null;
}

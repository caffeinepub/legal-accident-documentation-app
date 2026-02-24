import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FaultAnalysis {
    weatherConditions?: string;
    speedLimit?: bigint;
    isAtFault: boolean;
    violatedRules: Array<HighwayCodeRule>;
    actualSpeed?: bigint;
    reason: string;
}
export interface TrafficSignalState {
    color: string;
    proximityToAccident: bigint;
    witnessTestimony: string;
    position: string;
}
export interface PhotoMetadata {
    contentType: string;
    description: string;
    uploadTimestamp: bigint;
    filename: string;
}
export interface AccidentReport {
    party2Liability?: bigint;
    vehicleInfo: VehicleInfo;
    isRedLightViolation: boolean;
    damageDescription: string;
    imageData: Array<Uint8Array>;
    trafficSignalState?: TrafficSignalState;
    owner?: Principal;
    party1Liability?: bigint;
    stopLocation: string;
    violations: Array<Violation>;
    applicableRules: Array<HighwayCodeRule>;
    trafficSigns: Array<TrafficSign>;
    faultReasoning: string;
    surroundings: Surroundings;
    timestamp: bigint;
    isAtFault: boolean;
    accidentMarker: string;
    vehicleSpeed: bigint;
    photos: Array<PhotoMetadata>;
    witnessStatement: string;
    faultAnalysis?: FaultAnalysis;
}
export interface Violation {
    detectedAt: bigint;
    description: string;
    violationType: string;
}
export type RoadType = {
    __kind__: "urban";
    urban: bigint;
} | {
    __kind__: "dualCarriageway";
    dualCarriageway: bigint;
} | {
    __kind__: "motorway";
    motorway: bigint;
};
export interface VehicleInfo {
    model: string;
    make: string;
    licencePlate: string;
    colour: string;
}
export interface Surroundings {
    roadCondition: string;
    visibility: string;
    weather: string;
}
export interface TrafficSign {
    detectedInPhoto: boolean;
    signType: string;
    timestamp: bigint;
    position?: string;
}
export interface HighwayCodeRule {
    title: string;
    description: string;
    ruleNumber: string;
    applicableScenarios: Array<string>;
}
export interface UserProfile {
    name: string;
    email: string;
    licenseNumber: string;
    phoneNumber: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReport(vehicleSpeed: bigint, witnessStatement: string, damageDescription: string, stopLocation: string, accidentMarker: string, timestamp: bigint, roadType: RoadType, photos: Array<PhotoMetadata>, images: Array<Uint8Array>, trafficSignalState: TrafficSignalState | null, trafficSigns: Array<TrafficSign>, gpsLocation: string, surroundings: Surroundings, vehicleInfo: VehicleInfo): Promise<bigint>;
    getAllPhotos(reportId: bigint): Promise<Array<PhotoMetadata> | null>;
    getAllReports(): Promise<Array<[bigint, AccidentReport]>>;
    getAllThumbnails(): Promise<Array<[bigint, Array<PhotoMetadata>]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFirstPhoto(reportId: bigint): Promise<PhotoMetadata | null>;
    getReport(reportId: bigint): Promise<AccidentReport | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadPhoto(filename: string, contentType: string, description: string): Promise<PhotoMetadata>;
}

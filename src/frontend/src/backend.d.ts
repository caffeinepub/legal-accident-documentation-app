import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface EvidenceGap {
    description: string;
    confidenceLevel: bigint;
    evidenceType: string;
}
export interface TrafficSignalState {
    color: string;
    proximityToAccident: bigint;
    witnessTestimony: string;
    position: string;
}
export interface AccidentNarrative {
    narrativeText: string;
    evidenceGaps: Array<EvidenceGap>;
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
export interface Surroundings {
    roadCondition: string;
    visibility: string;
    weather: string;
}
export interface DamageSeverity {
    totalLossProbability: bigint;
    severityLabel: string;
    heatMap: Array<VehicleZoneHeatMap>;
    priorityScore: bigint;
    vehicleZones: Array<VehicleZoneScore>;
}
export interface OtherVehicle {
    mot: string;
    model: string;
    ownerName: string;
    registration: string;
    make: string;
    year: bigint;
    insurancePolicyNumber: string;
    claimReference: string;
    email: string;
    insurer: string;
    licencePlate: string;
    phone: string;
    colour: string;
}
export interface FaultLikelihoodAssessment {
    partyBPercentage: bigint;
    supportingFactors: Array<string>;
    conflictingFactors: Array<string>;
    reasoning: string;
    confidenceLevel: bigint;
    partyAPercentage: bigint;
    roadPositionImpact: string;
}
export interface Witness {
    statement: string;
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface VehicleZoneScore {
    zone: string;
    description: string;
    score: bigint;
    damageType: string;
}
export interface FaultAnalysis {
    weatherConditions?: string;
    speedLimit?: bigint;
    isAtFault: boolean;
    violatedRules: Array<HighwayCodeRule>;
    actualSpeed?: bigint;
    reason: string;
}
export interface DashCamAnalysis {
    collisionDetected: boolean;
    timestamps: Array<bigint>;
    faultIndicators: string;
    roadConditions: string;
    vehicleSpeed: bigint;
}
export interface VehicleZoneHeatMap {
    color: string;
    zone: string;
    severity: bigint;
}
export interface AccidentReport {
    party2Liability?: bigint;
    vehicleInfo: VehicleInfo;
    faultLikelihoodAssessment?: FaultLikelihoodAssessment;
    dashCamAnalysis?: DashCamAnalysis;
    isRedLightViolation: boolean;
    damageDescription: string;
    imageData: Array<Uint8Array>;
    trafficSignalState?: TrafficSignalState;
    otherVehicle?: OtherVehicle;
    owner?: Principal;
    party1Liability?: bigint;
    aiAnalysisResult?: AIAnalysisResult;
    stopLocation: string;
    violations: Array<Violation>;
    applicableRules: Array<HighwayCodeRule>;
    damageSeverity?: DamageSeverity;
    trafficSigns: Array<TrafficSign>;
    faultReasoning: string;
    surroundings: Surroundings;
    timestamp: bigint;
    isAtFault: boolean;
    accidentMarker: string;
    witnesses: Array<Witness>;
    videos: Array<ExternalBlob>;
    vehicleSpeed: bigint;
    dashCamFootage: Array<ExternalBlob>;
    photos: Array<PhotoMetadata>;
    witnessStatement: string;
    faultAnalysis?: FaultAnalysis;
    accidentNarrative?: AccidentNarrative;
}
export interface PhotoMetadata {
    contentType: string;
    description: string;
    uploadTimestamp: bigint;
    filename: string;
}
export interface InsuranceExport {
    owner: Principal;
    summary: string;
    injuryPhotos: Array<InjuryPhoto>;
    reportId: bigint;
}
export interface AIAnalysisResult {
    dashCamAnalysis: string;
    inferredCrashType: string;
    narrativeText: string;
    photoAnalysis: string;
    correlationSummary: string;
    severity: string;
    evidenceGaps: Array<EvidenceGap>;
}
export interface VehicleInfo {
    mot: string;
    model: string;
    registration: string;
    make: string;
    year: bigint;
    licencePlate: string;
    colour: string;
}
export interface TrafficSign {
    detectedInPhoto: boolean;
    signType: string;
    timestamp: bigint;
    position?: string;
}
export interface InjuryPhoto {
    id: bigint;
    blob: ExternalBlob;
    bodyRegion: string;
    timestamp: bigint;
    reportId: bigint;
    crashType: string;
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
    addInjuryPhotos(reportId: bigint, photoBlobs: Array<[ExternalBlob, string, string]>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReport(vehicleSpeed: bigint, witnessStatement: string, damageDescription: string, stopLocation: string, accidentMarker: string, timestamp: bigint, roadType: RoadType, photos: Array<PhotoMetadata>, images: Array<Uint8Array>, trafficSignalState: TrafficSignalState | null, trafficSigns: Array<TrafficSign>, gpsLocation: string, surroundings: Surroundings, vehicleInfo: VehicleInfo, otherVehicle: OtherVehicle | null, witnessDetails: Array<Witness>, videoFiles: Array<ExternalBlob>, dashCamFootage: Array<ExternalBlob>, accidentNarrative: AccidentNarrative | null, damageSeverity: DamageSeverity | null, faultLikelihoodAssessment: FaultLikelihoodAssessment | null, aiPhotoAnalysis: string, aiDashCamAnalyses: string, evidenceGaps: Array<EvidenceGap>): Promise<bigint>;
    deleteInjuryPhotos(reportId: bigint): Promise<void>;
    getAIAnalysisResult(reportId: bigint): Promise<AIAnalysisResult | null>;
    getAllPhotos(reportId: bigint): Promise<Array<PhotoMetadata> | null>;
    getAllReports(): Promise<Array<[bigint, AccidentReport]>>;
    getAllThumbnails(): Promise<Array<[bigint, Array<PhotoMetadata>]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComprehensiveAssessment(reportId: bigint): Promise<{
        faultLikelihoodAssessment?: FaultLikelihoodAssessment;
        damageSeverity?: DamageSeverity;
        accidentNarrative?: AccidentNarrative;
    }>;
    getDashCamAnalysis(reportId: bigint): Promise<DashCamAnalysis | null>;
    getEvidenceGaps(reportId: bigint): Promise<Array<EvidenceGap>>;
    getFirstPhoto(reportId: bigint): Promise<PhotoMetadata | null>;
    getInjuryPhotos(reportId: bigint): Promise<Array<InjuryPhoto>>;
    getInsuranceExport(reportId: bigint): Promise<InsuranceExport>;
    getPersistentDashCamAnalysis(reportId: bigint): Promise<string>;
    getPersistentPhotoAnalysis(reportId: bigint): Promise<string>;
    getReport(reportId: bigint): Promise<AccidentReport | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    storeInjuryPhotos(reportId: bigint, summary: string): Promise<void>;
    updateAccidentAssessment(reportId: bigint, accidentNarrative: AccidentNarrative | null, damageSeverity: DamageSeverity | null, faultLikelihoodAssessment: FaultLikelihoodAssessment | null): Promise<void>;
    updateDashCamFootage(reportId: bigint, dashCamFootage: Array<ExternalBlob>): Promise<void>;
    updateDashCamFootageImaging(reportId: bigint, dashCamFootage: Array<ExternalBlob>): Promise<void>;
    updateEIPhotoAnalysis(reportId: bigint, aiPhotoAnalysis: string): Promise<void>;
    updateNewAIResults(reportId: bigint, aiDashCamAnalyses: string, evidenceGaps: Array<EvidenceGap>): Promise<void>;
    uploadPhoto(filename: string, contentType: string, description: string): Promise<PhotoMetadata>;
}

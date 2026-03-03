import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


// Enable data migration logic on upgrades

actor {
  include MixinStorage();

  // Enable access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type RoadType = {
    #urban : Nat;
    #dualCarriageway : Nat;
    #motorway : Nat;
  };

  type StoppingDistance = {
    speed : Nat;
    distance : Nat;
  };

  type HighwayCodeRule = {
    ruleNumber : Text;
    title : Text;
    description : Text;
    applicableScenarios : [Text];
  };

  type Violation = {
    violationType : Text;
    description : Text;
    detectedAt : Int;
  };

  type FaultAnalysis = {
    isAtFault : Bool;
    reason : Text;
    violatedRules : [HighwayCodeRule];
    speedLimit : ?Nat;
    actualSpeed : ?Nat;
    weatherConditions : ?Text;
  };

  type TrafficSignalState = {
    color : Text;
    position : Text;
    proximityToAccident : Nat;
    witnessTestimony : Text;
  };

  type PhotoMetadata = {
    filename : Text;
    contentType : Text;
    uploadTimestamp : Int;
    description : Text;
  };

  type TrafficSign = {
    signType : Text;
    detectedInPhoto : Bool;
    position : ?Text;
    timestamp : Int;
  };

  type AIAnalysisResult = {
    narrativeText : Text;
    inferredCrashType : Text;
    severity : Text;
    correlationSummary : Text;
    photoAnalysis : Text;
    dashCamAnalysis : Text;
    evidenceGaps : [EvidenceGap];
  };

  type Witness = {
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    statement : Text;
  };

  // Accident Narrative and Evidence Gaps
  type AccidentNarrative = {
    narrativeText : Text;
    evidenceGaps : [EvidenceGap];
  };

  type EvidenceGap = {
    description : Text;
    confidenceLevel : Nat;
    evidenceType : Text;
  };

  // Damage Severity Scoring Types
  type DamageSeverity = {
    priorityScore : Nat;
    severityLabel : Text;
    vehicleZones : [VehicleZoneScore];
    totalLossProbability : Nat;
    heatMap : [VehicleZoneHeatMap];
  };

  type VehicleZoneScore = {
    zone : Text; // Could be an enum in the future
    score : Nat;
    description : Text;
    damageType : Text;
  };

  type VehicleZoneHeatMap = {
    zone : Text;
    severity : Nat;
    color : Text;
  };

  // Fault Likelihood Assessment Type
  type FaultLikelihoodAssessment = {
    partyAPercentage : Nat;
    partyBPercentage : Nat;
    reasoning : Text;
    confidenceLevel : Nat;
    supportingFactors : [Text];
    conflictingFactors : [Text];
    roadPositionImpact : Text;
  };

  // Updated Accident Report Data Structure
  type AccidentReport = {
    vehicleSpeed : Nat;
    surroundings : Surroundings;
    witnessStatement : Text;
    damageDescription : Text;
    stopLocation : Text;
    accidentMarker : Text;
    isAtFault : Bool;
    faultReasoning : Text;
    timestamp : Int;
    faultAnalysis : ?FaultAnalysis;
    photos : [PhotoMetadata];
    applicableRules : [HighwayCodeRule];
    imageData : [Blob];
    trafficSignalState : ?TrafficSignalState;
    isRedLightViolation : Bool;
    trafficSigns : [TrafficSign];
    owner : ?Principal;
    violations : [Violation];
    party1Liability : ?Nat;
    party2Liability : ?Nat;
    vehicleInfo : VehicleInfo;
    aiAnalysisResult : ?AIAnalysisResult;
    otherVehicle : ?OtherVehicle;
    videos : [Storage.ExternalBlob];
    witnesses : [Witness];
    dashCamFootage : [Storage.ExternalBlob];
    dashCamAnalysis : ?DashCamAnalysis;
    accidentNarrative : ?AccidentNarrative; // New field
    damageSeverity : ?DamageSeverity; // New field
    faultLikelihoodAssessment : ?FaultLikelihoodAssessment; // New field
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phoneNumber : Text;
    licenseNumber : Text;
  };

  type Surroundings = {
    weather : Text;
    roadCondition : Text;
    visibility : Text;
  };

  type VehicleInfo = {
    make : Text;
    model : Text;
    colour : Text;
    licencePlate : Text;
    year : Nat;
    mot : Text;
    registration : Text;
  };

  type OtherVehicle = {
    make : Text;
    model : Text;
    ownerName : Text;
    email : Text;
    phone : Text;
    insurer : Text;
    insurancePolicyNumber : Text;
    claimReference : Text;
    licencePlate : Text;
    year : Nat;
    colour : Text;
    mot : Text;
    registration : Text;
  };

  // New DashCamAnalysis Type
  type DashCamAnalysis = {
    collisionDetected : Bool;
    vehicleSpeed : Nat;
    timestamps : [Int];
    roadConditions : Text;
    faultIndicators : Text;
  };

  type InjuryPhoto = {
    id : Nat;
    reportId : Nat;
    blob : Storage.ExternalBlob;
    bodyRegion : Text;
    crashType : Text;
    timestamp : Int;
  };

  type InsuranceExport = {
    reportId : Nat;
    summary : Text;
    injuryPhotos : [InjuryPhoto];
    owner : Principal;
  };

  var nextReportId = 0;
  var nextInjuryPhotoId = 0;
  let stoppingDistances : [StoppingDistance] = [
    { speed = 20; distance = 12 },
    { speed = 30; distance = 23 },
    { speed = 40; distance = 36 },
    { speed = 50; distance = 53 },
    { speed = 60; distance = 73 },
    { speed = 70; distance = 96 },
  ];

  let accidentReports = Map.empty<Nat, AccidentReport>();
  let injuryPhotos = Map.empty<Nat, [InjuryPhoto]>();
  let exportableInjuries = Map.empty<Nat, InsuranceExport>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getSpeedLimit(roadType : RoadType) : Nat {
    switch (roadType) {
      case (#urban(val)) { val };
      case (#dualCarriageway(val)) { val };
      case (#motorway(val)) { val };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkUserPermission(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not canViewUserProfile(caller, user)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkUserPermission(caller);
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadPhoto(
    filename : Text,
    contentType : Text,
    description : Text,
  ) : async PhotoMetadata {
    checkUserPermission(caller);
    {
      filename;
      contentType;
      uploadTimestamp = Time.now();
      description;
    };
  };

  public shared ({ caller }) func createReport(
    vehicleSpeed : Nat,
    witnessStatement : Text,
    damageDescription : Text,
    stopLocation : Text,
    accidentMarker : Text,
    timestamp : Int,
    roadType : RoadType,
    photos : [PhotoMetadata],
    images : [Blob],
    trafficSignalState : ?TrafficSignalState,
    trafficSigns : [TrafficSign],
    gpsLocation : Text,
    surroundings : Surroundings,
    vehicleInfo : VehicleInfo,
    otherVehicle : ?OtherVehicle,
    witnessDetails : [Witness],
    videoFiles : [Storage.ExternalBlob],
    dashCamFootage : [Storage.ExternalBlob], // New dashCamFootage field
    accidentNarrative : ?AccidentNarrative, // New narrative field
    damageSeverity : ?DamageSeverity, // New severity field
    faultLikelihoodAssessment : ?FaultLikelihoodAssessment, // New fault assessment field
    aiPhotoAnalysis : Text, // New persistent photo analysis field
    aiDashCamAnalyses : Text, // New persistent dashcam analysis field
    evidenceGaps : [EvidenceGap], // New persistent evidence gaps field
  ) : async Nat {
    checkUserPermission(caller);

    let analysis = performFaultAnalysis(
      vehicleSpeed,
      surroundings.roadCondition,
      witnessStatement,
      damageDescription,
      stopLocation,
      accidentMarker,
      roadType,
    );

    let matchedRules = matchHighwayCodeRules(vehicleSpeed, roadType, surroundings.roadCondition);
    let isRedLightViolation = isFaultyLight(trafficSignalState);

    let violations = detectViolations(
      vehicleSpeed,
      surroundings.roadCondition,
      trafficSignalState,
      trafficSigns,
      gpsLocation,
      isRedLightViolation,
    );

    let (party1Liability, party2Liability) = calculateLiabilityPercentages(violations);

    // Simulate dash cam analysis
    let dashCamAnalysis = performDashCamAnalysis(dashCamFootage);

    let report : AccidentReport = {
      vehicleSpeed;
      surroundings;
      witnessStatement;
      damageDescription;
      stopLocation;
      accidentMarker;
      isAtFault = analysis.isAtFault or isRedLightViolation;
      faultReasoning = if (isRedLightViolation) { "Red light violation detected" } else {
        analysis.reason;
      };
      timestamp;
      faultAnalysis = ?analysis;
      photos;
      imageData = images;
      applicableRules = matchedRules;
      trafficSignalState;
      isRedLightViolation;
      trafficSigns;
      owner = ?caller;
      violations;
      party1Liability = ?party1Liability;
      party2Liability = ?party2Liability;
      vehicleInfo;
      aiAnalysisResult = null;
      otherVehicle;
      videos = videoFiles;
      witnesses = witnessDetails;
      dashCamFootage; // Assign new field
      dashCamAnalysis; // Assign new field
      accidentNarrative; // Assign new narrative field
      damageSeverity; // Assign new severity field
      faultLikelihoodAssessment; // Assign new fault assessment field
    };

    let analysisResult : AIAnalysisResult = {
      narrativeText = "";
      inferredCrashType = "";
      severity = "";
      correlationSummary = "";
      photoAnalysis = aiPhotoAnalysis;
      dashCamAnalysis = aiDashCamAnalyses;
      evidenceGaps;
    };

    let reportId = nextReportId;
    accidentReports.add(reportId, report);
    nextReportId += 1;
    reportId;
  };

  public shared ({ caller }) func addInjuryPhotos(reportId : Nat, photoBlobs : [(Storage.ExternalBlob, Text, Text)]) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found for injury photos") };
      case (?report) {
        // Only the report owner or an admin can add injury photos
        checkAdminOrOwner(caller, report.owner);

        let mappedPhotos = photoBlobs.map(
          func((blob, region, crashType)) {
            let photo = {
              id = nextInjuryPhotoId;
              reportId;
              blob;
              bodyRegion = region;
              crashType;
              timestamp = Time.now();
            };
            nextInjuryPhotoId += 1;
            photo;
          }
        );

        let existing = injuryPhotos.get(reportId);
        switch (existing) {
          case (null) {
            injuryPhotos.add(reportId, mappedPhotos);
          };
          case (?existingPhotos) {
            let allPhotos = existingPhotos.concat(mappedPhotos);
            injuryPhotos.add(reportId, allPhotos);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateEIPhotoAnalysis(reportId : Nat, aiPhotoAnalysis : Text) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        // Only the report owner or an admin can update AI analysis
        checkAdminOrOwner(caller, report.owner);

        let currentAnalysis = switch (report.aiAnalysisResult) {
          case (null) {
            {
              narrativeText = "";
              inferredCrashType = "";
              severity = "";
              correlationSummary = "";
              photoAnalysis = "";
              dashCamAnalysis = "";
              evidenceGaps = [];
            };
          };
          case (?analysis) { analysis };
        };

        let updatedAnalysis : AIAnalysisResult = {
          currentAnalysis with
          photoAnalysis = aiPhotoAnalysis;
        };

        accidentReports.add(
          reportId,
          { report with aiAnalysisResult = ?updatedAnalysis },
        );
      };
    };
  };

  // Separate endpoint to persist dashcam analysis and evidence gaps
  public shared ({ caller }) func updateNewAIResults(
    reportId : Nat,
    aiDashCamAnalyses : Text,
    evidenceGaps : [EvidenceGap],
  ) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        // Only the report owner or an admin can update AI analysis
        checkAdminOrOwner(caller, report.owner);

        let currentAnalysis = switch (report.aiAnalysisResult) {
          case (null) {
            {
              narrativeText = "";
              inferredCrashType = "";
              severity = "";
              correlationSummary = "";
              photoAnalysis = "";
              dashCamAnalysis = "";
              evidenceGaps = [];
            };
          };
          case (?analysis) { analysis };
        };

        let persistentGaps = currentAnalysis.evidenceGaps.concat(evidenceGaps);

        let updatedAnalysis : AIAnalysisResult = {
          currentAnalysis with
          dashCamAnalysis = aiDashCamAnalyses;
          evidenceGaps = persistentGaps;
        };

        accidentReports.add(
          reportId,
          { report with aiAnalysisResult = ?updatedAnalysis },
        );
      };
    };
  };

  // New persistent endpoint to fetch just the evidence gaps array
  public query ({ caller }) func getEvidenceGaps(reportId : Nat) : async [EvidenceGap] {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { [] };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        switch (report.aiAnalysisResult) {
          case (null) { [] };
          case (?analysis) { analysis.evidenceGaps };
        };
      };
    };
  };

  // New persistent endpoint to fetch just the persistent photo analysis
  public query ({ caller }) func getPersistentPhotoAnalysis(reportId : Nat) : async Text {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { "" };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        switch (report.aiAnalysisResult) {
          case (null) { "" };
          case (?analysis) { analysis.photoAnalysis };
        };
      };
    };
  };

  // New persistent endpoint to fetch persistent dashcam analysis
  public query ({ caller }) func getPersistentDashCamAnalysis(reportId : Nat) : async Text {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { "" };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        switch (report.aiAnalysisResult) {
          case (null) { "" };
          case (?analysis) { analysis.dashCamAnalysis };
        };
      };
    };
  };

  // New endpoint for updating dash cam footage and analysis
  public shared ({ caller }) func updateDashCamFootage(
    reportId : Nat,
    dashCamFootage : [Storage.ExternalBlob],
  ) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        // Only the report owner or an admin can update dash cam footage
        checkAdminOrOwner(caller, report.owner);

        // Simulate dash cam analysis
        let dashCamAnalysis = performDashCamAnalysis(dashCamFootage);

        let updatedReport : AccidentReport = {
          report with
          dashCamFootage = dashCamFootage;
          dashCamAnalysis = dashCamAnalysis;
        };
        accidentReports.add(reportId, updatedReport);
      };
    };
  };

  // New imaging endpoint for updating dash cam footage and analysis
  public shared ({ caller }) func updateDashCamFootageImaging(
    reportId : Nat,
    dashCamFootage : [Storage.ExternalBlob],
  ) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        // Only the report owner or an admin can update dash cam footage
        checkAdminOrOwner(caller, report.owner);

        // Simulate dash cam analysis
        let dashCamAnalysis = performDashCamAnalysis(dashCamFootage);

        let updatedReport : AccidentReport = {
          report with
          dashCamFootage = dashCamFootage;
          dashCamAnalysis = dashCamAnalysis;
        };
        accidentReports.add(reportId, updatedReport);
      };
    };
  };

  public shared ({ caller }) func updateAccidentAssessment(
    reportId : Nat,
    accidentNarrative : ?AccidentNarrative,
    damageSeverity : ?DamageSeverity,
    faultLikelihoodAssessment : ?FaultLikelihoodAssessment,
  ) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);

        let updatedReport : AccidentReport = {
          report with
          accidentNarrative;
          damageSeverity;
          faultLikelihoodAssessment;
        };
        accidentReports.add(reportId, updatedReport);
      };
    };
  };

  public query ({ caller }) func getComprehensiveAssessment(reportId : Nat) : async {
    accidentNarrative : ?AccidentNarrative;
    damageSeverity : ?DamageSeverity;
    faultLikelihoodAssessment : ?FaultLikelihoodAssessment;
  } {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);

        {
          accidentNarrative = report.accidentNarrative;
          damageSeverity = report.damageSeverity;
          faultLikelihoodAssessment = report.faultLikelihoodAssessment;
        };
      };
    };
  };

  public query ({ caller }) func getDashCamAnalysis(reportId : Nat) : async ?DashCamAnalysis {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        report.dashCamAnalysis;
      };
    };
  };

  public query ({ caller }) func getAIAnalysisResult(reportId : Nat) : async ?AIAnalysisResult {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        report.aiAnalysisResult;
      };
    };
  };

  public query ({ caller }) func getInjuryPhotos(reportId : Nat) : async [InjuryPhoto] {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found for injury photos") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        switch (injuryPhotos.get(reportId)) {
          case (null) { [] };
          case (?photos) { photos };
        };
      };
    };
  };

  public shared ({ caller }) func deleteInjuryPhotos(reportId : Nat) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found for injury photos") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        injuryPhotos.remove(reportId);
      };
    };
  };

  public shared ({ caller }) func storeInjuryPhotos(reportId : Nat, summary : Text) : async () {
    checkUserPermission(caller);

    switch (accidentReports.get(reportId)) {
      case (null) { Runtime.trap("Cannot store injury photos, no associated accident report") };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);

        let photos = switch (injuryPhotos.get(reportId)) {
          case (null) { [] };
          case (?p) { p };
        };
        let exportData = {
          reportId;
          summary;
          injuryPhotos = photos;
          owner = caller;
        };
        exportableInjuries.add(reportId, exportData);
        injuryPhotos.remove(reportId);
      };
    };
  };

  public query ({ caller }) func getInsuranceExport(reportId : Nat) : async InsuranceExport {
    checkUserPermission(caller);

    switch (exportableInjuries.get(reportId)) {
      case (null) {
        Runtime.trap("No export data found for insurance company");
      };
      case (?export) {
        if (export.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or an admin can access this insurance export");
        };
        export;
      };
    };
  };

  // Existing methods below here (violations, faulty light, filtering, etc.)
  func detectViolations(
    vehicleSpeed : Nat,
    roadCondition : Text,
    trafficSignalState : ?TrafficSignalState,
    trafficSigns : [TrafficSign],
    gpsLocation : Text,
    redLightViolation : Bool,
  ) : [Violation] {
    var violations : [Violation] = [];

    // Stop Sign Violations
    for (sign in trafficSigns.values()) {
      if (sign.signType == "Stop" and vehicleSpeed > 0) {
        violations := violations.concat([{
          violationType = "Stop Sign";
          description = "Failed to stop at stop sign";
          detectedAt = Time.now();
        }]);
      };
    };

    // U-turn Violations
    for (sign in trafficSigns.values()) {
      if (sign.signType == "No U-turn" and gpsLocation != "") {
        violations := violations.concat([{
          violationType = "U-turn";
          description = "Prohibited U-turn in restricted area";
          detectedAt = Time.now();
        }]);
      };
    };

    // Traffic Signal Violations
    switch (trafficSignalState) {
      case (null) {};
      case (?_) {
        if (redLightViolation) {
          violations := violations.concat([{
            violationType = "Traffic Signal";
            description = "Disregarded traffic light signal";
            detectedAt = Time.now();
          }]);
        };
      };
    };

    violations;
  };

  func calculateLiabilityPercentages(violations : [Violation]) : (Nat, Nat) {
    let totalViolations = violations.size();
    switch (totalViolations) {
      case (0) { (50, 50) };
      case (1) { (70, 30) };
      case (2) { (80, 20) };
      case (_) { (90, 10) };
    };
  };

  func isFaultyLight(signal : ?TrafficSignalState) : Bool {
    switch (signal) {
      case (null) { false };
      case (?state) {
        state.color == "red" and state.witnessTestimony == "green";
      };
    };
  };

  func findReportById(reportId : Nat) : ?AccidentReport {
    accidentReports.get(reportId);
  };

  func canViewUserProfile(caller : Principal, user : Principal) : Bool {
    caller == user or AccessControl.isAdmin(accessControlState, caller)
  };

  func checkUserPermission(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users have access to this functionality");
    };
  };

  func checkAdminOrOwner(caller : Principal, owner : ?Principal) {
    if (not (
      switch (owner) {
        case (?o) { o == caller or AccessControl.isAdmin(accessControlState, caller) };
        case (null) { Runtime.trap("Unexpected missing owner - should not happen") };
      }
    )) {
      Runtime.trap("Unauthorized: Only owner or admin can view this resource");
    };
  };

  public query ({ caller }) func getFirstPhoto(reportId : Nat) : async ?PhotoMetadata {
    checkUserPermission(caller);

    switch (findReportById(reportId)) {
      case (null) { null };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);

        if (report.photos.size() > 0) {
          ?report.photos[0];
        } else { null };
      };
    };
  };

  func filterReportsByUser(reports : [(Nat, AccidentReport)], caller : Principal) : [(Nat, AccidentReport)] {
    reports.filter(func((_, report)) { switch (report.owner) { case (?owner) { owner == caller }; case (null) { false } } });
  };

  public query ({ caller }) func getReport(reportId : Nat) : async ?AccidentReport {
    checkUserPermission(caller);

    switch (findReportById(reportId)) {
      case (null) { null };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        ?report;
      };
    };
  };

  public query ({ caller }) func getAllReports() : async [(Nat, AccidentReport)] {
    checkUserPermission(caller);

    let reportsArray = accidentReports.toArray();

    // Admins can see all, users only see their own
    if (AccessControl.isAdmin(accessControlState, caller)) {
      reportsArray;
    } else { filterReportsByUser(reportsArray, caller) };
  };

  public query ({ caller }) func getAllPhotos(reportId : Nat) : async ?[PhotoMetadata] {
    checkUserPermission(caller);

    switch (findReportById(reportId)) {
      case (null) { null };
      case (?report) {
        checkAdminOrOwner(caller, report.owner);
        ?report.photos;
      };
    };
  };

  public query ({ caller }) func getAllThumbnails() : async [(Nat, [PhotoMetadata])] {
    checkUserPermission(caller);

    let reportsArray = accidentReports.toArray();
    let filteredReports = if (AccessControl.isAdmin(accessControlState, caller)) {
      reportsArray;
    } else { filterReportsByUser(reportsArray, caller) };

    filteredReports.map(
      func((id, report)) {
        let thumbs = report.photos.map(func(meta) { meta });
        (id, thumbs);
      }
    );
  };

  func performFaultAnalysis(
    vehicleSpeed : Nat,
    roadCondition : Text,
    witnessStatement : Text,
    damageDescription : Text,
    stopLocation : Text,
    accidentMarker : Text,
    roadType : RoadType,
  ) : FaultAnalysis {
    let speedLimit = getSpeedLimit(roadType);

    let isAtFault = vehicleSpeed > speedLimit;

    let analysis : FaultAnalysis = {
      isAtFault;
      reason = if (isAtFault) { "Vehicle was driving above the speed limit" } else {
        "No clear fault identified";
      };
      violatedRules = matchHighwayCodeRules(vehicleSpeed, roadType, roadCondition);
      speedLimit = ?speedLimit;
      actualSpeed = ?vehicleSpeed;
      weatherConditions = ?roadCondition;
    };

    analysis;
  };

  func getHighwayCodeRules() : [HighwayCodeRule] {
    [
      {
        ruleNumber = "Rule 126";
        title = "Stopping Distances";
        description = "Drive at a speed that will allow you to stop well within the distance you can see to be clear. You should leave enough space between you and the vehicle in front so you can stop safely if it suddenly slows down or stops.";
        applicableScenarios = [
          "Rear-end collisions",
          "Sudden braking incidents",
          "Adverse weather conditions"
        ];
      },
      {
        ruleNumber = "Rule 163";
        title = "Overtaking";
        description = "When overtaking, allow at least a full car's width when passing pedestrians, cyclists, horse riders, and motorcyclists. Be particularly careful at night and in poor weather.";
        applicableScenarios = [
          "Overtaking accidents involving cyclists",
          "Collisions during poor weather conditions"
        ];
      },
      {
        ruleNumber = "Rules 204-210";
        title = "Motorway Driving";
        description = "Stay in the left-hand lane unless overtaking. Always indicate clearly when changing lanes and check your mirrors frequently.";
        applicableScenarios = [
          "Accidents involving lane changes",
          "Merging collisions",
          "Multi-vehicle incidents"
        ];
      },
    ];
  };

  func matchHighwayCodeRules(vehicleSpeed : Nat, roadType : RoadType, roadCondition : Text) : [HighwayCodeRule] {
    let allRules = getHighwayCodeRules();

    func matchesScenario(rule : HighwayCodeRule) : Bool {
      switch (rule.ruleNumber) {
        case ("Rule 126") {
          vehicleSpeed > getSpeedLimit(roadType)
        };
        case ("Rule 163") {
          roadCondition.contains(#char 'c');
        };
        case ("Rules 204-210") {
          switch (roadType) {
            case (#motorway(_)) { true };
            case (_) { false };
          };
        };
        case (_) { false };
      };
    };

    allRules.filter(matchesScenario);
  };

  func performDashCamAnalysis(_footage : [Storage.ExternalBlob]) : ?DashCamAnalysis {
    // Simulate AI analysis
    ?{
      collisionDetected = true;
      vehicleSpeed = 60;
      timestamps = [1000, 2000, 3000];
      roadConditions = "Dry";
      faultIndicators = "Sudden lane change";
    };
  };
};

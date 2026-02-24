import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  // Initialize the access control system
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

  type Violation = {
    violationType : Text;
    description : Text;
    detectedAt : Int;
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
  };

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
  };

  var nextReportId = 0;
  let stoppingDistances = [
    { speed = 20; distance = 12 },
    { speed = 30; distance = 23 },
    { speed = 40; distance = 36 },
    { speed = 50; distance = 53 },
    { speed = 60; distance = 73 },
    { speed = 70; distance = 96 },
  ];

  var accidentReports = Map.empty<Nat, AccidentReport>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  func getSpeedLimit(roadType : RoadType) : Nat {
    switch (roadType) {
      case (#urban(val)) { val };
      case (#dualCarriageway(val)) { val };
      case (#motorway(val)) { val };
    };
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

    let report : AccidentReport = {
      vehicleSpeed;
      surroundings;
      witnessStatement;
      damageDescription;
      stopLocation;
      accidentMarker;
      isAtFault = analysis.isAtFault or isRedLightViolation;
      faultReasoning = if (isRedLightViolation) {
        "Red light violation detected";
      } else { analysis.reason };
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
    };

    let reportId = nextReportId;
    accidentReports.add(reportId, report);
    nextReportId += 1;
    reportId;
  };

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
};

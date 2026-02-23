import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldRoadType = {
    #urban : Nat;
    #dualCarriageway : Nat;
    #motorway : Nat;
  };

  type OldStoppingDistance = {
    speed : Nat;
    distance : Nat;
  };

  type OldHighwayCodeRule = {
    ruleNumber : Text;
    title : Text;
    description : Text;
    applicableScenarios : [Text];
  };

  type OldFaultAnalysis = {
    isAtFault : Bool;
    reason : Text;
    violatedRules : [OldHighwayCodeRule];
    speedLimit : ?Nat;
    actualSpeed : ?Nat;
    weatherConditions : ?Text;
  };

  type OldTrafficSignalState = {
    color : Text;
    position : Text;
    proximityToAccident : Nat;
    witnessTestimony : Text;
  };

  type OldPhotoMetadata = {
    filename : Text;
    contentType : Text;
    uploadTimestamp : Int;
    description : Text;
  };

  type OldTrafficSign = {
    signType : Text;
    detectedInPhoto : Bool;
    position : ?Text;
    timestamp : Int;
  };

  type OldUserProfile = {
    name : Text;
    email : Text;
    phoneNumber : Text;
    licenseNumber : Text;
  };

  type OldAccidentReport = {
    vehicleSpeed : Nat;
    roadCondition : Text;
    witnessStatement : Text;
    damageDescription : Text;
    stopLocation : Text;
    accidentMarker : Text;
    isAtFault : Bool;
    faultReasoning : Text;
    timestamp : Int;
    faultAnalysis : ?OldFaultAnalysis;
    photos : [OldPhotoMetadata];
    applicableRules : [OldHighwayCodeRule];
    imageData : [Blob];
    trafficSignalState : ?OldTrafficSignalState;
    isRedLightViolation : Bool;
    trafficSigns : [OldTrafficSign];
    owner : ?Principal;
  };

  type NewViolation = {
    violationType : Text;
    description : Text;
    detectedAt : Int;
  };

  type NewAccidentReport = {
    vehicleSpeed : Nat;
    roadCondition : Text;
    witnessStatement : Text;
    damageDescription : Text;
    stopLocation : Text;
    accidentMarker : Text;
    isAtFault : Bool;
    faultReasoning : Text;
    timestamp : Int;
    faultAnalysis : ?OldFaultAnalysis;
    photos : [OldPhotoMetadata];
    applicableRules : [OldHighwayCodeRule];
    imageData : [Blob];
    trafficSignalState : ?OldTrafficSignalState;
    isRedLightViolation : Bool;
    trafficSigns : [OldTrafficSign];
    owner : ?Principal;
    violations : [NewViolation];
    party1Liability : ?Nat;
    party2Liability : ?Nat;
  };

  type OldActor = {
    nextReportId : Nat;
    stoppingDistances : [OldStoppingDistance];
    accidentReports : Map.Map<Nat, OldAccidentReport>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    nextReportId : Nat;
    stoppingDistances : [OldStoppingDistance];
    accidentReports : Map.Map<Nat, NewAccidentReport>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newReports = old.accidentReports.map<Nat, OldAccidentReport, NewAccidentReport>(
      func(_id, report) {
        {
          report with
          violations = [];
          party1Liability = null;
          party2Liability = null;
        };
      }
    );
    {
      old with
      accidentReports = newReports;
    };
  };
};

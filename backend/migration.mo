import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldAccidentReport = {
    vehicleSpeed : Nat;
    surroundings : {
      weather : Text;
      roadCondition : Text;
      visibility : Text;
    };
    witnessStatement : Text;
    damageDescription : Text;
    stopLocation : Text;
    accidentMarker : Text;
    isAtFault : Bool;
    faultReasoning : Text;
    timestamp : Int;
    faultAnalysis : ?{
      isAtFault : Bool;
      reason : Text;
      violatedRules : [{
        ruleNumber : Text;
        title : Text;
        description : Text;
        applicableScenarios : [Text];
      }];
      speedLimit : ?Nat;
      actualSpeed : ?Nat;
      weatherConditions : ?Text;
    };
    photos : [{
      filename : Text;
      contentType : Text;
      uploadTimestamp : Int;
      description : Text;
    }];
    applicableRules : [{
      ruleNumber : Text;
      title : Text;
      description : Text;
      applicableScenarios : [Text];
    }];
    imageData : [Blob];
    trafficSignalState : ?{
      color : Text;
      position : Text;
      proximityToAccident : Nat;
      witnessTestimony : Text;
    };
    isRedLightViolation : Bool;
    trafficSigns : [{
      signType : Text;
      detectedInPhoto : Bool;
      position : ?Text;
      timestamp : Int;
    }];
    owner : ?Principal;
    violations : [{
      violationType : Text;
      description : Text;
      detectedAt : Int;
    }];
    party1Liability : ?Nat;
    party2Liability : ?Nat;
    vehicleInfo : {
      make : Text;
      model : Text;
      colour : Text;
      licencePlate : Text;
    };
    aiAnalysisResult : ?{
      narrativeText : Text;
      inferredCrashType : Text;
      severity : Text;
      correlationSummary : Text;
    };
  };

  type NewAccidentReport = {
    vehicleSpeed : Nat;
    surroundings : {
      weather : Text;
      roadCondition : Text;
      visibility : Text;
    };
    witnessStatement : Text;
    damageDescription : Text;
    stopLocation : Text;
    accidentMarker : Text;
    isAtFault : Bool;
    faultReasoning : Text;
    timestamp : Int;
    faultAnalysis : ?{
      isAtFault : Bool;
      reason : Text;
      violatedRules : [{
        ruleNumber : Text;
        title : Text;
        description : Text;
        applicableScenarios : [Text];
      }];
      speedLimit : ?Nat;
      actualSpeed : ?Nat;
      weatherConditions : ?Text;
    };
    photos : [{
      filename : Text;
      contentType : Text;
      uploadTimestamp : Int;
      description : Text;
    }];
    applicableRules : [{
      ruleNumber : Text;
      title : Text;
      description : Text;
      applicableScenarios : [Text];
    }];
    trafficSignalState : ?{
      color : Text;
      position : Text;
      proximityToAccident : Nat;
      witnessTestimony : Text;
    };
    isRedLightViolation : Bool;
    trafficSigns : [{
      signType : Text;
      detectedInPhoto : Bool;
      position : ?Text;
      timestamp : Int;
    }];
    owner : ?Principal;
    violations : [{
      violationType : Text;
      description : Text;
      detectedAt : Int;
    }];
    party1Liability : ?Nat;
    party2Liability : ?Nat;
    otherVehicle : ?{
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
    vehicleInfo : {
      make : Text;
      model : Text;
      colour : Text;
      licencePlate : Text;
      year : Nat;
      mot : Text;
      registration : Text;
    };
    aiAnalysisResult : ?{
      narrativeText : Text;
      inferredCrashType : Text;
      severity : Text;
      correlationSummary : Text;
    };
    imageData : [Blob];
    videos : [Storage.ExternalBlob];
    witnesses : [{
      name : Text;
      phone : Text;
      email : Text;
      address : Text;
      statement : Text;
    }];
  };

  type OldActor = {
    accidentReports : Map.Map<Nat, OldAccidentReport>;
    injuryPhotos : Map.Map<Nat, [{
      id : Nat;
      reportId : Nat;
      blob : Storage.ExternalBlob;
      bodyRegion : Text;
      crashType : Text;
      timestamp : Int;
    }]>;
    exportableInjuries : Map.Map<Nat, {
      reportId : Nat;
      summary : Text;
      injuryPhotos : [{
        id : Nat;
        reportId : Nat;
        blob : Storage.ExternalBlob;
        bodyRegion : Text;
        crashType : Text;
        timestamp : Int;
      }];
      owner : Principal;
    }>;
    nextInjuryPhotoId : Nat;
    nextReportId : Nat;
    userProfiles : Map.Map<Principal, {
      name : Text;
      email : Text;
      phoneNumber : Text;
      licenseNumber : Text;
    }>;
  };

  type NewActor = {
    accidentReports : Map.Map<Nat, NewAccidentReport>;
    injuryPhotos : Map.Map<Nat, [{
      id : Nat;
      reportId : Nat;
      blob : Storage.ExternalBlob;
      bodyRegion : Text;
      crashType : Text;
      timestamp : Int;
    }]>;
    exportableInjuries : Map.Map<Nat, {
      reportId : Nat;
      summary : Text;
      injuryPhotos : [{
        id : Nat;
        reportId : Nat;
        blob : Storage.ExternalBlob;
        bodyRegion : Text;
        crashType : Text;
        timestamp : Int;
      }];
      owner : Principal;
    }>;
    nextInjuryPhotoId : Nat;
    nextReportId : Nat;
    userProfiles : Map.Map<Principal, {
      name : Text;
      email : Text;
      phoneNumber : Text;
      licenseNumber : Text;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    let newAccidentReports = old.accidentReports.map<Nat, OldAccidentReport, NewAccidentReport>(
      func(_id, oldReport) {
        {
          oldReport with
          otherVehicle = null;
          witnesses = [];
          videos = [];
          vehicleInfo = {
            oldReport.vehicleInfo with
            year = 0; // Default year value
            mot = ""; // Default MOT value
            registration = ""; // Default registration value
          };
        };
      }
    );

    {
      old with
      accidentReports = newAccidentReports;
    };
  };
};

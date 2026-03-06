# Legal Accident Documentation App

## Current State

The app is a full-stack UK road accident documentation tool. The `AccidentReportForm` currently supports:
- One "Your Vehicle" section (make, model, colour, licence plate, year, MOT, registration)
- One "Other Vehicle" section (same fields plus driver contact and insurance info)
- Accident details, surroundings, witnesses, photos, dash cam, videos
- AI photo/dash cam analysis, damage severity, fault likelihood, accident narrative
- Birds-eye grid view, fault reference tool with Highway Code + case law, injury photo upload

The backend `AccidentReport` type stores `otherVehicle?: OtherVehicle` (a single optional record), so only one additional party is currently supported.

## Requested Changes (Diff)

### Add
- Dynamic "Add Party" button to allow multiple additional parties (vehicles, motorbikes, trucks, bicycles, pedestrians, third-party objects)
- Vehicle type selector per additional party: Car, Motorbike, Truck/HGV, Van, Bus, Bicycle, Pedestrian, Third-Party Object
- Per-party fields: vehicle type, make, model, colour, licence plate, year, MOT, driver name, email, phone, insurer, policy number, claim reference
- Each party rendered as a collapsible card with a sequential label (Party B, Party C, Party D…)
- Remove Party button per card
- Vehicle type visually distinguishes vulnerable road users (Cyclist, Pedestrian, Motorbike) with a note about their elevated Highway Code protection
- The fault assessment and AI analysis panels note when vulnerable road users are involved

### Modify
- Replace the single "Other Vehicle" section in `AccidentReportForm` with the new dynamic multi-party section
- The existing `otherVehicle` backend field maps to the first additional party (Party B) for backward compatibility; additional parties are stored in `witnessDetails` or as additional metadata in the narrative text for now (no backend schema change required)
- Fault likelihood panel and accident narrative note when multiple parties are involved

### Remove
- The static single "Other Vehicle (if applicable)" card — replaced by the dynamic multi-party section

## Implementation Plan

1. Create a `PartyVehicleCard` component: collapsible card with vehicle type selector + all party fields + remove button
2. Update `AccidentReportForm` to manage an array of additional parties (min 0, no max)
3. Serialize first additional party into `otherVehicle` for backend; embed remaining parties as JSON string appended to `witnessStatement` or `damageDescription` for persistence without backend changes
4. Add visual badge/note for vulnerable road user types (Bicycle, Pedestrian, Motorbike) referencing Highway Code Rules 211-215
5. Update the fault likelihood and accident narrative panels to surface multi-party context when > 1 additional party exists

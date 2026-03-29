# iamthe.law — Cycling Accidents: Report Detail & Legal Outputs

## Current State
- The 5-step wizard captures cycling-specific fields: `incidentType` (vehicle|cycling), `bikeType`, `helmetWorn`, `hiVisWorn`, `cyclingSubScenario` (vs-vehicle|vs-pedestrian|solo), `roadDefectDescription`
- Cycling legal references exist in both `legalReferences.ts` (UK) and `maltaLegalReferences.ts` (Malta) under violation type "cycling"
- `ReportDetail.tsx` does NOT display any cycling-specific fields — the report detail view is entirely vehicle-centric
- `LegalOutputsPage.tsx` has no cycling-specific section at all
- The Legal Reference Panel does surface cycling law when violations include cycling, but only if violations are tagged accordingly

## Requested Changes (Diff)

### Add
- **Cycling Details Section in ReportDetail**: When `incidentType === 'cycling'`, show a dedicated "Cycling Details" card with: incident sub-type (vs vehicle / vs pedestrian / solo road defect), bike type, helmet worn (yes/no, with legal note if no), hi-vis worn, road defect description if sub-type is solo
- **Cycling Legal Panel in ReportDetail**: When `incidentType === 'cycling'`, surface a dedicated collapsible cycling legal reference panel pulling from the existing cycling-specific violation refs — HC Rules 59–82 + 211–215 (UK), TRO Cap. 65 Arts. 53/54/57/58 (Malta), relevant case law (Eagle v Chambers, Gough v Thorne, Phipps v Rochester for UK; Borg v Pisani, Camilleri v Attard for Malta)
- **Cycling Section in LegalOutputsPage**: Add a new "Cycling Accident Legal Guide" section with: sub-scenario-specific legal summary cards (vs vehicle, vs pedestrian, solo/road defect), UK and Malta legal references, fault weighting guide (helmet/hi-vis/lights impact on contributory negligence), council/highway authority liability for road defects, deeper case law panel
- **Auto-tag cycling violation**: When `incidentType === 'cycling'`, automatically include a cycling violation in the violations list so the existing LegalReferencePanel picks it up

### Modify
- `ReportDetail.tsx`: Add cycling details card and cycling legal panel, gated on `incidentType === 'cycling'`
- `LegalOutputsPage.tsx`: Add cycling guide section at the bottom of the page
- Fault weighting logic: helmet not worn should add a note about potential contributory negligence reduction (Froom v Butcher principle for UK; Civil Code Art. 1033 for Malta)

### Remove
- Nothing removed

## Implementation Plan
1. Add a `CyclingDetailsCard` component in `ReportDetail.tsx` — displays all cycling fields with icons and legal tooltips
2. Add a `CyclingLegalPanel` component (inline or separate file) that pulls cycling-specific refs from existing data
3. Wire `incidentType === 'cycling'` check in `ReportDetail.tsx` to render both new sections
4. Add a `CyclingLegalGuide` section to `LegalOutputsPage.tsx` with sub-scenario cards, fault weighting table, and deeper case law — adapts for UK/Malta via `useCountry()`
5. Ensure helmet/hi-vis fields in cycling details card show a contextual amber warning when not worn (contributory negligence risk)

# iamthe.law — Fix Make/Model, Full Translation, Locality Placeholder

## Current State
- The accident report wizard has two separate fields, Make and Model, both in `AccidentReportForm.tsx` (Step 2 — Your Vehicle) and in `PartyVehicleCard.tsx` (Step 4 — Other Parties).
- The app uses a translations system (`i18n/translations.ts`) but only a small subset of UI strings (nav, actions, page headings, status labels, footer, disclaimer, GDPR, privacy, reports list) are translated. The vast majority of component UI strings are still hardcoded in English.
- In Malta mode, the weather fetch location placeholder reads `e.g. Triq ir-Repubblika, Valletta` (a street name format). It should show a locality example like `e.g. Sliema`.

## Requested Changes (Diff)

### Add
- A large set of new translation keys in `translations.ts` covering: form step headings/labels, vehicle fields, accident details, cycling details, legal panels, wizard navigation buttons, weather fetch, other parties section, review step, fleet manager labels, dangerous roads page title, report detail labels, and common panel titles.
- Spanish, Polish, and Maltese translations for all new keys (English already exists in-code).

### Modify
- **`AccidentReportForm.tsx`**: Merge the separate Make and Model inputs into a single combined input labelled "Make / Model" (placeholder: `e.g. Ford Focus`). Store the value in the `make` state; set `model` to empty string. Update the review summary in Step 5 accordingly.
- **`PartyVehicleCard.tsx`**: Same — merge the Make and Model inputs into a single "Make / Model" input (placeholder: `e.g. Toyota Corolla`). Store in `party.make`; `party.model` stays empty.
- **`AccidentReportForm.tsx` weather placeholder**: Change Malta placeholder from `e.g. Triq ir-Repubblika, Valletta` to `e.g. Sliema`.
- **All major components** — update hardcoded English strings to use the `t()` hook wherever a translation key exists. Priority files: `AccidentReportForm.tsx`, `PartyVehicleCard.tsx`, `Layout.tsx`, `ReportDetail.tsx`, `ReportsPage.tsx`, `NewReportPage.tsx`, `FaultReferencePage.tsx`, `LegalOutputsPage.tsx`, `FleetPage.tsx`, `DangerousRoadsPage.tsx`, `PrivacyPolicyPage.tsx`, `TermsOfServicePage.tsx`.

### Remove
- The separate Make field and separate Model field (replaced by single Make / Model field in both locations).

## Implementation Plan
1. Expand `translations.ts` — add ~60 new translation keys, with all four language translations (en, es, pl, mt).
2. Update `AccidentReportForm.tsx` — merge Make + Model fields; change Malta weather placeholder; add `useLanguage()` hook; replace hardcoded strings with `t()` calls.
3. Update `PartyVehicleCard.tsx` — merge Make + Model fields; use `t()` for labels.
4. Update remaining priority components to use `t()` for translated strings.
5. Validate (lint + typecheck + build).

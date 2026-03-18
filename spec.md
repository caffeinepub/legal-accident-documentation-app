# iamthe.law — Malta Version

## Current State

The app is a UK-centric accident documentation tool with:
- Legal references tied to UK law (Road Traffic Act 1988, Highway Code, Limitation Act 1980, WRP 2021, CPR)
- Currency in GBP (£) with en-GB locale
- Languages: English, Spanish, Polish
- UK-specific court tracks (Small Claims/Fast Track/Multi-Track under CPR)
- UK limitation periods (3-year personal injury, 6-year property)
- UK landmark case law (Donoghue v Stevenson, Caparo, Nettleship v Weston, Froom v Butcher, Pitts v Hunt)
- No country/jurisdiction context at the app level

## Requested Changes (Diff)

### Add
- `CountryContext` / `useCountry` hook — jurisdiction state ("uk" | "mt") stored in localStorage, with a country switcher in the Layout header
- `src/data/maltaLegalReferences.ts` — Malta-specific legal data:
  - Traffic Regulation Ordinance (Cap. 65) refs replacing Highway Code
  - Civil Code Cap. 16 refs replacing RTA 1988
  - EU Motor Insurance Directives (2009/103/EC)
  - Maltese landmark cases: Cassar v Grech, Camilleri v Mifsud (duty of care), contributory negligence cases
  - Malta prescription periods: 2-year tort (Civil Code Art. 2153), 5-year contractual
  - Fond tal-Kumpens (Motor Insurance Compensation Fund) replacing MIB entries
- `src/data/maltaLegalOutputs.ts` — Malta court tracks:
  - Magistrates' Court (< €5,000)
  - Civil Court First Hall (€5,000–€50,000)
  - Court of Appeal (> €50,000 or complex cases)
- Maltese language ("mt") added to translations — all 71 keys translated
- Malta flag (🇲🇹) and EUR (€) currency formatting throughout when Malta jurisdiction active
- Malta-specific demand letter template citing Maltese law and Maltese court procedure
- Malta-specific police fields: Malta Police Force (MPF) reference, district
- Malta-specific insurer context: Maltese insurance companies (Mapfre Middlesea, GasanMamo, HSBC Life Malta, etc.)
- A `MaltaLegalOutputsSection` component inside `LegalOutputsPage` shown when Malta jurisdiction is active
- A `MaltaStatuteLimitationsPanel` variation (or prop-driven) for Malta prescription periods

### Modify
- `App.tsx` — wrap app in `CountryProvider`; add country switcher UI in header area
- `Layout.tsx` — add country selector (UK flag / Malta flag toggle) next to existing language switcher
- `StatuteLimitationsPanel.tsx` — accept `country` prop; when "mt", use Malta prescription periods
- `LegalOutputsPage.tsx` — conditionally render UK or Malta sections based on active jurisdiction
- `DemandLetterPanel.tsx` — swap legal references based on jurisdiction (Malta uses Civil Code, not RTA)
- `WhiplashClassifierPanel.tsx` — when Malta, replace WRP 2021 tariffs with Maltese compensation guidelines (general damages by injury severity)
- `translations.ts` — add `"mt"` to Language type, LANGUAGES array, and full mt translation block
- `ExportReportPanel.tsx` — use EUR/€ and Malta court references when Malta jurisdiction active

### Remove
- Nothing removed; UK version remains fully intact alongside Malta version

## Implementation Plan

1. Create `CountryContext.tsx` with `useCountry()` hook, `CountryProvider`, and localStorage persistence
2. Create `src/data/maltaLegalReferences.ts` with Malta violation references, landmark cases, statutes
3. Create `src/data/maltaLegalOutputs.ts` with court tracks, prescription periods, demand letter template for Malta
4. Add Maltese language "mt" to `translations.ts` with all 71 keys
5. Update `App.tsx` to wrap in `CountryProvider`
6. Update `Layout.tsx` to show country switcher (🇬🇧 / 🇲🇹 pill toggle) next to language switcher
7. Update `StatuteLimitationsPanel.tsx` to accept country prop and show Malta prescription periods when "mt"
8. Update `LegalOutputsPage.tsx` to render Malta-specific court tracks, settlement estimator in EUR, and Malta demand letter when jurisdiction is "mt"
9. Update `DemandLetterPanel.tsx` to use Malta law references when jurisdiction is "mt"
10. Update `WhiplashClassifierPanel.tsx` to show Malta compensation bands (soft tissue / moderate / severe) in EUR when "mt"
11. Update `ExportReportPanel.tsx` to use Malta formatting and legal references when "mt"
12. Validate and deploy

# iamthe.law — Legal Accident Documentation App

## Current State

The app has a `legalReferences.ts` data file covering violations (speeding, dangerous driving, mobile phone, etc.) with Highway Code, Road Traffic Act 1988 sections, and case law. A `LegalReferencePanel` component renders these per-report based on violations detected.

Scenario references (`scenarioReferences.ts`) cover 7 accident scenarios with case law per scenario.

The `ReportDetail` component has a full legal & insurance utility panel with demand letter, post-incident checklist, statute of limitations countdown, pre-action protocol checklist, and contributory negligence calculator.

## Requested Changes (Diff)

### Add
- Landmark case law entries for **duty of care**: *Donoghue v Stevenson [1932]*, *Caparo Industries v Dickman [1990]*, *Nettleship v Weston [1971]*, *Wilsher v Essex Area Health Authority [1988]*
- Landmark case law entries for **contributory negligence**: *Froom v Butcher [1976]*, *Pitts v Hunt [1991]*, *Sayers v Harlow UDC [1958]*, *Jones v Livox Quarries [1952]*
- Additional statutes in the legal reference panel:
  - Civil Liability Act 2018 (whiplash reforms, MedCo, tariff damages)
  - Occupiers' Liability Act 1957 (duty of care on premises/roads)
  - Fatal Accidents Act 1976 (bereavement damages, dependency claims)
- A new **`duty_of_care`** and **`contributory_negligence`** entry in `VIOLATION_LEGAL_REFERENCES` in `legalReferences.ts` so these appear contextually in reports
- A **Without-Prejudice Negotiation Letter Builder** component (`NegotiationLetterBuilder.tsx`) rendered inside the Legal & Insurance Utility collapsible panel in `ReportDetail`, after the demand letter section
  - Auto-drafts a "WITHOUT PREJUDICE" negotiation offer letter from report data (claim ID, parties, fault split, estimated compensation)
  - Includes settlement offer amount input (editable by user)
  - Full letter text is editable in a textarea
  - Copy to clipboard and print buttons

### Modify
- `legalReferences.ts`: Add duty_of_care and contributory_negligence violation keys with their full legal entries (HC rules, Acts, case law)
- `LegalReferencePanel.tsx`: Ensure new statutes (Civil Liability Act 2018, Occupiers' Liability, Fatal Accidents Act) are shown in a dedicated "Other Legislation" section below RTA 1988 when present
- `ReportDetail.tsx`: Add the `NegotiationLetterBuilder` component inside the existing Legal & Insurance Utility panel

### Remove
- Nothing removed

## Implementation Plan

1. Update `legalReferences.ts`: add `duty_of_care` and `contributory_negligence` violation keys; expand `CaseLawEntry` data for each; add new statute interface `OtherLegislationEntry` and entries for Civil Liability Act 2018, Occupiers' Liability Act 1957, Fatal Accidents Act 1976 to the `LegalReference` type and `VIOLATION_LEGAL_REFERENCES` general references
2. Create `NegotiationLetterBuilder.tsx` component that auto-drafts a without-prejudice negotiation letter from report props, with editable textarea, settlement offer input, copy and print buttons
3. Update `LegalReferencePanel.tsx` to render the new "Other Legislation" section if present
4. Update `ReportDetail.tsx` to render `NegotiationLetterBuilder` inside the Legal & Insurance Utility collapsible panel

# iamthe.law — Legal References Expansion & Chat Scroll Fix

## Current State

- `ChatAssistant.tsx`: The auto-scroll logic uses `scrollRef.current.scrollTop = scrollRef.current.scrollHeight` but `scrollRef` is attached to the outer `<ScrollArea>` wrapper component, not the inner scrollable viewport. Radix's ScrollArea wraps content in a `[data-radix-scroll-area-viewport]` inner div — setting scrollTop on the outer wrapper has no effect, so the chat never scrolls down to new messages.
- `legalReferences.ts`: Has solid UK references for ~12 violation types plus general references. Case law depth is good but several major statutes and landmark cases are missing: Limitation Act 1980, WRP 2021 tariff detail, Road Traffic Offenders Act 1988, Theft Act 1968 (vehicle taking), Civil Evidence Act 1995, and deeper personal injury case law.
- `maltaLegalReferences.ts`: Has 10 violation types plus general references. Missing several important Maltese law statutes: Motor Vehicles Insurance (Third Party Risks) Ordinance Cap. 104, Victims of Crime Act Cap. 539, Damage caused by Road Vehicle (Fund) Act Cap. 514 (Fond tal-Kumpens), and additional Maltese case law depth.

## Requested Changes (Diff)

### Add
- Fix chat scroll: query the inner Radix viewport div using `querySelector('[data-radix-scroll-area-viewport]')` and scroll that element instead
- UK: Limitation Act 1980 (3-year personal injury / 6-year property damage) to `GENERAL_LEGAL_REFERENCES.otherLegislation`
- UK: Road Traffic Offenders Act 1988 s.34 (penalty points / disqualification) to `GENERAL_LEGAL_REFERENCES.otherLegislation`
- UK: Whiplash Injury Regulations 2021 (WRP tariff detail) to `GENERAL_LEGAL_REFERENCES.otherLegislation`
- UK: New `hit_and_run` violation entry with HC Rule 286/287, RTA 1988 s.170, and case law
- UK: New `drunk_driving` violation entry with RTA 1988 s.4/5, HC Rule 95, and DPP v Morgan, R v Woollin case law
- UK: Add *Baker v Willoughby* [1970] AC 467 and *Page v Smith* [1996] AC 155 to `duty_of_care` section
- UK: Add *Revill v Newbery* [1996] QB 567 to `contributory_negligence` section
- Malta: Motor Vehicles Insurance (Third Party Risks) Ordinance Cap. 104 to `MALTA_GENERAL_LEGAL_REFERENCES.otherLegislation`
- Malta: Damage Caused by Road Vehicles (Fund) Act Cap. 514 (Fond tal-Kumpens) to `MALTA_GENERAL_LEGAL_REFERENCES.otherLegislation`
- Malta: Data Protection Act Cap. 586 reference in `MALTA_GENERAL_LEGAL_REFERENCES`
- Malta: New violation entries: `drunk_driving`, `hit_and_run`, `no_insurance` with TRO Cap. 65 references and Maltese case law
- Malta: Add *Grech v Pace* and *Mifsud v Farrugia* case law to general Malta references
- Malta: Add *Camilleri v Briffa* (personal injury damages assessment) to general Malta references
- Malta: Add Civil Code Art. 1045 (prescription for tortious claims — 2 years from date of knowledge) with clarifying detail

### Modify
- `ChatAssistant.tsx`: Fix auto-scroll to target `[data-radix-scroll-area-viewport]` child of the ScrollArea, not the outer wrapper
- Malta `GENERAL_LEGAL_REFERENCES`: Expand Civil Code Cap. 16 entry to cover Arts. 1031–1045 with prescription detail
- Malta Speeding: Add `TRO Cap. 65, Art. 46` (construction and use of speed recording equipment)
- UK `contributory_negligence`: Add *Reeves v Commissioner of Police* [2000] 1 AC 360 for detailed apportionment discussion

### Remove
- Nothing removed

## Implementation Plan

1. **ChatAssistant.tsx** — Change scroll logic in the `useEffect([messages, loading])` hook: instead of `scrollRef.current.scrollTop = scrollRef.current.scrollHeight`, query `scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')` and scroll that element.
2. **legalReferences.ts** — Add: Limitation Act 1980 and Road Traffic Offenders Act 1988 and WRP 2021 entries to `GENERAL_LEGAL_REFERENCES.otherLegislation`; add `hit_and_run` and `drunk_driving` violation entries; expand `duty_of_care` case law with Baker v Willoughby and Page v Smith; expand `contributory_negligence` case law with Revill v Newbery and Reeves.
3. **maltaLegalReferences.ts** — Add Cap. 104, Cap. 514 (Fond tal-Kumpens), and Cap. 539 to `MALTA_GENERAL_LEGAL_REFERENCES.otherLegislation`; add 3 new case law entries to general Malta references; add `drunk_driving`, `hit_and_run`, `no_insurance` violation entries.

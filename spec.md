# Specification

## Summary
**Goal:** Add a dedicated Highway Code + Case Law Fault Reference Tool page to the Road Fault Advisor app, featuring an insurer-style fault matrix and scenario selector backed by static UK legal reference data.

**Planned changes:**
- Add a new dedicated page/route for the fault reference tool, accessible from the main navigation
- Build a plain-English scenario selector UI (card grid or button group) covering at least 7 accident types: rear-end, red light, lane change, turning, junction, roundabout, and reversing — each with a label, short description, and icon
- Display an insurer-style fault matrix showing Party A and Party B fault percentages (as visual bars/badges and numeric values) with a plain-English rationale, with the active scenario row highlighted
- Display a legal references panel showing relevant Highway Code rule numbers/summaries, Road Traffic Act 1988 sections, and case law precedents (case name, factual summary, legal principle) for the selected scenario
- Selecting a scenario simultaneously updates the fault matrix, Highway Code rules, and case law panels
- Expand `faultMatrix.ts` and `legalReferences.ts` static data files to cover all 7+ scenario types with fault splits, rationale, Highway Code rules, RTA 1988 sections, and case law entries
- Apply a professional legal/insurance visual theme: dark navy or charcoal headers, amber/gold fault highlights, card-based panel layouts, and clear typographic hierarchy

**User-visible outcome:** Users can navigate to the fault reference tool, select their accident scenario from a plain-English selector, and immediately see the relevant fault split matrix, Highway Code rules, Road Traffic Act sections, and case law precedents — all without needing any prior legal knowledge.

# Legal Accident Documentation App

## Current State
A comprehensive UK road traffic accident documentation app with:
- Multi-step wizard report creation
- Photo/video/dash cam upload with AI analysis
- AI accident narrative, damage severity scoring, fault likelihood assessment
- Legal reference panel (Highway Code, case law, RTA citations)
- Contributory negligence framework (informational, collapsible)
- Legal & Insurance Utility panel (demand letter, post-incident checklist, statute of limitations)
- Multi-party support, bird's eye grid view, injury photo upload
- Insurer contacts, claim summary export, submission trust badge

## Requested Changes (Diff)

### Add
- **WhiplashClassifierPanel**: A new component that maps injury descriptions/body regions to Whiplash Reform Protocol (WRP) Tariff amounts (UK, 2021). Displays injury duration bands (0–3 months, 3–6 months, 6–9 months, 9–12 months, 12–15 months, 15–18 months, 18–24 months) with corresponding tariff values, plus minor psychological injury uplift. Inputs: injury type selector and duration. Output: WRP tariff band, estimated compensation range, and legal notes. Displayed in ReportDetail as a collapsible section.
- **RepairCostEstimatorPanel**: Estimates repair cost ranges (£) based on crash type (rear-end, head-on, side impact, rollover, multi-vehicle) and damage severity score from the existing DamageSeverityPanel. Uses lookup table approach: severity score + crash type → cost band (e.g. Minor rear-end: £500–£1,500; Critical head-on: £8,000–£25,000+). Also shows salvage/write-off threshold guidance. Displayed in ReportDetail as a collapsible section.
- **PreActionProtocolPanel**: A checklist component mirroring the Pre-Action Protocol for Personal Injury Claims (CPR Part C). Covers: early notification letter, CNF (Claim Notification Form), medical evidence, Schedule of Loss, Letter of Claim, response period (3 months). Each step shows status (pending/done), time limit, and relevant CPR rule reference. Displayed in ReportDetail within the Legal & Insurance Utility collapsible.
- **ContributoryNegligenceCalculator**: Enhances the existing ContributoryNegligencePanel with an interactive calculator tab. User inputs: total claim value (£), Party A fault % (pre-filled from FaultLikelihoodAssessment if available), Party B fault %. Output: apportioned compensation amounts for each party under the Law Reform (Contributory Negligence) Act 1945.

### Modify
- **ReportDetail**: Add WhiplashClassifierPanel and RepairCostEstimatorPanel as new collapsible sections after the FaultLikelihoodPanel. Add PreActionProtocolPanel inside the existing Legal & Insurance Utility collapsible alongside DemandLetterPanel.
- **ContributoryNegligencePanel**: Add a calculator tab/section that reads fault percentages from the report's faultLikelihoodAssessment if available.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/WhiplashClassifierPanel.tsx` — WRP tariff table, injury selector, duration selector, output display.
2. Create `src/frontend/src/components/RepairCostEstimatorPanel.tsx` — crash type selector, uses damageSeverity score, lookup table, output display.
3. Create `src/frontend/src/components/PreActionProtocolPanel.tsx` — step-by-step PAP checklist with CPR references and status toggles.
4. Update `ContributoryNegligencePanel.tsx` — add interactive calculator that accepts total claim value and auto-fills fault percentages from report prop.
5. Update `ReportDetail.tsx` — wire in all new components.
6. Validate and fix any type/build errors.

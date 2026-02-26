# Specification

## Summary
**Goal:** Expand the fault matrix data and UI to include complete Party A/B fault percentage breakdowns and full scenario coverage for all common road incident types.

**Planned changes:**
- Expand `faultMatrix.ts` to include entries for all seven scenario types from `scenarioReferences.ts` (rear-end, red light, lane change, and remaining unmapped types), each with Party A/B fault percentages, contributing factors, rationale, and related violation types.
- Update `FaultMatrixPanel` to display labelled bars or numeric values for Party A and Party B fault percentages, contributing factors, and rationale for every scenario row, with the active scenario highlighted distinctly.
- Update `FaultReferenceDisplay` on the Fault Reference page to show Party A and Party B fault percentage bars alongside existing legal references when a scenario is selected.

**User-visible outcome:** Users can view complete fault percentage breakdowns for all road incident scenarios in both the Fault Matrix panel and the Fault Reference page, with contributing factors, rationale, and legal references displayed together for each scenario.

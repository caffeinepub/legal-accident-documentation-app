# Specification

## Summary
**Goal:** Add a collapsible "Legal Reference" panel to the ReportDetail view, surfacing Highway Code citations and Road Traffic Act 1988 section references relevant to the violations recorded in each report.

**Planned changes:**
- Create a static frontend data structure mapping each violation type to relevant Highway Code rules (rule number, short description, enforceable vs advisory flag), with advisory rules visually distinguished from enforceable ones
- Create a static frontend data structure mapping each violation type to relevant Road Traffic Act 1988 sections (section number and plain-English description)
- Add a "Legal Reference" collapsible panel to the ReportDetail view, collapsed by default, with a visible toggle button/chevron
- When expanded, the panel displays the Highway Code citations and RTA 1988 sections relevant to the report's recorded violations
- If no violations are recorded, the panel shows a message indicating no legal references apply

**User-visible outcome:** Users viewing a report can optionally expand a "Legal Reference" panel to see the specific Highway Code rules and Road Traffic Act 1988 sections relevant to that incident's violations, without being shown this detail unless they choose to expand it.

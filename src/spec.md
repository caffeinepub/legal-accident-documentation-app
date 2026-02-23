# Specification

## Summary
**Goal:** Add basic traffic violation detection (stop signs, U-turns, traffic signals) with liability percentage calculation to the Traffic Fault Analyzer.

**Planned changes:**
- Extend backend AccidentReport type to include violations array and liability percentage fields
- Implement backend logic to detect stop sign violations (checking for stop sign presence and velocity data)
- Implement backend logic to detect U-turn violations (using GPS location and "No U-turn" sign detection)
- Implement backend logic to detect traffic signal violations (comparing witness testimony with AI-detected signal state)
- Create backend function to calculate liability percentages based on detected violations
- Update AccidentReportForm to accept optional GPS coordinates and timestamp
- Create ViolationsDisplay component to show detected violations in a list
- Create LiabilityDisplay component to visualize fault percentage split between parties
- Update ReportDetail component to display violations and liability information

**User-visible outcome:** Users can submit accident reports with optional GPS/timestamp data, view detected traffic violations (stop signs, U-turns, traffic signals), and see calculated liability percentages showing fault distribution between parties (e.g., 70% / 30%).

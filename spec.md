# Specification

## Summary
**Goal:** Extend the AccidentReportForm with an "Other Vehicle" section, multiple witness entries, a video uploader, and move the injury photo uploader to a prominent position near the top of the form.

**Planned changes:**
- Add an "Other Vehicle" section to the AccidentReportForm with driver contact fields (name, phone, email, address), insurance fields (insurer name, policy number, claim reference), and vehicle detail fields (make, model, year, colour, licence plate) — matching the style of the existing vehicle section
- Add a dynamic multiple-witness section with "Add Witness" / remove controls; each witness entry includes full name, phone, email, and a statement text area
- Add a video file uploader supporting MP4, MOV, AVI, and WebM; shows filename and remove option after selection; persists video to the backend report
- Move the injury photo uploader (InjuryPhotoUpload / InjuryAnalysisPanel) to a prominent position near the top of the AccidentReportForm, removing any duplicate
- Persist all new data (other vehicle, witnesses, video) to the backend AccidentReport type and display them in the report detail view

**User-visible outcome:** Users filling out a new accident report can now enter other-vehicle and driver details, add multiple witnesses with statements, upload relevant video footage, and easily upload injury photos from the top of the main report form — with all submitted data visible in the report detail view.

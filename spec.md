# iamthe.law — Legal Accident Documentation App

## Current State
The app has a Fault Reference section with crash scenario diagrams (bird's-eye SVG, Vehicle A amber / Vehicle B blue, directional arrows, impact zone, Highway Code label). These diagrams currently only appear in the Fault Reference section, not in the photo analysis flow.

## Requested Changes (Diff)

### Add
- Crash scenario diagram displayed inline in the photo analysis results section, immediately after AI analysis completes
- Editable crash type description field beneath the diagram (pre-filled by AI, user-correctable)
- "More Photos Needed" prompt if AI cannot confidently determine crash type from current uploads
- Fallback manual description input if additional photos still don't resolve crash type
- Diagram updates/rearranges based on the manual description when AI confidence is low

### Modify
- Photo analysis results panel: add diagram + editable description after AI analysis output
- AI photo analysis logic: include crash type confidence scoring; if low confidence, trigger prompt for more photos

### Remove
- Nothing removed

## Implementation Plan
1. Extend crash type detection in photo analysis to output a confidence level (high/medium/low) alongside the inferred crash type
2. In the photo analysis results panel, render the matching crash scenario SVG diagram after the AI description
3. Add an editable text field below the diagram pre-filled with the AI's crash type label — user can correct if wrong
4. If confidence is low/medium: show an amber prompt asking for additional photos to improve accuracy
5. If user uploads more photos and confidence is still low: show a manual description input; map the description to the closest crash scenario and update the diagram accordingly

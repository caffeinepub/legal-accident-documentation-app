# Legal Accident Documentation App

## Current State
The app is a multi-step accident report wizard (5 steps: Media, Vehicle, Details, Parties, Review & Submit). Reports are stored on-chain and viewable in ReportDetail. There is auto-save/draft, PDF export, AI narrative, damage severity, fault likelihood, legal panels, multi-party support, and injury photo upload.

## Requested Changes (Diff)

### Add
- **SubmissionTrustPanel component**: shown at the bottom of StepReview (step 5) in AccidentReportForm, before the Submit button. Contains:
  1. **Digital Signature field**: a typed name declaration input — "I, [name], confirm that the information in this report is accurate and complete to the best of my knowledge." with a checkbox to agree.
  2. **Submission timestamp notice**: informational text explaining that the report will be timestamped at the exact moment of submission and the timestamp will be embedded in the report.
  3. **Tamper-evident hash notice**: informational text explaining that a cryptographic fingerprint (SHA-256 hash) will be generated from the report data at submission and stored with the report, allowing any post-submission changes to be detected.
- **SubmissionCredibilityBadge component**: shown in the ReportDetail header area (near the top, alongside the existing At Fault / No Fault badges). Displays:
  - A green shield badge "Verified Submission" if the report has a stored hash.
  - The submission timestamp in a human-readable format.
  - The claimant's digital signature name (stored in the witnessStatement or a dedicated field).
  - A truncated display of the SHA-256 hash (first 16 chars + "…") for reference.
- **Hash generation logic**: at form submission time (handleSubmit in AccidentReportForm), compute a SHA-256 hash of the serialised report data (vehicle info, accident details, parties, timestamps) using the Web Crypto API. Store the hash and signatory name in the report's `witnessStatement` field using a well-defined delimiter (similar to the existing ADDITIONAL_PARTIES_DELIMITER pattern).

### Modify
- **AccidentReportForm (StepReview)**: Add the SubmissionTrustPanel just above the Submit button. The submit button should be disabled until the digital signature checkbox is checked and a name is entered.
- **ReportDetail**: Add the SubmissionCredibilityBadge near the report header to surface the trust indicators on saved reports.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `SubmissionTrustPanel.tsx` — typed name input, agreement checkbox, hash/timestamp info notices.
2. Add hash generation utility function using `window.crypto.subtle.digest` (SHA-256) in a helper file or inline in AccidentReportForm.
3. Update `AccidentReportForm.handleSubmit` to:
   - Generate SHA-256 hash of key report fields serialised to JSON.
   - Append signature name and hash to witnessStatement using a delimiter `\n\n---TRUST_SEAL---\n`.
   - Disable submit until signature is valid.
4. Integrate `SubmissionTrustPanel` into StepReview content.
5. Create `SubmissionCredibilityBadge.tsx` — parses witnessStatement for the trust seal, displays verified badge, timestamp, signatory, and truncated hash.
6. Integrate `SubmissionCredibilityBadge` into `ReportDetail` near the header.
7. Validate and build.

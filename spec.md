# iamthe.law — Legal Accident Documentation App

## Current State

- Multi-language support exists (English, Spanish, Polish, Maltese) via `LanguageContext` and `translations.ts`
- The `t()` function is available but NOT used in several key components: `NewReportPage.tsx`, `RestoreDraftBanner.tsx`, `CookieConsentBanner.tsx`
- These components have hardcoded English text, so switching language does not update their content
- The auto-save effect in `AccidentReportForm.tsx` fires 800ms after mount (even with blank form state), saving an empty draft to localStorage
- On the next visit, the restore-draft banner appears even though no real data was entered — confusing for first-time users

## Requested Changes (Diff)

### Add
- New translation keys in `translations.ts` for all four languages: draft-related strings, disclaimer/notice strings, onboarding banner strings, cookie consent strings, auto-save badge text

### Modify
- `RestoreDraftBanner.tsx` — consume `useLanguage()` and use `t()` for all text
- `NewReportPage.tsx` — consume `useLanguage()` and use `t()` for disclaimer notice, onboarding banner, hero tagline and feature pills
- `CookieConsentBanner.tsx` — consume `useLanguage()` and use `t()` for all text
- `AccidentReportForm.tsx` — before showing the restore banner, check if the draft has any meaningful data (at least one of: make, colour, licencePlate, damageDescription, witnessStatement, accidentMarker, or at least one additional party); skip the banner and discard the draft silently if the form is blank; also translate the "New Accident Report" heading, "Step X of Y" label, and "Draft saved" badge using `t()`

### Remove
- Nothing removed

## Implementation Plan

1. Add translation keys to `translations.ts` for all four languages:
   - `draft.restore_title`, `draft.restore_desc`, `draft.restore_button`, `draft.discard_button`
   - `notice.title`, `notice.text`, `notice.text_malta`
   - `onboarding.title`, `onboarding.subtitle`, `onboarding.tip1`, `onboarding.tip2`, `onboarding.tip3`, `onboarding.got_it`
   - `cookie.title`, `cookie.desc`, `cookie.accept`, `cookie.decline`
   - `form.heading`, `form.step_of`, `form.draft_saved`
2. Update `RestoreDraftBanner` to use `useLanguage()` with the new keys
3. Update `NewReportPage` to use `useLanguage()` and `t()` for disclaimer and onboarding
4. Update `CookieConsentBanner` to use `useLanguage()` and `t()`
5. Update `AccidentReportForm` draft-detection logic: add a `hasMeaningfulDraft()` helper that returns `true` only if at least one meaningful field is non-empty; only call `setShowRestoreBanner(true)` when that check passes; also use `t()` for the form heading and draft-saved badge

# iamthe.law — Trust & Compliance + User Experience

## Current State

The app has:
- Navigation with 7 pages (New Report, My Reports, Fault Reference, Legal Outputs, Grid View, Insurers, Fleet)
- Legal disclaimer amber banner on the front page
- SHA-256 fingerprint, digital signature, and timestamp on submitted reports
- No dedicated privacy policy page
- No multi-language support
- No claim status tracker
- No dark mode toggle
- No GDPR data retention/deletion controls

## Requested Changes (Diff)

### Add
- **Privacy Policy page** (`/privacy`) — exclusive, dedicated page with full GDPR-compliant privacy policy covering: data collected, how it is used, retention periods, user rights (access, deletion, portability), cookie policy, third-party services disclosure, and contact information. Linked from the footer and nav.
- **Multi-language support** — English (default), Spanish (es), and Polish (pl) with a language switcher in the header. All UI labels, nav items, headings, and key body text should be translatable. A `useTranslation` hook with a `translations.ts` file covering all three languages.
- **Claim status tracker** — Each report gets a status field: Draft → Submitted → Under Review → Settled. Status is displayed as a colour-coded badge on the report list and report detail pages. Users can update the status manually from the report detail page.
- **Dark mode toggle** — A sun/moon icon button in the header. Persists preference in localStorage. Uses Tailwind `dark:` classes with a `data-theme` attribute on `<html>`.
- **GDPR data controls** — A "Data & Privacy" section accessible from the footer or a Settings page: data retention notice, option to delete all stored evidence (photos, dash cam clips) for a specific report, and a global "Delete All My Data" action.

### Modify
- **Layout.tsx** — Add language switcher (globe icon + dropdown) and dark mode toggle to header. Add Privacy Policy link to footer.
- **App.tsx** — Add `/privacy` route. Wrap app in a `LanguageProvider` context.
- **ReportList / ReportDetail** — Add claim status badge and status update dropdown.

### Remove
- Nothing removed.

## Implementation Plan

1. Create `src/frontend/src/i18n/translations.ts` with English, Spanish, and Polish strings for all nav labels, page headings, common actions, and key UI text.
2. Create `src/frontend/src/contexts/LanguageContext.tsx` providing current language and `t()` translation function.
3. Create `src/frontend/src/contexts/ThemeContext.tsx` providing dark/light mode toggle with localStorage persistence.
4. Create `src/frontend/src/pages/PrivacyPolicyPage.tsx` — full GDPR privacy policy, translated.
5. Update `Layout.tsx` — integrate language switcher dropdown and dark mode toggle in header; add Privacy Policy footer link.
6. Update `App.tsx` — add `/privacy` route, wrap in `LanguageProvider` and `ThemeProvider`.
7. Update `src/frontend/src/pages/ReportsPage.tsx` and `ReportDetail.tsx` — add claim status badge (colour-coded) and status update control.
8. Add GDPR data controls panel to report detail page (delete evidence for this report) and a global section in a new Settings/Data page or within the report list page.

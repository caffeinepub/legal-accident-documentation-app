# iamthe.law — Stripe Monetisation (Freemium + Pro)

## Current State

The app is a fully-featured AI-powered legal accident documentation tool with UK and Malta jurisdiction support, multi-language (EN/ES/PL/MT), cycling accidents, fleet manager, legal outputs, chat assistant, and dangerous roads panels. All features are currently free and unrestricted.

The backend (main.mo) uses authorization and blob-storage components. There is no subscription or payment logic yet.

Frontend is a React/TypeScript SPA. Key state is stored in localStorage. Reports are saved to the backend canister.

## Requested Changes (Diff)

### Add
- Stripe component integration for payment processing
- `usePlan` hook (localStorage-based plan state: `free` | `pro`) that checks subscription status
- Pricing page at `/pricing` — clearly shows Free vs Pro tiers with features listed
- Upgrade modal/paywall that appears when a free-tier user tries to access a Pro-only feature
- Pro badge in the nav header when user is subscribed
- Stripe checkout flow for Pro monthly subscription (£9.99/month) and pay-per-export (£3.99 per verified export)
- Feature gating for Pro-only features:
  - PDF export with QR code, SHA-256 fingerprint, verified badge
  - Demand letters & negotiation letter builder
  - Malta jurisdiction access
  - Fleet Manager dashboard
  - Legal Outputs section (settlement estimator, legal pathway guide, dispute template)
  - Reports beyond 3/month (free tier cap)

### Modify
- `ExportReportPanel.tsx` — gate PDF export behind Pro; show upgrade prompt for free users
- `DemandLetterPanel.tsx` — gate behind Pro
- `NegotiationLetterBuilder.tsx` — gate behind Pro
- `FleetPage.tsx` — gate behind Pro
- `LegalOutputsPage.tsx` — gate behind Pro
- `CountryContext.tsx` — gate Malta jurisdiction behind Pro
- `ReportsPage.tsx` — show free tier report count (3/month cap) and upgrade CTA when limit reached
- `App.tsx` — add `/pricing` route and Pro badge in nav
- `Layout.tsx` — show Pro badge in header when subscribed

### Remove
- Nothing removed

## Implementation Plan

1. Select `stripe` Caffeine component
2. Regenerate backend to include Stripe subscription support
3. Create `usePlan` hook reading plan from localStorage + Stripe session
4. Create `PricingPage.tsx` with Free/Pro tier cards, Stripe checkout buttons
5. Create `PaywallModal.tsx` — reusable upgrade prompt with feature name + pricing
6. Create `ProBadge.tsx` — small badge for nav header
7. Gate ExportReportPanel PDF export (show blur + lock icon for free users)
8. Gate DemandLetterPanel, NegotiationLetterBuilder, LegalOutputsPage, FleetPage
9. Gate Malta jurisdiction toggle (show upgrade prompt if free user switches to Malta)
10. Add report count enforcement (3/month cap) on ReportsPage and NewReportPage
11. Add `/pricing` route in App.tsx
12. Add Pro badge in Layout.tsx nav

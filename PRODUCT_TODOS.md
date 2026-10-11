Product-Ready TODOs — HomeScout

This document is a detailed, actionable checklist for turning the current HomeScout prototype into a product-ready application. Each item includes: "What", "Why/Acceptance Criteria", "Files/Areas", and a suggested first step and acceptance criteria so any agent can pick it up and complete it.

1. Auth layout styling (completed)
   - Why/Acceptance: Split-screen image + card form for auth pages; consistent with landing brand.
   - Files: app/(auth)/layout.tsx
   - First step: Verify on mobile/desktop and ensure images are optimized.

2. Navbar auth links (in-progress)
   - Why/Acceptance: `Sign in` and `Get started` visible and contrast correctly on dark hero and scrolled white header; mobile drawer contains the same actions.
   - Files: components/shared/Navbar.tsx
   - First step: Run `pnpm dev` and inspect header at `/` and on scroll. Fix any contrast or visibility issues.

3. Wrap register card (in-progress)
   - Why/Acceptance: Multi-step registration rendered inside the same branded card as login; keyboard-accessible and responsive.
   - Files: app/(auth)/register/page.tsx
   - First step: Confirm card wrapper and fix any stray JSX or lint errors.

4. Canonical Tailwind tokens (high priority)
   - Why/Acceptance: Replace bracketed values and raw hex classes with design tokens (text-brand-500, bg-success-500, rounded-3xl) to satisfy Tailwind lint and maintain consistency.
   - Files: All components under components/ and pages under app/
   - First step: Run `pnpm lint` and address the top 10 token warnings.

5. Login form polish
   - Why/Acceptance: Validation, error UI, password toggle, OAuth placeholders, and redirect to role dashboard on success.
   - Files: app/(auth)/login/page.tsx
   - First step: Test sign-in locally with a Supabase test account and fix validation flow.

6. Landing page final polish
   - Why/Acceptance: Hero gradient/texture applied, responsive typography, ARIA/accessibility, SEO meta tags.
   - Files: app/page.tsx, app/globals.css
   - First step: Check hero at 320/768/1280 widths and adjust CSS tokens.

7. Role-based dashboards
   - Why/Acceptance: Client/Landlord/Agent dashboards with protected routes and basic stubs for primary flows.
   - Files: app/(dashboard)/client, app/(dashboard)/landlord, app/(dashboard)/agent
   - First step: Add route guards or middleware to redirect unauthenticated users to /login.

8. Listings CRUD + media upload
   - Why/Acceptance: Landlords/agents can create, edit, delete listings with images and geo data stored in Supabase.
   - Files: lib/supabase/\*, app/(dashboard)/landlord/properties
   - First step: Create Supabase properties table and wire a minimal create form with image upload.

9. Property search & filters + map
   - Why/Acceptance: Filters persist in URL, map integration centers on selected properties, results update client-side.
   - Files: components/landing/SearchBar.tsx, components/landing/PropertyCardsSection.tsx
   - First step: Implement URL query-sync and mocked filter results.

10. Messaging & chat
    - Why/Acceptance: Real-time messaging between users with unread counts.
    - Files: app/(dashboard)/\*/messages, lib/realtime
    - First step: Prototype using Supabase Realtime and persist messages.

11. Identity verification
    - Why/Acceptance: Upload NIN/passport, admin review UI, verified badge.
    - Files: app/(dashboard)/landlord/verification, lib/supabase/server.ts
    - First step: Add storage bucket and upload endpoint.

12. Payments & webhooks
    - Why/Acceptance: Deposit capture, subscription billing, and webhook reconciliation.
    - Files: lib/payments, server webhook endpoints
    - First step: Add payment provider stubs and env docs.

13. Notifications
    - Why/Acceptance: In-app notification center and email events for messages/verification/listing interest.
    - Files: lib/notifications, app/(dashboard)/\_components/NotificationCenter.tsx
    - First step: Add notifications table and event producers.

14. Admin panel & moderation
    - Why/Acceptance: Admin can moderate listings and verify users.
    - Files: app/(admin)
    - First step: Add admin middleware and basic moderation UI.

15. Analytics & reporting
    - Why/Acceptance: Aggregated metrics for signups, listings, revenue.
    - Files: lib/analytics, app/(admin)/reports
    - First step: Create aggregated views or server jobs to compute metrics.

16. Testing & CI
    - Why/Acceptance: Unit and E2E tests run on PRs (Vitest + Playwright); failing tests block merging.
    - Files: .github/workflows/\*, vitest.config, playwright.config
    - First step: Add one Vitest unit test and one Playwright smoke test.

17. Performance & SEO
    - Why/Acceptance: OG tags, compressed images, optimized LCP/CLS.
    - Files: app/head.tsx, next.config.ts
    - First step: Add meta tags and run Lighthouse audit.

18. Security & privacy
    - Why/Acceptance: Rate limits, secure cookies, documented privacy policy, minimal threat model.
    - Files: lib/supabase/\*, middleware.ts
    - First step: Add server-side validation and document required security controls.

19. Accessibility & localization
    - Why/Acceptance: Keyboard operable UI, ARIA labels, and support for locales.
    - Files: components and pages in app/
    - First step: Run accessibility scan and extract strings for i18n.

20. Environment & deployment docs
    - Why/Acceptance: Document required env vars and deployment steps for Vercel; `.env.example` present.
    - Files: README.md, infra/
    - First step: Draft `.env.example` with placeholders for Supabase and payment keys.

21. Data migrations & backups
    - Why/Acceptance: Migration scripts and backup schedule for Supabase/Postgres.
    - Files: db/migrations/
    - First step: Add migration for users, properties, messages tables.

22. Legal pages & consent
    - Why/Acceptance: Terms and Privacy pages live and consent recorded.
    - Files: app/terms, app/privacy
    - First step: Add pages with placeholder content and consent UI.

23. Developer handbook
    - Why/Acceptance: CONTRIBUTING.md, architecture.md, and code-style guidelines exist.
    - Files: CONTRIBUTING.md, docs/architecture.md
    - First step: Draft CONTRIBUTING.md with branch naming and PR process.

24. Finalize assets & brand name
    - Why/Acceptance: Replace placeholder brand text (e.g., DrimHome) with HomeScout; compress logos.
    - Files: public/assets, components/shared/Navbar.tsx
    - First step: Replace brand tokens and commit optimized assets.

How to pick up work (recommended agent workflow)

- Branch: `feature/<short-description>` (e.g., `feature/navbar-auth-contrast`).
- Commits: small atomic commits with clear messages.
- PR: Open draft PR, assign reviewer, and include screenshots for UI changes.
- Testing: Run `pnpm lint`, `pnpm test`, and `pnpm dev` locally. Provide reproduction steps for failing tests.

Commands an agent should run locally

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Unit tests: `pnpm test`
- E2E (Playwright): `pnpm e2e`

If you'd like I can now start with one of the following:

- Convert bracketed Tailwind classes to canonical tokens (quick wins for linting).
- Run `pnpm lint` and report the top 20 warnings.
- Open a PR that fixes the Navbar visibility and finalize the register card wrapper.

Pick one and I'll proceed with the changes and follow-up checks.

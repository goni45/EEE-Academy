# EEE Academy — Progress Report

**Date:** 21 October 2026
**Phase:** 1 Frontend (in progress, first working preview)
**Do not start backend work yet.** Product owner asked for frontend first, then backend, then integration.

This file is the handoff for the next agent. Read it before changing code.

---

## 1. What this project is

EEE Academy is a public website for Diploma EEE students in Bangladesh.

- No student login in the MVP.
- Students submit a course inquiry. Later, a server will save the lead and prepare a WhatsApp message. The student must send WhatsApp manually.
- Payments are manual bKash/Nagad. Admin verifies. Admin adds students to a private Facebook group by hand.
- Admin uses Supabase Auth later. Being signed in does not make someone an admin.

**Sources of truth**

| File | Use for |
| --- | --- |
| `PRD.md` | Product, routes, fields, inquiry workflow, admin statuses, future backend, security |
| `Frontend.md` | Visual design, animation, layout, copy, section composition |
| `docs/superpowers/specs/2026-10-21-eee-academy-frontend-design.md` | Approved Phase 1 frontend spec (includes owner clarifications) |

Do not treat sample catalogue data as verified academy facts.

---

## 2. Owner decisions already made

Do not re-ask these unless the owner changes them.

1. Build from scratch. Nothing existed before this session except `PRD.md` and `Frontend.md`.
2. Phase 1 = frontend only. Phase 2 = backend. Phase 3 = integration.
3. Stack: Next.js App Router, TypeScript, Tailwind, GSAP + ScrollTrigger, Framer Motion, Lucide, hls.js. No Vite. No React Router.
4. Include public site **and** admin UI in Phase 1.
5. Mock data is allowed, isolated in `lib/mock`, accessed only through `lib/data`.
6. Hero HLS URL is approved for now:
   `https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`
7. No real logo, photos, contact numbers, or verified teacher identities yet.
8. Inquiry prototype must **not** claim a lead was saved or WhatsApp was sent.
9. Admin mock login / local CRUD is **not** security or persistence.
10. Fake phones must not open `tel:` or `wa.me`. Unverified demo URLs must not leave the site.
11. Preview host allowlist, if needed, is Next.js-only (`allowedDevOrigins`), never Vite `allowedHosts`.
12. Price display: if `discount_price` is null, show `regular_price`. If discount is valid (non-null, >= 0, <= regular), show discount as payable and regular as strikethrough. Invalid discount is ignored. Sample prices are never “verified fees.”

---

## 3. Current status

A Next.js 16 App Router app exists in `/workspace` (not in a subfolder).

Working enough to preview:

- Design tokens, fonts, global animation CSS
- First-visit loader
- Floating pill nav + prototype indicator
- Homepage sections (hero, pathways, featured courses, mentors, demos, enrollment, pathways, FAQ, footer/marquee)
- `/courses` with category/semester filters
- `/courses/[slug]`
- Inquiry modal with client validation and honest prototype-complete copy
- `/privacy`, `/terms`
- Admin prototype: login, overview, leads, courses, teachers, demos, settings
- Typed mock data layer
- `npx tsc --noEmit` passed
- `npx eslint .` passed after lint fixes
- Dev server was started on port 3000 during this session

Not done:

- Pixel-faithful match to `Frontend.md` (this is a first composition pass)
- Visual QA across mobile/tablet/desktop
- `next build` was not run after the full UI was written
- Backend / Supabase / real WhatsApp / real auth
- Real assets (logo, photos, contact, payment numbers)
- Many admin form fields vs full PRD course/teacher/demo schemas
- Inquiry modal focus trap / escape-to-close polish
- Lucide is installed but barely used

---

## 4. How to run

```bash
npm install
npm run dev
```

Scripts in `package.json`:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`

Env files:

- `.env.example` — committed-style template
- `.env.local` — `NEXT_PUBLIC_PROTOTYPE_MODE=true` and `NEXT_PUBLIC_HERO_HLS_URL=...`

`.gitignore` ignores `.env*` except `.env.example`.

Next.js config: `next.config.ts`

- `allowedDevOrigins: [".monkeycode-ai.live"]`
- Tailwind v4 via `@tailwindcss/turbopack`
- `cacheComponents` and `partialPrefetching` came from create-next-app 16. Keep them unless they cause preview bugs.

---

## 5. Stack actually installed

From `package.json`:

- next 16.4.2
- react / react-dom 19.3.0
- tailwindcss 4 + `@tailwindcss/turbopack`
- gsap, framer-motion, lucide-react, hls.js
- typescript, eslint-config-next

Fonts (in `app/layout.tsx`):

- Inter → `--font-inter`
- Instrument Serif italic → `--font-instrument`
- Hind Siliguri (Bangla fallback) → `--font-bengali`

Tokens live in `app/globals.css` as `--bg`, `--surface`, `--text`, `--muted`, `--stroke`, mapped in `@theme inline` to Tailwind colors `bg`, `surface`, `text-primary`, `muted`, `stroke`. Font families: `font-body`, `font-display`.

There is no `tailwind.config.js`. Tailwind v4 is CSS-first.

---

## 6. Route map (implemented)

### Public

| Route | File | Notes |
| --- | --- | --- |
| `/` | `app/page.tsx` | Homepage sections |
| `/courses` | `app/courses/page.tsx` | Suspense + `CoursesDirectory` |
| `/courses/[slug]` | `app/courses/[slug]/page.tsx` | Client page; unknown slug → not-found UI |
| `/privacy` | `app/privacy/page.tsx` | Placeholder |
| `/terms` | `app/terms/page.tsx` | Placeholder |
| `robots.ts` | `app/robots.ts` | Disallow `/admin` |

Nav: Home `/`, Courses `/courses`, Mentors `/#mentors`, Class Demos `/#demos`, Contact `/#contact`.

### Admin (UI prototype only)

| Route | File | Notes |
| --- | --- | --- |
| `/admin/login` | `app/admin/login/page.tsx` | Does not verify credentials |
| `/admin` | `app/admin/page.tsx` | Counts from mock leads |
| `/admin/leads` | `app/admin/leads/page.tsx` | Four separate status dropdowns |
| `/admin/courses` | `app/admin/courses/page.tsx` | Local React state CRUD |
| `/admin/teachers` | `app/admin/teachers/page.tsx` | Local React state |
| `/admin/demos` | `app/admin/demos/page.tsx` | Local React state |
| `/admin/settings` | `app/admin/settings/page.tsx` | Local React state; empty contact fields |

`app/admin/layout.tsx` wraps pages in `AdminChrome`. Login path skips the gate. Other admin paths check `sessionStorage.eee-admin-prototype === "1"` via `components/admin/gate.tsx`. That is **not** authorization.

---

## 7. Important files

```text
PRD.md
Frontend.md
docs/superpowers/specs/2026-10-21-eee-academy-frontend-design.md
progress-report.md                 ← this file
app/layout.tsx
app/globals.css
app/page.tsx
next.config.ts
lib/types.ts
lib/data/index.ts                  ← UI must import from here, not lib/mock
lib/mock/*                         ← development-only sample records
lib/pricing.ts                     ← getDisplayPrice + formatTaka
lib/prototype.ts                   ← isPrototypeMode()
components/ui/*                    ← Button, LogoMark, SectionHeader, badges, empty states
components/public/*                ← homepage, courses, inquiry, nav, loader, footer
components/admin/*                 ← chrome, gate, sidebar, notice
```

Mock modules:

- `lib/mock/courses.ts`
- `lib/mock/teachers.ts`
- `lib/mock/demos.ts`
- `lib/mock/leads.ts`
- `lib/mock/payments.ts`
- `lib/mock/settings.ts` (all contact/payment fields null)

---

## 8. Data and honesty rules (do not break)

### Access boundary

```text
page/component → lib/data/* → lib/mock/*   (Phase 1)
page/component → lib/data/* → Supabase     (Phase 2, not started)
```

Never import `lib/mock` from UI except the admin courses page currently imports `mockCourses` for local editing. Prefer routing that through `lib/data` if you touch it.

### Prototype indicator

`NEXT_PUBLIC_PROTOTYPE_MODE` defaults on unless set to `"false"`.

- `PrototypeMark` shows `Preview · sample data`
- `SampleHint` can mark prices/names
- Admin layout always shows a prototype notice

### Inquiry

`submitInquiry()` in `lib/data/index.ts` validates on the client and returns `{ ok: true, prototype: true }` or field errors.

Success copy **must** stay:

The form is valid. Saving the inquiry and the WhatsApp handoff will be connected during the backend phase. Opening WhatsApp does not happen in this prototype.

No `wa.me` after submit. Honeypot field: `website`.

### External actions

- Mock student phones are table text only.
- Admin Call/WhatsApp opens a local dialog, not `tel:` / `wa.me`.
- Class demo Watch opens an in-page “Sample demo — video will play here…” panel.
- Footer contact CTA goes to `/courses` because settings numbers are unset.
- Hero Mux HLS is the only approved remote media exception.

### Price helper

`lib/pricing.ts` → `getDisplayPrice(course)`:

1. null/absent discount → current = regular
2. valid discount → current = discount, original = regular
3. invalid discount → treat as no discount

Format: `formatTaka` → `৳4,500`

---

## 9. Animation split (keep it)

GSAP:

- Hero entrance in `components/public/hero.tsx`
- Footer marquee in `components/public/footer.tsx`
- Enrollment pin/parallax in `components/public/enrollment-journey.tsx` (desktop, skipped on reduced motion / mobile)

Framer Motion:

- Loader word cycle
- Hero rotating Bangla roles
- SectionHeader `whileInView`
- Inquiry/FAQ local UI

CSS keyframes in `app/globals.css`: `scroll-down`, `role-fade-in`, `gradient-shift`, `.accent-gradient`, `.accent-gradient-border`

Loader uses `sessionStorage.eee-loader-shown` so it should not replay on internal navigations.

---

## 10. Known gaps for the next frontend pass

Work these before calling Phase 1 complete. Do not invent backend.

1. **Visual fidelity.** Compare every homepage section to `Frontend.md`. Hero type scale, bento `7/5/5/7`, demo pill rows, enrollment pin, footer marquee, gradient hover borders, and spacing still need a design pass. Do not turn it into a generic LMS.

2. **Responsive / a11y.** Test 375 / 768 / 1280. Mobile nav, tap targets, focus rings, FAQ keyboard, modal focus trap, reduced motion, no horizontal overflow.

3. **Inquiry modal.** Add focus trap, Escape to close, click-outside, `aria` wiring, first-invalid-field focus (partially there). Keep honest prototype submit.

4. **Course details.** Related teachers are only a short note, not real associations (PRD has related teachers; mock schema does not have a join table yet). Add a typed relation if you need it, still mock-only.

5. **Admin completeness.** Course/teacher/demo editors cover a subset of PRD fields. Leads table is missing notes editor and payment history panel (mock payments exist in `lib/mock/payments.ts` and `getPaymentsForLead`).

6. **Admin courses import.** `app/admin/courses/page.tsx` imports `mockCourses` directly. Public pages still read static mocks, so local admin edits do not appear on `/` or `/courses`. That is intentional per spec, but document it in the UI if you extend it.

7. **Build check.** Run `npm run build` and fix App Router / client-boundary issues. Several public pages are client components because of animation; that is OK, but watch bundle size and hydration.

8. **create-next-app leftovers.** Default `public/` SVGs may still exist. `lucide-react` is unused. Cache Components is on; if preview behaves oddly, investigate before ripping it out.

9. **Copy / Bangla fallback.** Instrument Serif will not cover Bangla; Hind Siliguri is the fallback. Check headline rendering.

10. **Do not** add fake testimonials, success rates, real-looking phone numbers, or “inquiry saved” copy.

---

## 11. Phase 2 (later, not now)

When the owner explicitly starts backend:

- Keep `lib/data` function signatures.
- Server actions for inquiry: validate, load course/fee from DB, idempotent insert, then return confirmed payload, **then** WhatsApp.
- Supabase Auth + `admin_users` role check on every privileged action.
- RLS as specified in `PRD.md`.
- Never put service_role in the client.
- Never put private Facebook group URLs in public course rows.

Do not implement this until asked.

---

## 12. Suggested next-agent sequence

1. Read `progress-report.md`, then the spec, then skim `Frontend.md` sections 4–13.
2. Run `npm run dev`, walk `/`, `/courses`, one course slug, inquiry, `/admin/login`.
3. Design-fidelity pass on homepage (highest visual risk).
4. Inquiry modal a11y + mobile.
5. Admin leads notes/history + remaining form fields.
6. `npm run lint`, `npm run typecheck`, `npm run build`.
7. Stop. Do not start Supabase unless the owner says so.

---

## 13. Session notes

- Workspace originally contained only `PRD.md` and `Frontend.md`. Next.js was scaffolded via create-next-app in `/tmp/eee-academy` then copied in because those markdown files blocked scaffolding in place.
- Lint rule `react-hooks/set-state-in-effect` is strict on this Next 16 / ESLint 9 setup. Admin gate uses `useSyncExternalStore` for the mock session flag. Loader/hero-video initialize from `window` in `useState` initializers where possible.
- Dev preview was served on port 3000. That process may not still be running in a later session.

Owner instruction for this file: continue from another AI agent. The project is not finished, and that is expected.

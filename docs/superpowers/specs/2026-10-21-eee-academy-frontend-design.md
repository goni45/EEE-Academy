# EEE Academy — Phase 1 Frontend Design Specification

**Date:** 21 October 2026
**Status:** Draft for product-owner review — not approved for implementation
**Scope:** Frontend only. No scaffolding, application code, or backend work until explicit approval.
**Sources of truth:**
- Product, routes, data fields, workflows, and future backend behavior: `PRD.md`
- Visual design, layout composition, typography, animation, and interaction language: `Frontend.md` (the original portfolio design prompt)

---

## 1. Purpose

Build a complete Next.js frontend for EEE Academy that:

1. Matches the cinematic, editorial, premium dark portfolio aesthetic in `Frontend.md` as closely as possible.
2. Presents EEE Academy content, course discovery, inquiry UX, and admin screens defined in `PRD.md`.
3. Uses isolated development-only mock data so the UI can be designed without a backend.
4. Is structured so Phase 2 (Supabase) can replace the data layer without rewriting screens.

This is a design transformation of the reference portfolio into an education brand. It is not a generic LMS, a conventional blue-and-white school site, or a dashboard-style homepage.

Phase 1 does not persist data, authenticate users, send WhatsApp messages, verify payments, or perform any real privileged operation.

---

## 2. Constraints and non-goals

### In scope (Phase 1)

- Next.js App Router project with TypeScript and Tailwind CSS
- Public website: homepage, course directory, course details, inquiry UI, privacy, terms
- Admin dashboard UI for the PRD routes, using mock data and local state
- Shared design system, reusable components, animation system
- Loading, empty, error, success, and reduced-motion states
- Typed mock data modules matching PRD field definitions
- Stubbed data-access functions ready for later Supabase replacement

### Out of scope (Phase 1)

- Supabase, PostgreSQL, RLS, migrations, environment secrets
- Real admin authentication or authorization
- Real inquiry persistence or WhatsApp Click-to-Chat after a confirmed save
- Payment gateways, automatic payment verification, automatic Facebook group enrollment
- Student login or student accounts
- Invented production facts: fees-as-truth, qualifications, testimonials, statistics, contact numbers, social URLs
- Vite, React Router, or a separate frontend application

### Hard rules carried from the owner review

1. **Visual fidelity.** `Frontend.md` is the primary visual reference. Preserve design language, layout composition, typography, loading animation, GSAP transitions, Framer Motion reveals, parallax, gradient hover borders, pill navigation, and footer marquee. Adapt content to EEE Academy. Do not simplify into a generic education template.
2. **Mock data.** Sample courses, teachers, and demos live only in development-only mock modules. Never present invented prices, qualifications, contact details, statistics, or testimonials as verified information.
3. **Inquiry form.** The prototype must not claim an inquiry was saved or a WhatsApp message was sent. Demo submission must state that actual submission will be connected in the backend phase.
4. **Admin UI.** Local-state CRUD and mock login demonstrate the interface only. They are not persistent or secure production functionality.
5. **Sources of truth.** `PRD.md` for product. `Frontend.md` for visual design.
6. **Course pricing display.** If `discount_price` is null, display `regular_price` as the current price. If a valid discount exists (`discount_price` is non-null, non-negative, and no greater than `regular_price`), display `discount_price` as the payable price and `regular_price` as the crossed-out original price. Sample prices must never be presented as verified academy pricing.
7. **Prototype indicator.** Mock/sample content must be clearly identifiable during frontend preview through a configurable, unobtrusive prototype/demo indicator. Placeholder data must not be mistakable for verified production content.
8. **No live external actions on mock data.** Fake student phone numbers must not initiate real calls or WhatsApp messages. Unverified demo video URLs must not send users to unknown external sites. Use disabled actions or clearly labeled local demo interactions until real, approved data is available.

---

## 3. Stack

Use currently supported versions at implementation time:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- GSAP and GSAP ScrollTrigger
- Framer Motion
- Lucide icons
- hls.js for the HLS hero background, with native HLS fallback

Do not introduce conflicting frameworks. Do not add Vite, `vite.config.*`, or any Vite-specific `allowedHosts` setup.

### Preview host configuration

The current platform rule for Node.js dev servers is to allow `*.monkeycode-ai.live` so online preview can reach the app. This project is Next.js App Router, not Vite.

At implementation time, apply this only through supported Next.js configuration:

1. Confirm whether the running Next.js version still documents `experimental.allowedDevOrigins` / `allowedDevOrigins` (or the equivalent current option) for dev-host allowlisting.
2. If that Next.js option exists, add `.monkeycode-ai.live` there in `next.config.ts` / `next.config.js` / `next.config.mjs`.
3. If it does not exist in the installed Next.js version, do not invent a Vite-style `server.allowedHosts` block. Use the documented Next.js alternative, or omit the setting and rely on the preview environment’s default if Next.js does not require it.
4. Never copy Vite `server.allowedHosts` into this codebase.

The domain format, when used, is `.monkeycode-ai.live` (leading dot as wildcard). Do not overwrite unrelated Next.js config.

---

## 4. Architecture

### 4.1 One application, two surfaces

A single Next.js app contains:

- Public marketing and enrollment UI
- Admin operational UI

They share tokens, typography, and primitive components. They do not share cinematic homepage motion. Admin screens are dense, keyboard-friendly, and restrained.

### 4.2 Data access boundary

UI components never import mock records directly.

```
Component / page
  -> lib/data/*  (typed accessors: getPublicCourses, getPublishedTeachers, ...)
       -> lib/mock/*  (Phase 1 only)
       -> server actions / Supabase  (Phase 2, not implemented now)
```

Phase 1 accessors return mock data or throw typed errors for empty/error-state demos. Phase 2 replaces accessor internals. Function signatures stay aligned with PRD entities.

### 4.3 Client vs server components

- Server components for page shells, metadata, and static structure.
- Client components only where required: animation, HLS, scroll, modals, forms, filters, local admin CRUD, reduced-motion detection.
- Animation and browser APIs stay isolated so they cannot cause hydration flicker or broken scrolling.

### 4.4 No fake backend

Do not add Next.js API routes that pretend to persist leads or authenticate admins. Do not show “saved to database” or “payment verified” unless a real backend later confirms it.

---

## 5. Project structure

```text
app/
  layout.tsx
  page.tsx
  courses/page.tsx
  courses/[slug]/page.tsx
  privacy/page.tsx
  terms/page.tsx
  admin/login/page.tsx
  admin/layout.tsx
  admin/page.tsx
  admin/leads/page.tsx
  admin/courses/page.tsx
  admin/teachers/page.tsx
  admin/demos/page.tsx
  admin/settings/page.tsx
components/
  public/
  admin/
  ui/
lib/
  data/
  mock/
  validations/
  animations/
styles/
  globals.css
```

Exact filenames may be split further (for example `components/public/hero.tsx`) as long as the boundary above is preserved.

---

## 6. Route map

### Public

| Route | Purpose |
| --- | --- |
| `/` | Homepage. Mentors, demos, and contact are in-page sections `#mentors`, `#demos`, `#contact`. |
| `/courses` | Course directory with working category and semester filters. |
| `/courses/[slug]` | Course details. Inquiry CTA only when admission is open. |
| `/privacy` | Privacy Policy placeholder using PRD-required topics, not invented legal claims. |
| `/terms` | Terms of Service placeholder. |

Nav links:

- Home → `/`
- Courses → `/courses`
- Mentors → `/#mentors`
- Class Demos → `/#demos`
- Contact → `/#contact`

### Admin (UI only)

| Route | Purpose |
| --- | --- |
| `/admin/login` | Mock login screen. Does not authenticate. |
| `/admin` | Overview metrics from mock counts. |
| `/admin/leads` | Lead table, filters, four separate status groups. |
| `/admin/courses` | Course list and local create/edit UI. |
| `/admin/teachers` | Teacher list and local create/edit UI. |
| `/admin/demos` | Demo list and local create/edit UI. |
| `/admin/settings` | Grouped public settings form. |

No student-account routes. Admin routes are not indexed. Phase 1 may gate admin pages with a client-side mock session flag for demonstration. That flag is not security.

---

## 7. Design system

### 7.1 Direction

Cinematic, minimal, editorial, premium dark. Near-black surfaces, oversized serif headlines, clean sans body, floating glass pill nav, restrained blue gradient, rounded bento cards, fine borders, subtle noise/halftone, layered parallax, animated loader, horizontal footer marquee.

Do not replace this with a generic education template.

### 7.2 Fonts

Google Fonts:

- Inter, weights 300–700: body, nav, controls, metadata, course descriptions
- Instrument Serif, italic 400: display headings, selected emphasis, decorative numbers, expressive labels

CSS variables:

```css
--font-body: 'Inter', sans-serif;
--font-display: 'Instrument Serif', serif;
```

Bangla copy uses a legible Bangla-capable fallback when Instrument Serif cannot render the characters. English display typography stays unchanged where glyphs exist.

### 7.3 Color tokens

```css
:root {
  --bg: 0 0% 4%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  --muted: 0 0% 53%;
  --stroke: 0 0% 12%;
  --accent: 0 0% 96%;
}
```

Tailwind mapping:

```js
bg: "hsl(var(--bg))",
surface: "hsl(var(--surface))",
"text-primary": "hsl(var(--text))",
muted: "hsl(var(--muted))",
stroke: "hsl(var(--stroke))",
```

Force dark theme. No light/dark toggle.

### 7.4 Accent gradient

```css
linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
```

Utility: `.accent-gradient`

Use for logo ring, hover borders, selected states, loader progress, animated button borders, thin decorative progress, and focus accents. The site stays predominantly near-black, not saturated blue.

### 7.5 Global appearance

- 1px borders and translucent surfaces
- Rounded geometry and spacious public layouts
- Strong type hierarchy; no overcrowding
- Consistent container widths (`max-w-[1200px]` for most sections; enrollment gallery `max-w-[1400px]`)
- Accessible contrast and visible keyboard focus
- `prefers-reduced-motion` respected everywhere

### 7.6 Shared primitives

| Component | Role |
| --- | --- |
| `Button` | Solid light pill, dark outline pill, gradient-border hover, scale `1.03–1.05` |
| `NavPill` | Floating navbar container and link states |
| `LogoMark` | Circular gradient-ring wordmark/monogram, replaceable |
| `SectionHeader` | Eyebrow line, display heading with italic emphasis, supporting copy, optional pill CTA |
| `CourseCard` | Bento and directory variants |
| `MentorCard` | Portrait, name, verified fields only |
| `DemoRow` | Horizontal pill row |
| `Modal` | Inquiry and admin dialogs, focus trap |
| `TextField`, `Select`, `Checkbox` | Labeled, error, focus |
| `StatusBadge` | Four independent status families |
| `EmptyState`, `ErrorState`, `Skeleton` | Honest UX states |
| `AdminTable`, `AdminMetricCard`, `ConfirmDialog` | Admin density |
| `PrototypeMark` | Unobtrusive “Preview / sample data” indicator, configurable, not a second visual system |

### 7.7 Prototype / demo indicator

Phase 1 always renders sample content. That fact must be visible without breaking the cinematic reference.

Requirements:

- A single configurable flag (for example `NEXT_PUBLIC_PROTOTYPE_MODE`, default on in Phase 1) controls the indicator. When the real backend later supplies production data, the flag is turned off and the indicator disappears.
- Place one compact, persistent mark on public pages: small muted text in the floating nav or a thin top edge label such as `Preview · sample data`. Typography, color, and size must stay inside the existing dark system (`text-xs`, `text-muted`, no bright banner, no second brand color).
- Place the same mark, plus the existing admin prototype notice, on admin pages.
- Course fees, teacher names, demo titles, and lead contact fields that come from `lib/mock` may use a muted `Sample` suffix or equivalent `aria`/visible hint on the value itself when space allows. Do not stamp a large watermark across hero, cards, or photography.
- The indicator must not cover CTAs, must not shift the hero composition, and must not introduce a light-theme ribbon or LMS-style alert.
- Screen readers should hear that catalogue content is sample preview data.

### 7.8 Course price display

Shared helper (used by featured cards, directory cards, course details, and the inquiry read-only fee):

1. If `discount_price` is `null` or absent, show `regular_price` as the only current price.
2. If a valid discount exists — `discount_price` is non-null, numeric, `>= 0`, and `<= regular_price` — show `discount_price` as the payable/current price and `regular_price` as the crossed-out original price.
3. If `discount_price` is present but invalid (negative, greater than `regular_price`, or non-numeric), ignore it and display `regular_price` only. Do not show a fake discount.
4. Format as Bangladeshi Taka in a consistent pattern (for example `৳4,500`). Do not invent a different currency.
5. Sample mock prices are layout fixtures only. Never label them “official fee,” “current academy fee,” or “verified price.” Near price UI, the prototype indicator or a muted `Sample price` hint must make that clear.
6. The inquiry form shows the same derived current price as read-only. Phase 2 will replace it with the server-fetched fee.

---

## 8. Animation system

Implement the named keyframes from `Frontend.md` in the global stylesheet:

- `scroll-down` — 1.5s ease-in-out infinite
- `role-fade-in` — 0.4s ease-out
- `gradient-shift` — 6s ease infinite

### GSAP (not duplicated in Framer)

- Hero entrance timeline (`power3.out`)
- Loader progress where appropriate
- Continuous footer marquee (`xPercent: -50`, ~40s, ease none, repeat `-1`)
- Enrollment pin and parallax (desktop)
- Decorative scroll interactions

Hero timeline:

- `.name-reveal`: opacity 0→1, y 50→0, 1.2s, delay 0.1s
- `.blur-in`: opacity 0→1, blur 10px→0, y 20→0, 1s, stagger 0.1, delay 0.3s

### Framer Motion (not duplicated in GSAP)

- Loader word cycle (`AnimatePresence` `mode="wait"`, ~900ms)
- Rotating study-focus line (~2s)
- Section `whileInView` (opacity 0→1, y 30→0, 1s, ease `[0.25, 0.1, 0.25, 1]`, once, margin `-100px`)
- Card reveals, modal, FAQ accordion, small layout transitions

### Rules

- One library per animation
- Clean up GSAP timelines, ScrollTriggers, listeners, HLS instances, observers on unmount
- No hydration errors, content flicker, or broken scrolling
- Reduced motion: skip loader cycle, pin/parallax, marquee, and large y/blur reveals; keep essential UI visible immediately
- Mobile: no expensive pin; stacked enrollment steps; optional static poster instead of HLS

---

## 9. Public screens

Copy that is already specified in `PRD.md` / `Frontend.md` is used verbatim. Unspecified marketing lines stay generic and must not invent results, guarantees, or teacher claims.

### 9.1 Loading screen (first visit only)

- `fixed inset-0 z-[9999] bg-bg`
- Top-left: `EEE ACADEMY` — `text-xs`, muted, uppercase, `tracking-[0.3em]`, y -20→0
- Center: `Learn` / `Prepare` / `Achieve` — `text-4xl md:text-6xl lg:text-7xl font-display italic`
- Bottom-right: `000`–`100` tabular counter, ~2700ms `requestAnimationFrame`, `text-6xl md:text-8xl lg:text-9xl font-display tabular-nums`
- Bottom bar: 3px track `bg-stroke/50`, fill `.accent-gradient` via `scaleX`, subtle blue glow
- After 100, wait ~400ms, then remove overlay
- Do not replay on internal navigation
- Must not block catalogue or inquiry
- Skip or shorten when `prefers-reduced-motion`

### 9.2 Floating navigation

Position: `fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4`

Inner: `inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2`

Scroll > 100px: subtle shadow.

Left: circular logo, gradient ring, dark inner surface, hover reverse + scale 110%. Use a simple EEE monogram until a real logo exists. Do not invent an elaborate mark.

Links: Home, Courses, Mentors, Class Demos, Contact. Active: `text-text-primary bg-stroke/50`. Inactive: `text-muted` → active on hover. `text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2`.

Right CTA: `ভর্তি সম্পর্কে জানুন ↗` — same pill, blur, gradient hover as the reference contact button. Opens `/courses` or the inquiry entry when a course is already selected. Does not create a new workflow.

Mobile: prioritize brand, course discovery, and enrollment CTA. Do not force every link into the pill.

### 9.3 Hero

Full viewport. Centered content over HLS background.

Video URL (configurable): `https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`

- hls.js when needed; native HLS when supported
- autoplay, muted, loop, playsInline
- `object-cover`, centered, absolute
- Overlay `bg-black/20`
- Bottom fade `h-48 bg-gradient-to-t from-bg to-transparent`
- Decorative only; never blocks nav or CTAs
- Playback failure: static dark poster, content remains usable
- Mobile / reduced-data: approved poster instead of video when needed

Content:

- Eyebrow: `DIPLOMA EEE • LEARN WITH CONFIDENCE` — `text-xs text-muted uppercase tracking-[0.3em] mb-8` + `.blur-in`
- Heading: **পলিটেকনিক EEE পড়াশোনায় প্রস্তুতি হোক আরও গোছানো** — oversized display, `.name-reveal`
- Rotating line: `সেমিস্টার প্রস্তুতি` / `DUET ভর্তি প্রস্তুতি` / `চাকরির প্রস্তুতি`
- Support: `নিজের সেমিস্টারের কোর্স দেখুন, শিক্ষকদের সঙ্গে পরিচিত হন এবং বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন বুঝে নিন।` — `text-sm md:text-base text-muted max-w-md mb-12`
- Primary: `সব কোর্স দেখুন` → `/courses` — solid light pill, dark text, `text-sm px-7 py-3.5`, hover dark + gradient outline
- Secondary: `ক্লাস ডেমো দেখুন` → `#demos` — dark, `border-2 border-stroke`, same size, hover gradient outline
- Scroll indicator: `SCROLL` + `w-px h-10` line with `.animate-scroll-down`

### 9.4 Homepage section order

Matches PRD recommended order, realized with Frontend.md compositions:

1. Hero
2. Compact semester/course pathway selector (chips linking to featured filter or `/courses?category=`)
3. Featured courses (Selected Works → bento)
4. Mentors
5. Class demos (Journal rows)
6. Enrollment journey (Explorations parallax)
7. Learning pathways (Stats typography, not fake numbers)
8. FAQ
9. Contact, marquee, footer

### 9.5 Featured courses

Section: `bg-bg py-12 md:py-16` / inner `max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16`

- Eyebrow: `Featured Courses`
- Heading: `Build your foundation. *Prepare for what’s next.*`
- Support: `আপনার সেমিস্টার, DUET ভর্তি প্রস্তুতি অথবা চাকরির প্রস্তুতির জন্য উপযুক্ত কোর্স খুঁজে নিন।`
- Desktop CTA: `সব কোর্স দেখুন ↗`

Grid: `grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6` with spans `7 / 5 / 5 / 7`.

Cards: `bg-surface`, `border-stroke`, `rounded-3xl`, large image area, hover image scale ~1.05, halftone, translucent dark hover + blur, gradient outline, pill `View Course — *Title* ↗`.

Show only mock records that represent public active courses. Display title, category, semester if relevant, price using the Section 7.8 rules, short description/features, admission state, CTA. Sample prices follow 7.8 and are never presented as verified academy pricing.

Closed admission: visible, cannot open inquiry.

Empty: designed empty state, not fabricated extra cards.

### 9.6 Mentors (`#mentors`)

- Eyebrow: `MEET YOUR MENTORS`
- Heading: `Learn with *guidance.*`
- Support: `শিক্ষকদের পরিচিতি ও বিষয়ভিত্তিক দক্ষতা দেখে আপনার শেখার যাত্রা শুরু করুন।`

Cards show only fields present on the mock teacher: name, qualifications/affiliation, expertise, short bio, optional photo placeholder. Do not invent years of experience, rankings, or institutions.

Unpublished mock teachers are omitted, matching future `is_published` behavior.

### 9.7 Class demos (`#demos`)

- Eyebrow: `WATCH A CLASS`
- Heading: `See how we *teach.*`
- Support: `বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন ও আলোচনার বিষয় সম্পর্কে ধারণা নিন।`
- Desktop CTA: `সব ক্লাস ডেমো দেখুন ↗`

Rows: `rounded-[40px] sm:rounded-full flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke`

Thumbnail, title, topic, related published teacher if present, watch action. Keyboard and screen-reader usable as a whole row.

Do not invent duration, dates, or view counts.

Phase 1 must not navigate the visitor to an unverified external video URL. Mock `video_url` values are not approved production assets.

Watch action in Phase 1:

- Disabled control, or
- A local in-page demo panel that states “Sample demo — video will play here when an approved URL is configured”

Do not use `target="_blank"` links, Facebook embeds, or arbitrary iframe sources from mock data. If `video_url` is empty, show the elegant fallback card, not a broken iframe. Real, allowlisted providers are a Phase 2 concern once approved URLs exist.

### 9.8 Enrollment journey

Desktop: tall section `min-h-[300vh]`, GSAP pin + parallax. Mobile: stacked steps, no heavy pin.

Pinned copy:

- Eyebrow: `YOUR LEARNING JOURNEY`
- Heading: `A clearer path to *your next step.*`
- Support: `কোর্স নির্বাচন থেকে ভর্তি নিশ্চিত করা পর্যন্ত প্রতিটি ধাপ সহজভাবে বুঝে নিন।`
- CTA: `কোর্স বেছে নিন ↗` → `/courses`

Parallax columns: `max-w-[1400px]`, `grid grid-cols-2 gap-12 md:gap-40`, square cards max ~320px, slight rotation, rounded, soft overlay. Decorative only. Never labeled as a real course or teacher.

Honest steps (PRD):

1. Choose a course
2. Submit your details
3. Contact the academy (student still must send WhatsApp later)
4. Complete enrollment (manual pay, admin verification, admin adds to Facebook group)

Do not imply automatic payment, enrollment, or group access.

### 9.9 Learning pathways

`bg-bg py-16 md:py-24` / `grid grid-cols-1 md:grid-cols-3`

Oversized numbers, Instrument Serif italic, thin dividers. Not statistics.

- 01 Semester Courses
- 02 DUET Admission
- 03 Job Preparation

No fabricated years, student counts, success rates, or satisfaction percentages.

### 9.10 FAQ

- Eyebrow: `COMMON QUESTIONS`
- Heading: `Before you *begin.*`

Keyboard-accessible accordion. Topics limited to verified process facts:

- How do I choose a course?
- Do I need to create a student account? (No.)
- How do I contact the academy after submitting an inquiry?
- Which payment methods does the academy support? (Manual bKash/Nagad; no invented numbers.)
- How is payment verified? (Admin checks the receiving account.)
- When will I be added to the private Facebook group? (After payment verification and enrollment; admin adds manually.)

Do not invent amounts, deadlines, refunds, or guarantees.

### 9.11 Contact and footer (`#contact`)

`bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden`

Optional approved background video or matching image, overlay ~`bg-black/60`, must not hurt readability or mobile performance.

Marquee: `LEARN • PREPARE • BUILD YOUR FUTURE •` looping, no horizontal page overflow.

CTA: `ভর্তি সম্পর্কে জানতে যোগাযোগ করুন ↗` — destination from public settings only when a real, approved number exists. In Phase 1 settings are unset, so the control is disabled (or routes internally to `/courses`) with “Contact details will be configured later.” Never hard-code an invented number. Never open `wa.me` or `tel:` from placeholder values.

Footer links: Home, Courses, Mentors, Class Demos, Contact, Privacy, Terms. Real social links only if present in mock settings (they will not be). No Dribbble/GitHub. No green “Available for projects”. No invented address, email, or phone.

### 9.12 Courses directory `/courses`

Same design system as the homepage. Editorial header: `Find the course for your *next step.*` Visible way home and way to start an inquiry.

Working filters: category (`semester`, `duet_admission`, `job_prep`) and semester where relevant. Filters are functional, not decorative.

Cards reuse bento visual language in a directory-friendly grid. Show title, category, department/semester, description, price using Section 7.8, features, duration, delivery format, admission state, details/inquiry action. Sample prices are not verified academy pricing.

Closed courses cannot start inquiry. Loading, empty, error, retry states required. No fictitious cards when the list is empty.

### 9.13 Course details `/courses/[slug]`

Same brand. Show description, syllabus/topics, features, duration, delivery format, related teachers, and fees from the mock course record using Section 7.8. The payable amount on the page is the derived current price (`discount_price` when valid, otherwise `regular_price`). That figure is still sample data, not a verified academy fee.

If slug is unknown: designed not-found, not a fake course.

Inquiry CTA only when `is_active` and `admission_open` on that record.

### 9.14 Inquiry modal / form

Visual: dark surface, thin borders, rounded controls, clear labels, visible focus, elegant transitions. Usable on a phone.

Required:

- Student full name
- Polytechnic/institute name
- Polytechnic roll number
- Department
- Semester or current study level where relevant
- Contact phone
- WhatsApp number, with “same as phone”
- Selected course

Optional: email.

Selected course title, category/semester, and fee are read-only. Fee uses Section 7.8 and is labeled as sample in Phase 1. The prototype treats these fields as display-only so Phase 2 can ignore client-supplied price/title.

Client validation:

- Required fields
- Bangladeshi phone formats allowing spaces/hyphens; normalize locally for display (`01XXXXXXXXX` / `+8801XXXXXXXXX`)
- Disable submit while in flight
- Preserve values on validation failure
- Field-level errors
- Honeypot field present in the DOM for later server use; no Phase 1 network call

**Demo submit behavior (mandatory):**

After client validation passes, show a distinct prototype state. It must not say the inquiry was saved, the database confirmed anything, or WhatsApp was opened/sent.

Required meaning of the copy:

The form is valid. Saving the inquiry and the WhatsApp handoff will be connected during the backend phase. Opening WhatsApp does not happen in this prototype.

No `wa.me` navigation in Phase 1 after submit. No success that could be mistaken for production.

### 9.15 Privacy and terms

Minimal editorial pages in the same dark system. Explain that contact data will be used to respond to inquiries and manage enrollment once the backend exists. Do not invent legal jurisdiction claims beyond what the PRD already requires.

---

## 10. Admin screens

Same tokens, Inter/Instrument Serif, thin borders, restrained gradient. No loader-as-blocker, no hero video, no parallax, no marquee inside operational views.

Every admin layout includes a persistent, visible notice:

Admin screens are an interface prototype. Login, edits, and status changes are local only and are not authenticated, authorized, or persisted. Real security lands in Phase 2.

### 10.1 Mock login `/admin/login`

Email and password fields styled as production, plus a “Continue to dashboard (prototype)” action that sets a client-only flag. Copy states this does not verify credentials. No Supabase Auth. No public signup.

### 10.2 Overview `/admin`

Metric cards from mock-derived counts: pending leads, contacted leads, payment states, active enrollments, recent activity list from mock leads. Never hard-code unrelated sample numbers in the component tree; compute from `lib/data`.

### 10.3 Leads `/admin/leads`

Columns: submitted at, name, polytechnic, roll, department/semester, course, phone, WhatsApp, email, lead status, payment status, enrollment status, group access, notes.

Actions (UI only): search, filter, status controls, notes field, duplicate flag display.

Call and WhatsApp controls on mock student numbers must not fire real `tel:` or `wa.me` navigation. Render them disabled, or as labeled prototype buttons that open a local dialog: “Sample contact — real call/WhatsApp will be enabled when production data is connected.” Do not place fake numbers into `href`.

Four status families stay separate. Never one combined dropdown.

Status values (PRD):

- Lead: `pending`, `contacted`, `closed`, `cancelled`
- Payment: `not_submitted`, `submitted`, `verified`, `rejected`
- Enrollment: `not_enrolled`, `pending`, `active`, `completed`, `cancelled`
- Group: `not_added`, `added`, `removed`

Local status edits reset on refresh. Copy must not say “saved to server.”

### 10.4 Courses, teachers, demos

Tables and forms for PRD fields. Create/edit/reorder/publish/unpublish/admission open-close as local state. Prefer deactivate/archive controls over a hard-delete control. Unsaved changes are not shown as published on public pages (public pages read mock modules, not admin local state, unless a clearly labeled preview is added later).

### 10.5 Settings `/admin/settings`

Grouped:

- Public contact: WhatsApp, helpline, support email, address, map
- Social: public Facebook page only
- Payment instructions: bKash/Nagad copy fields
- No private Facebook group URL on this public-settings screen

Empty placeholders, not invented numbers. Saving is local-state only.

### 10.6 Authorization appearance vs reality

Signed-out visitors can be redirected to `/admin/login` in the prototype. That is UX, not security. Phase 2 will enforce session + `admin_users` role on every server action. The UI should already have an access-denied view for a future non-admin session.

---

## 11. Mock data strategy

### 11.1 Location and labeling

All sample records live in `lib/mock/` and are imported only by `lib/data/`.

Each mock module file starts with a comment that it is development-only sample data and must not be treated as verified academy information.

Public UI that renders fees, names, or contact values from mock data must use the Section 7.7 indicator and must not claim official verification. Course cards show a catalogue preview price per Section 7.8, never “official current fee confirmed by EEE Academy.” Settings-driven contact blocks stay empty or “Not configured.”

### 11.2 Entity shapes (align with PRD)

Implement TypeScript types that mirror:

- `courses`: id, title, slug, description, department, category, semester, regular_price, discount_price, features, syllabus, duration, delivery_format, is_active, admission_open, order_index, timestamps
- `teachers`: id, name, qualifications, institution_or_batch, expertise, bio, photo_url, display_order, is_published, timestamps
- `class_demos`: id, title, topic, description, teacher_id, video_url, thumbnail_url, display_order, is_published, timestamps
- `course_leads`: snapshots, student fields, four status groups, admin_notes, idempotency_key, timestamps
- `payments` (for admin history UI): method, amount, transaction fields, status, reviewer placeholders
- `site_settings`: public contact and payment-instruction fields only
- `admin_users` type exists for later; Phase 1 does not simulate real roles beyond UI chrome

Keep private group URLs out of public mock settings and public queries.

### 11.3 Volume

Enough records to exercise:

- Three categories
- Open and closed admission
- One discounted and one non-discounted course
- Published and unpublished teachers/demos
- Several leads across status combinations

Not so many that the mock file becomes a fake CMS.

### 11.4 Placeholders

- Logo: circular gradient-ring monogram
- Course imagery: dark abstract treatments or existing approved assets only
- Teacher photos: consistent dark placeholders, not stock faces presented as staff
- Contact, social, payment numbers: unset
- No testimonials, success percentages, or “best teacher” claims
- Mock student phones exist only as table text in admin leads, never as live `tel:` / `wa.me` targets
- Mock demo `video_url` is omitted or non-navigable; playback is a local placeholder panel

### 11.5 Mock external actions

Until real, approved data exists:

| Action | Phase 1 behavior |
| --- | --- |
| Call a mock student/admin number | Disabled or local “sample contact” dialog. No `tel:` href. |
| WhatsApp a mock number | Disabled or local dialog. No `wa.me` href from mock/unset values. |
| Footer/contact WhatsApp CTA | Disabled or internal `/courses` fallback. Settings are unset. |
| Watch a class demo | Local in-page placeholder. No navigation to unknown external sites. No unverified iframe/embed. |
| Inquiry submit | Prototype complete state only. No WhatsApp tab. |

Approved Mux HLS on the hero is the exception: that URL is an explicit design-reference asset for background decoration, not user-generated mock content.

### 11.6 Inquiry and admin persistence

Inquiry submit does not write mock files or localStorage as if it were a lead database.

Admin local state may use React state. Optional sessionStorage is allowed only if the UI labels it as prototype state. Default is in-memory so refresh makes the prototype nature obvious.

---

## 12. Validation, errors, and honesty

### Public

- Loading, empty, error, retry on data-driven sections
- Closed admission cannot open the form
- Unknown course slug → not-found
- HLS failure → poster, page still works
- Demo watch → local placeholder; no unknown external navigation in Phase 1
- Inquiry: validation errors, in-flight disabled button, prototype-complete state (not saved, not sent)

### Admin

- Empty tables
- Filter-no-results
- Form field errors
- Confirm dialogs for destructive-looking actions
- Failure copy if a local update is cancelled
- Never “payment verified on server” / “enrollment activated in database”

### Copy that is forbidden in Phase 1

- “Your inquiry has been saved”
- “WhatsApp message sent”
- “Payment confirmed”
- “You have been added to the Facebook group”
- “100% success” or unverified teacher superlatives

---

## 13. Accessibility, SEO, performance

- Semantic HTML, unique titles and meta descriptions, Open Graph, canonical where appropriate
- Do not index `/admin/*`
- Do not put student phone, roll, payment data, internal IDs, or group links in public URLs or metadata
- Labels on every field, keyboard nav, modal focus trap, visible focus, contrast
- Status not communicated by animation or color alone
- Mobile-first; prevent horizontal overflow
- `next/image` for local/supported remote images
- Lazy-load below-the-fold media
- Hero video configurable and skippable on small screens
- Lighthouse 90+ is a goal, not a Phase 1 gate

---

## 14. Phase 2 integration approach

Keep `lib/data` signatures stable:

- `getPublicCourses(filters)`
- `getPublicCourseBySlug(slug)`
- `getPublishedTeachers()`
- `getPublishedDemos()`
- `getPublicSettings()`
- `submitInquiry(payload)` — Phase 1 returns a prototype result type, not a saved lead id
- Admin accessors later become server actions that check session + active role first

Phase 2 will:

- Replace mock internals with Supabase via server components / server actions
- Validate inquiry on the server, fetch course and fee from DB, insert `course_leads` with idempotency, then return confirmed data
- Only then open WhatsApp with server-confirmed fields
- Add real Auth, RLS, audit logs, private `course_private_access`
- Leave UI components largely unchanged

Phase 1 must not import `@supabase/supabase-js` in client bundles or ship service-role patterns.

---

## 15. Implementation sequence (after explicit approval only)

This is the intended build order. It is not permission to start.

1. Scaffold Next.js + Tailwind + fonts + tokens + global keyframes
2. Primitives and layout chrome (logo, nav, footer, buttons)
3. Mock types + `lib/data` + empty/error helpers
4. Loader, hero, HLS
5. Remaining homepage sections
6. `/courses` and `/courses/[slug]`
7. Inquiry modal with honest prototype submit
8. Privacy/terms
9. Admin shell, notice, mock login, overview, leads, remaining admin pages
10. Reduced-motion, keyboard, responsive pass
11. Lint, typecheck, build

Do not begin this sequence until the product owner explicitly approves implementation.

---

## 16. Acceptance criteria (Phase 1)

The frontend phase is successful when:

1. **Visual fidelity.** Dark premium portfolio aesthetic, pill nav, serif display type, blue gradient accents, cinematic hero, bento cards, refined hovers, loader, marquee, and comparable animation timing from `Frontend.md`.
2. **Academy identity.** Portfolio-specific content is replaced with EEE Academy pathways, courses, mentors, demos, enrollment, FAQ, and contact — without becoming a generic education template.
3. **Product mapping.** Routes, form fields, admission rules, and four admin status families match `PRD.md`.
4. **Mock isolation.** Sample data lives in `lib/mock` and is not presented as verified production fact. A configurable, unobtrusive prototype indicator is visible while sample data is shown.
5. **Price display.** `discount_price` null → `regular_price` only. Valid discount → payable `discount_price` plus crossed-out `regular_price`. Invalid discount ignored. Sample prices never labeled as verified academy pricing.
6. **Honest inquiry.** Valid submit never claims save or WhatsApp send.
7. **Honest admin.** Local CRUD and mock login never claim persistence or security.
8. **No live mock externals.** Fake phones do not open `tel:` or `wa.me`. Unverified demo URLs do not leave the site. Disabled or local demo interactions only.
9. **Next.js-only preview config.** If a preview host allowlist is required, it is set in supported Next.js config only. No Vite.
10. **Responsive and accessible.** Desktop/tablet/mobile, reduced motion, keyboard, no horizontal overflow, no hydration errors.
11. **Swap-ready.** Pages depend on `lib/data`, not on scattered hard-coded records.

---

## 17. Open items that do not block this spec

These are deferred, not TBD inside Phase 1:

- Final logo file
- Real course images and teacher photographs
- Production WhatsApp, helpline, email, address, map, social URLs
- Replacement hero video if Mux is later disallowed
- Privacy/terms legal review
- Real FAQ answers that depend on configured payment numbers

Until those exist, use replaceable placeholders and “Not configured” rather than invented values.

---

## 18. Review gate

This document is for review. Do not scaffold the repository, install the app, or write application code until the product owner explicitly says to start implementation.

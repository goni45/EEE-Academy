# EEE Academy — Complete Website Frontend Redesign & UI/UX Direction

## Project Objective

Redesign the existing EEE Academy website using the **same premium dark portfolio design language, layout style, typography, animations, transitions, hover effects, and visual composition** described in this prompt.

This is a design transformation, not a new project or a backend rewrite.

Keep the original reference design as close as possible. Replace only the portfolio-specific content and components with EEE Academy's actual educational content, course catalogue, teacher profiles, class demos, enrollment workflow, and administrative interfaces.

**The visual design must remain consistent with the reference. The content, components, and user journeys must match EEE Academy.**

Before making changes, inspect the existing repository, project structure, components, routes, PRD.md, database integrations, and current frontend behavior. Build on the existing implementation wherever practical.

---

# 1. Non-Negotiable Project Constraints

### Existing technology stack

Use the project's established stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- GSAP and GSAP ScrollTrigger
- Framer Motion
- hls.js for the HLS background video, if the approved video asset is used
- Lucide icons
- Supabase PostgreSQL
- Supabase Auth for admin authentication

Use the installed and currently supported package versions. Do not introduce Vite, React Router, a separate frontend application, or another framework that conflicts with the existing architecture.

### Preserve the existing backend

The existing PRD and working backend are the source of truth for functionality.

- Do not replace, recreate, remove, or weaken existing APIs, server actions, database queries, SQL migrations, RLS policies, authentication, authorization, or validation.
- Do not change the database schema merely to make the UI easier to build.
- Do not expose Supabase secret or service-role keys in client-side code.
- Do not add student login, student accounts, automated payment gateways, automated payment verification, or automatic Facebook group enrollment.
- Do not change the existing course inquiry and WhatsApp workflow.
- Do not bypass server-side authorization or perform privileged operations directly from the browser.
- Do not create fake production data, fabricated results, fake testimonials, or unsupported teacher qualifications.
- Do not claim an operation succeeded until the existing backend confirms it.

If the existing implementation differs from the PRD, inspect and report the difference rather than silently replacing working behavior.

The task is primarily frontend design and UX. Backend modifications are outside the scope unless an existing UI integration genuinely requires a documented correction.

---

# 2. Global Design System

## Design direction

Create a cinematic, minimal, editorial, premium dark educational website.

The aesthetic should feel like a carefully art-directed creative portfolio, adapted to an engineering education brand.

Maintain the reference's:

- Deep-black background and restrained contrast
- Elegant oversized serif headlines
- Clean sans-serif body typography
- Floating glass-style pill navigation
- Blue gradient accents
- Large cinematic hero background
- Rounded bento-grid cards
- Oversized editorial headings
- Fine borders and subtle noise/halftone treatments
- Smooth scroll-triggered reveals
- Refined hover interactions
- Layered parallax imagery
- Animated loading screen
- Horizontal marquee near the footer

**Do not replace this aesthetic with a generic education template, a conventional blue-and-white LMS, a dashboard-style homepage, or a generic Tailwind landing page.**

Course discovery and enrollment must be easy, but the visual identity must remain faithful to the reference.

## Fonts

Import Google Fonts:

- Inter, weights 300–700, for body text, navigation, controls, metadata, and course descriptions.
- Instrument Serif, italic 400, for display headings, selected emphasized words, decorative numbers, and expressive labels.

Define:

```css
--font-body: 'Inter', sans-serif;
--font-display: 'Instrument Serif', serif;
```

Expose these through the existing Tailwind configuration and use them consistently.

For Bangla copy, ensure the chosen font stack also includes a legible Bangla-compatible font fallback. Keep the English display typography unchanged wherever possible. Use an appropriate Bangla glyph fallback when Instrument Serif does not support the required characters.

## CSS custom properties

Preserve the reference's near-black palette:

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

Configure the corresponding Tailwind colors:

```js
bg: "hsl(var(--bg))",
surface: "hsl(var(--surface))",
"text-primary": "hsl(var(--text))",
muted: "hsl(var(--muted))",
stroke: "hsl(var(--stroke))",
```

Keep the existing project's Tailwind configuration conventions instead of replacing its configuration wholesale.

## Accent gradient

Use the exact reference gradient:

```css
linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
```

Create an `.accent-gradient` utility.

Use it for:

- The circular logo outline
- Hover borders
- Selected interactive states
- Loader progress
- Animated button borders
- Thin decorative progress elements
- Focus accents where appropriate

The gradient should be restrained. The site must remain predominantly near-black, not saturated blue.

## Global appearance

- Force the dark theme throughout the public website. Do not add a light/dark toggle.
- Use subtle one-pixel borders and translucent surfaces.
- Preserve the reference's rounded shapes and spacious layouts.
- Keep text hierarchy strong and avoid overcrowding.
- Use consistent container widths, spacing, and responsive typography.
- Keep animation elegant and deliberate rather than flashy.
- Respect `prefers-reduced-motion`.
- Maintain accessible contrast and visible keyboard focus.

---

# 3. Global Animation System

Preserve the reference animation language and approximate timing.

Implement the following custom animations in the existing global stylesheet.

### Scroll indicator

```css
@keyframes scroll-down {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(200%);
  }
}
```

Duration: 1.5 seconds, ease-in-out, infinite.

### Rotating text entrance

```css
@keyframes role-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Duration: 0.4 seconds, ease-out.

### Gradient border animation

```css
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

Duration: 6 seconds, ease, infinite.

### GSAP and Framer Motion

Use GSAP for:

- Hero entrance sequences
- The loading progress animation where appropriate
- Continuous footer marquee
- Scroll-driven parallax
- Pinned sections where appropriate
- Decorative scroll interactions

Use Framer Motion for:

- Section entrance transitions
- Card reveals
- Rotating hero text
- Modal and dialog transitions
- Small layout transitions
- Interactive hover/focus feedback

Avoid implementing the same animation simultaneously in both libraries.

Clean up GSAP timelines, ScrollTriggers, event listeners, HLS instances, and animation observers when components unmount.

Do not allow animations to cause hydration errors, content flicker, or broken scrolling in Next.js.

---

# 4. Section One — Cinematic Loading Screen

Recreate the reference loading screen as closely as possible.

### Layout

A fixed full-screen overlay:

- `fixed inset-0 z-[9999]`
- Background: `bg-bg`
- Full viewport height and width
- Minimal typography
- No conventional spinner

### Content

Top-left label:

`EEE ACADEMY`

Use `text-xs`, muted color, uppercase letters, and `tracking-[0.3em]`.

Animate it from `y: -20` to `y: 0`, with opacity from 0 to 1.

Center:

Cycle through the words:

- `Learn`
- `Prepare`
- `Achieve`

Use Framer Motion `AnimatePresence` with `mode="wait"`.

Text style:

`text-4xl md:text-6xl lg:text-7xl font-display italic`

Transition between words using the same vertical motion as the reference, with approximately 900ms between word changes.

Bottom-right:

Display a large tabular counter from `000` to `100`.

Use a `requestAnimationFrame`-based progress animation taking approximately 2700ms.

Typography:

`text-6xl md:text-8xl lg:text-9xl font-display tabular-nums`

Bottom:

A full-width, 3px progress track using `bg-stroke/50`.

The progress indicator uses `.accent-gradient`, animates using `scaleX`, and has the reference's subtle blue glow.

Once progress reaches 100, wait approximately 400ms before removing the overlay.

The loader should run on the initial website entry rather than replaying on every internal navigation. It must not block the course catalogue or enrollment flow unnecessarily. Respect reduced-motion preferences.

---

# 5. Section Two — Hero and Floating Navigation

## Hero section

Recreate the reference's full-viewport cinematic hero.

Use a full-viewport section with a centered content composition and an immersive background video.

### Background video

Use the reference HLS source only if it is an approved asset for this project:

`https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`

If it is unavailable or not approved for use, use an existing project-approved video with the same visual treatment.

Implementation requirements:

- Use `hls.js` when supported.
- Use native HLS playback when supported by the browser.
- Autoplay, muted, loop, and `playsInline`.
- Absolutely positioned background video.
- `object-cover` and centered positioning.
- Dark overlay using approximately `bg-black/20`.
- Bottom gradient fade: `h-48 bg-gradient-to-t from-bg to-transparent`.
- Preserve the content's readability at all screen sizes.

On mobile, preserve the cinematic appearance while avoiding unnecessary playback overhead. If needed, use an approved static poster image instead of background video, especially on small screens or reduced-data scenarios.

The video must be decorative; it must never prevent the navigation or CTA buttons from working.

## Floating navbar

Create the same floating, horizontally centered pill navbar.

Position:

`fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4`

Inner container:

- `inline-flex items-center`
- `rounded-full`
- `backdrop-blur-md`
- `border border-white/10`
- `bg-surface`
- `px-2 py-2`

When scroll position exceeds 100px, add the reference's subtle shadow.

### Left: Academy logo

Use the project's existing EEE Academy logo if one exists.

If no usable logo exists, build a minimal text-based or monogram placeholder that can later be replaced by the actual logo.

Preserve the reference's circular shape, blue gradient ring, dark inner surface, hover direction reversal, and scale-to-110% hover effect.

Do not invent a new elaborate logo.

### Navigation links

Use:

- Home
- Courses
- Mentors
- Class Demos
- Contact

Styling:

- `text-xs sm:text-sm`
- `rounded-full`
- `px-3 sm:px-4`
- `py-1.5 sm:py-2`

The active section uses `text-text-primary bg-stroke/50`.

Inactive links use `text-muted` and transition to the active style on hover.

Use existing routes and section IDs. The Courses link should navigate to `/courses`; the other links should point to their existing corresponding sections or routes.

Hide decorative dividers on small screens when needed. On mobile, prioritize the brand, course discovery, and enrollment CTA rather than forcing every link into the pill.

### Right: Enrollment CTA

Replace `Say hi` with:

`ভর্তি সম্পর্কে জানুন ↗`

Use the same pill size, backdrop blur, dark surface, animated gradient hover border, and subtle hover feedback as the reference's contact button.

Connect this CTA to the existing course inquiry or enrollment entry point. Do not create a new backend workflow.

---

# 6. Hero Content

Center all hero content above the background video.

Use the same generous spacing, typography scale, vertical rhythm, and entrance animations as the reference.

### Eyebrow

Text:

`DIPLOMA EEE • LEARN WITH CONFIDENCE`

Style:

`text-xs text-muted uppercase tracking-[0.3em] mb-8`

Use the `.blur-in` entrance animation.

### Main heading

Use the actual academy-facing Bengali headline from the PRD:

**পলিটেকনিক EEE পড়াশোনায় প্রস্তুতি হোক আরও গোছানো**

Use an oversized, expressive display style similar to the reference's name reveal.

Desktop typography should be large and editorial, with responsive sizing to prevent overflow on mobile.

Use a serif italic emphasis for selected words only where it improves the composition and supports proper font rendering.

Create the same `.name-reveal` animation with approximately:

- Opacity: 0 to 1
- Y translation: 50 to 0
- Duration: 1.2 seconds
- Ease: `power3.out`

### Rotating study-focus line

Create a short line describing the different study pathways supported by the academy.

Keep the three rotating messages:

- `সেমিস্টার প্রস্তুতি`
- `DUET ভর্তি প্রস্তুতি`
- `চাকরির প্রস্তুতি`

Animate the changing text using the same `role-fade-in` motion, with approximately two seconds between changes.

Use `font-display italic` for the highlighted phrase where appropriate.

### Supporting text

Use the PRD's existing product copy:

`নিজের সেমিস্টারের কোর্স দেখুন, শিক্ষকদের সঙ্গে পরিচিত হন এবং বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন বুঝে নিন।`

Style:

`text-sm md:text-base text-muted max-w-md mb-12`

Center the description with a readable line height and controlled width.

### CTA buttons

Keep the same two-button composition as the reference.

Primary CTA:

`সব কোর্স দেখুন`

- Solid light background
- Dark text
- Rounded pill
- `text-sm px-7 py-3.5`
- Hover switches to a dark treatment with an animated gradient outline
- Routes to `/courses`

Secondary CTA:

`ক্লাস ডেমো দেখুন`

- Dark background
- Border using `border-2 border-stroke`
- Light text
- Rounded pill
- Same sizing as the primary button
- Hover transitions to a gradient outline
- Scrolls to the class demo section

Both buttons should have subtle hover scaling around `1.03–1.05`, matching the reference.

### Entrance animation

Use a GSAP timeline with `power3.out`.

- `.name-reveal`: opacity 0 → 1, y 50 → 0, duration 1.2s, delay 0.1s.
- `.blur-in`: opacity 0 → 1, blur 10px → 0px, y 20 → 0, duration 1s, stagger 0.1, delay 0.3s.

The result should look cinematic, calm, precise, and visually close to the reference.

### Scroll indicator

Bottom-center indicator:

- Label: `SCROLL`
- `text-xs text-muted uppercase tracking-[0.2em]`
- A vertical line with `w-px h-10`
- Animated highlight using `.animate-scroll-down`

Keep the positioning and spacing close to the original design.

---

# 7. Section Three — Featured Courses

Adapt the reference's Selected Works section into a premium featured-course section.

Preserve its layout and visual composition; change the card content, data, and actions.

### Section layout

Use:

`bg-bg py-12 md:py-16`

Inner container:

`max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16`

Animate the header using Framer Motion `whileInView`:

- Opacity: 0 → 1
- Y: 30 → 0
- Duration: 1 second
- Ease: `[0.25, 0.1, 0.25, 1]`
- Viewport: once, with margin `-100px`

### Header

Eyebrow:

A short horizontal line with:

`Featured Courses`

Heading:

`Build your foundation. *Prepare for what’s next.*`

Emphasize the selected phrase using Instrument Serif italic.

Supporting text:

`আপনার সেমিস্টার, DUET ভর্তি প্রস্তুতি অথবা চাকরির প্রস্তুতির জন্য উপযুক্ত কোর্স খুঁজে নিন।`

Desktop-only CTA:

`সব কোর্স দেখুন ↗`

Use the reference's rounded pill and animated gradient hover border.

### Bento course grid

Keep the same bento-grid composition:

`grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6`

Alternate column spans in the reference's order:

`7 / 5 / 5 / 7`

Cards should retain:

- `bg-surface`
- Thin `border-stroke`
- `rounded-3xl`
- Large image areas
- Original aspect-ratio balance
- Hover image scale of approximately 1.05
- Subtle halftone texture
- A translucent dark hover layer with backdrop blur
- Animated gradient outline and pill-shaped interaction label

### Course card content

Render real courses from the existing Supabase-backed public course query.

Course categories:

- Semester courses
- DUET admission preparation
- Job preparation

Each card should display available information from the actual course record:

- Course title
- Course category
- Semester, where relevant
- Current fee
- Original price only when a valid discount exists
- Short description or key features
- Admission availability
- A clear course CTA

Show a price discount only when the database data supports it.

Use the project's existing course images when available. Do not invent instructor photos, course artwork, testimonials, or results. If no suitable image exists, use an elegant dark visual treatment that preserves the card design.

On hover, show a translucent overlay with a pill such as:

`View Course — *Course Title* ↗`

The course title can use the display serif.

### Functional rules

- Respect the existing course schema and public read permissions.
- Display only public, active courses allowed by the current backend.
- Clearly distinguish open and closed admissions.
- A course with closed admission must not accept a new inquiry.
- Use the existing course details route if one exists. Otherwise, inspect the project and implement a compatible course detail route without breaking existing route behavior.
- If no courses exist, show a properly designed empty state rather than fabricated cards.

The resulting section should resemble the original portfolio's bento grid, not a standard LMS catalogue.

---

# 8. Section Four — Mentors

Create a mentor section using the same dark editorial visual language.

This section adapts the people-focused content to the academy without introducing a conventional corporate team-page layout.

### Header

Eyebrow:

`MEET YOUR MENTORS`

Heading:

`Learn with *guidance.*`

Supporting text:

`শিক্ষকদের পরিচিতি ও বিষয়ভিত্তিক দক্ষতা দেখে আপনার শেখার যাত্রা শুরু করুন।`

### Mentor cards

Use a refined responsive card layout that complements the course bento grid.

Keep:

- The same dark surface
- Thin subtle borders
- Rounded corners
- Large portrait areas where available
- A muted information hierarchy
- Serif italic emphasis
- Subtle image scaling and reveal animations

Each profile can display the actual available data:

- Teacher name
- Verified qualifications or affiliation
- Subject expertise
- Short biography
- Optional photograph

Use the actual published teacher records from the backend. Preserve the existing `is_published` behavior.

Do not invent qualifications, institutional affiliations, years of experience, or teacher rankings.

When no published profiles exist, render an intentional empty state without fake profile data.

Keep motion subtle enough that names, qualifications, and biographies remain easy to read.

---

# 9. Section Five — Class Demos / Recent Learning

Adapt the reference's horizontal Journal entries into a premium Class Demos section.

Keep the original design's horizontal pill-like rows, compact typography, thumbnails, border treatments, and hover states.

### Section layout

Use:

`bg-bg py-16 md:py-24`

Apply the same editorial section header pattern.

Eyebrow:

`WATCH A CLASS`

Heading:

`See how we *teach.*`

Supporting text:

`বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন ও আলোচনার বিষয় সম্পর্কে ধারণা নিন।`

Desktop CTA:

`সব ক্লাস ডেমো দেখুন ↗`

### Horizontal demo entries

Each entry uses the reference's horizontal pill appearance:

- `rounded-[40px] sm:rounded-full`
- `flex items-center gap-6`
- `p-4`
- `bg-surface/30`
- `hover:bg-surface`
- `border border-stroke`

Each row can contain:

- Thumbnail
- Demo title
- Topic
- Associated published teacher, if available
- A clear watch or open action

Use real demo information from the existing `class_demos` records.

Where Facebook embedding is supported and permitted, maintain the existing video integration. Validate supported URLs and providers. If embedding fails, show a clear external-view link or elegant fallback card.

Do not invent video durations, publication dates, view counts, or other fields absent from the data.

Make the whole actionable row usable with a keyboard and screen reader. Use an appropriate video lightbox or external navigation consistent with the existing implementation.

---

# 10. Section Six — Enrollment Experience / Parallax

Adapt the reference's Explorations section into a visually rich explanation of the academy's enrollment journey.

Keep the defining visual structure:

- Tall scrolling section
- Centered pinned content
- Layered parallax image columns
- Carefully controlled rotations
- Scroll-linked movement
- Optional lightbox behavior where meaningful

Use a restrained visual presentation. The effect should support the enrollment explanation rather than interfere with it.

### Section dimensions

Use a tall section similar to:

`min-h-[300vh]`

Use GSAP ScrollTrigger for pinning and parallax, with responsive behavior on smaller screens.

### Pinned center content

A full-screen centered block with:

Eyebrow:

`YOUR LEARNING JOURNEY`

Heading:

`A clearer path to *your next step.*`

Supporting text:

`কোর্স নির্বাচন থেকে ভর্তি নিশ্চিত করা পর্যন্ত প্রতিটি ধাপ সহজভাবে বুঝে নিন।`

CTA:

`কোর্স বেছে নিন ↗`

The CTA opens `/courses`.

Preserve the original typography, large negative space, and subtle entrance motion.

### Parallax columns

Create two offset image columns inside a centered container:

`max-w-[1400px]`

Use approximately:

`grid grid-cols-2 gap-12 md:gap-40`

Cards can retain:

- Square aspect ratios
- Maximum width around 320px
- Subtle individual rotations
- Scroll-driven movement
- Rounded corners
- Soft image overlays

Use only existing project-approved imagery or real course/demo thumbnails. A decorative card should never be mistaken for an actual course or teacher record.

### Enrollment steps

Use the following process, consistent with the PRD:

**01 — Choose a course**

Browse the catalogue and select an available course.

**02 — Submit your details**

Complete the course inquiry form with the required student information.

**03 — Contact the academy**

After the inquiry is saved successfully, open the prepared WhatsApp message and send it manually.

**04 — Complete enrollment**

Receive payment instructions, pay through the academy's configured manual payment method, and wait for admin verification and enrollment confirmation.

The admin manually adds the confirmed student to the appropriate private Facebook group.

Do not suggest that payment, enrollment, or group membership occurs automatically.

On mobile, use a simpler stacked composition if necessary rather than forcing large parallax movements.

---

# 11. Section Seven — Learning Pathways

Replace the portfolio statistics with a three-column section that preserves the original oversized typography and balanced editorial layout.

Use:

`bg-bg py-16 md:py-24`

### Three-column layout

`grid grid-cols-1 md:grid-cols-3`

Each item should resemble a large typographic stat block but communicate an actual learning pathway.

**01 — Semester Courses**

Structured support for relevant Diploma semester and board examinations.

**02 — DUET Admission**

Preparation for candidates pursuing DUET admission.

**03 — Job Preparation**

Preparation pathways for government and private job examinations.

Use oversized typographic numbers, Instrument Serif italic emphasis, thin dividers, muted supporting copy, and subtle entrance animations.

Do not use fabricated statistics such as years of experience, student counts, success rates, satisfaction percentages, or project totals.

If the academy later supplies verified numerical statistics, they can be integrated without changing the overall design system.

The presentation must remain visually similar to the reference's Stats section, but the content must be true to the academy.

---

# 12. Section Eight — FAQ

Create a compact editorial FAQ section before the final contact/footer section.

The design should remain within the existing dark visual system rather than introducing bright cards or a generic accordion template.

### Header

Eyebrow:

`COMMON QUESTIONS`

Heading:

`Before you *begin.*`

Use thin separators, muted supporting text, refined spacing, and smooth expand/collapse motion.

FAQ entries should use verified information and match the actual enrollment process.

Suitable topics include:

- How do I choose a course?
- Do I need to create a student account?
- How do I contact the academy after submitting an inquiry?
- Which payment methods does the academy support?
- How is payment verified?
- When will I be added to the course's private Facebook group?

Use existing project content and configured payment instructions. Do not invent amounts, deadlines, refund policies, or guarantees.

The FAQ accordion must be keyboard accessible and respect reduced-motion preferences.

---

# 13. Section Nine — Contact and Footer

Recreate the reference's cinematic ending with a dark background, a layered media treatment, an oversized animated marquee, and a minimal footer.

### Section styling

Use:

`bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden`

Use an approved background video or a matching project image. Preserve the reference's inverted background composition where appropriate, with an overlay around `bg-black/60`.

Ensure the background treatment does not reduce readability or impact mobile performance.

### Animated marquee

Use GSAP to animate an oversized repeating message:

`LEARN • PREPARE • BUILD YOUR FUTURE •`

Repeat the text enough times to create an uninterrupted horizontal loop.

Animate using:

- `xPercent: -50`
- Duration: approximately 40 seconds
- Ease: `none`
- Repeat: `-1`

Keep the typography oversized, expressive, and editorial.

The animation must not interfere with page scrolling or cause horizontal overflow.

### Contact CTA

Use a prominent pill-shaped CTA:

`ভর্তি সম্পর্কে জানতে যোগাযোগ করুন ↗`

Connect it to the academy's existing official WhatsApp or contact entry point.

The destination must come from the existing safe public settings configuration, not a hard-coded invented number or email.

Keep the animated gradient hover outline and subtle scale effect.

### Footer navigation

Include appropriate links to:

- Home
- Courses
- Mentors
- Class Demos
- Contact
- Privacy Policy
- Terms of Service

Use the existing verified public social links when available.

Display the academy's real contact details and address when configured. Do not invent social profiles, email addresses, phone numbers, or locations.

Avoid displaying portfolio-specific links such as Dribbble or GitHub unless the academy actually uses them.

Do not display a green "Available for projects" indicator. Replace it with a suitable academy label only if the underlying message is accurate.

Keep the footer minimal, premium, and consistent with the reference.

---

# 14. Courses Page — `/courses`

The main course directory must reuse the same global design system, fonts, color palette, borders, rounded geometry, motion, and typography.

Do not make this page look like a different website.

### Page header

Use a dark editorial hero with an eyebrow, a large serif heading, concise supporting text, and generous spacing.

Suggested heading:

`Find the course for your *next step.*`

Include a visible route back to the homepage and a clear way to begin a course inquiry.

### Course discovery

Reuse the actual database-driven public course listing.

Support the existing PRD's course types and relevant semester filters:

- Semester courses
- DUET admission preparation
- Job preparation

Each course card should retain the visual system established in the homepage's bento grid, adapted to the directory's responsive layout.

Display available course data:

- Title
- Category
- Department or semester where applicable
- Description
- Current price
- Original price only when a valid discount exists
- Relevant features
- Duration and delivery format when available
- Admission state
- A clear details or inquiry action

Keep filtering and selection functional. A visual redesign must not turn the filters into decorative controls.

Display closed admission clearly and prevent new inquiries for those courses.

Provide designed loading, empty, error, and retry states. Do not render fictitious course cards when data is unavailable.

---

# 15. Course Details and Inquiry UX

Use the existing course detail route if available. Preserve established routing and query behavior.

The course detail screen should feel like the same cinematic, editorial brand while prioritizing accurate course information and enrollment conversion.

### Course details

Display the available course description, syllabus/topics, features, duration, delivery format, teacher associations, and fees from the existing data model.

Use the database's current fee as the source of truth.

A valid admission CTA must open the existing inquiry flow or its equivalent.

### Inquiry form

Style the existing form or modal using the same dark surface, thin borders, rounded controls, clear labels, subtle focus states, and elegant transitions.

Required fields:

- Student full name
- Polytechnic/institute name
- Polytechnic roll number
- Department
- Semester or current study level where relevant
- Contact phone
- WhatsApp number, including a "same as phone" option
- Selected course

Email address is optional.

Show selected course information and the current course fee as read-only information. The backend must independently fetch the course and fee.

### Form interaction

- Preserve the actual server-side validation and submission behavior.
- Normalize valid Bangladeshi phone formats according to the existing requirements.
- Disable repeated submission while a request is in flight.
- Preserve form values if submission fails.
- Display field-level errors clearly.
- Provide distinct loading, saved, and failed states.
- Do not claim an inquiry was saved before the database confirms success.
- Open the prepared WhatsApp message only after the server confirms the lead was saved.
- The visitor must send the WhatsApp message manually.
- If WhatsApp cannot open, offer a retry link and copy-message fallback.
- Never claim payment or enrollment was confirmed just because the inquiry was saved or WhatsApp opened.
- Never expose private Facebook group links in public UI responses.

Use the existing idempotency and anti-spam implementation. Do not weaken those protections to simplify the UI.

The form should look premium but remain easy to complete on a phone.

---

# 16. Admin Dashboard — Existing Routes and Functionality

Restyle the existing administration interfaces using the same visual identity while prioritizing usability over cinematic effects.

The admin interface should feel like the operational counterpart to the public website: dark surfaces, restrained blue accents, elegant headings, subtle borders, and consistent typography.

Unlike the public homepage, the dashboard should emphasize information density, keyboard usability, and clear operational states.

Preserve existing routes and actual backend behavior. Use the PRD's required routes where already implemented:

- `/admin` — Overview
- `/admin/leads` — Lead management
- `/admin/courses` — Course management
- `/admin/teachers` — Teacher management
- `/admin/demos` — Class demo management
- `/admin/settings` — Public site settings

Inspect the repository before introducing or renaming any route.

### Dashboard overview

Render real database-derived information for:

- New or pending leads
- Contacted leads
- Payment states
- Active enrollments
- Recent activity

Do not hard-code dashboard counts or use fabricated activity records.

Use concise metric cards with the same border treatment and subtle hover effects. Avoid the homepage's parallax and heavy decorative animation inside operational tables.

### Lead management

Preserve the existing lead-management capabilities:

- Search and filtering
- Student details
- Course association
- Lead status
- Payment status
- Enrollment status
- Group access status
- Admin notes
- Call and WhatsApp actions
- Duplicate flags
- Payment and enrollment history

Make the distinct status categories visually clear. Do not combine them into one ambiguous dropdown.

Use subtle status indicators with readable labels and accessible contrast.

### Course management

Maintain working create, edit, reorder, publish/unpublish, fee, and admission controls.

Use well-structured forms, usable tables, confirmation dialogs where appropriate, and clear save/error feedback.

Prefer archival or deactivation over destructive deletion in keeping with the PRD.

### Teacher and demo management

Provide functional forms and lists for published profiles and class demos, using existing data fields and backend integrations.

Do not display unsaved changes as published content.

### Settings

Use a clean grouped settings screen for public contact details, social links, payment instructions, and other existing configurable content.

Keep private Facebook group URLs out of publicly readable responses and public settings UI.

### Admin security

The frontend must not be the security boundary.

Keep existing Supabase Auth, server-side active-role checks, authorization rules, RLS, and protected server actions intact.

An authenticated non-admin must continue to receive an access-denied state.

Never allow frontend visibility, hidden buttons, or client-side role checks to substitute for server-side authorization.

---

# 17. Responsive Design and Performance

Preserve the reference's visual character on mobile rather than simply shrinking its desktop layout.

### Desktop

- Full-viewport cinematic hero
- Floating pill navbar
- Oversized editorial typography
- Full bento-grid arrangement
- Horizontal demo rows
- Full parallax experience
- Large footer marquee

### Tablet

- Reduce heading sizes and grid gaps
- Preserve the bento-grid composition where space allows
- Simplify layered animations where they become visually crowded

### Mobile

- Maintain the dark aesthetic and gradient accents
- Use a compact responsive navbar
- Avoid overflowing navigation links
- Keep hero text readable and CTA buttons easy to tap
- Switch course cards to a single-column layout where appropriate
- Stack mentor content and enrollment steps
- Replace heavy background video with an approved poster image when needed
- Avoid expensive parallax effects and unnecessary animation work
- Ensure all dialogs, forms, filters, and navigation are usable
- Prevent accidental horizontal page scrolling

Use optimized image sizes, modern formats where supported, lazy-load below-the-fold media, and avoid loading heavy videos unnecessarily.

Maintain the reference's smooth feel without sacrificing core web vitals or interaction responsiveness.

---

# 18. SEO, Accessibility, and UX States

Preserve the existing Next.js metadata conventions and ensure the redesign supports:

- Unique page titles and meta descriptions
- Open Graph metadata
- Appropriate canonical URLs
- Semantic HTML
- Keyboard-operable navigation and controls
- Visible focus indicators
- Accessible form labels
- Screen-reader-accessible success and error feedback
- Appropriate modal focus handling
- Reduced-motion preferences
- Readable contrast
- Useful loading, empty, success, and error states

Do not index admin routes or private content.

Do not place student phone numbers, roll numbers, private payment data, internal IDs, or group access links in public URLs or public metadata.

Avoid relying on animation alone to communicate a state.

---

# 19. Implementation Guidelines

Before implementation:

1. Read `PRD.md` and inspect the current project.
2. Identify existing routes, components, assets, Supabase queries, server actions, admin workflows, and working functionality.
3. Reuse existing components and integrations wherever practical.
4. Identify which parts are purely visual and which parts are connected to real database or server behavior.
5. Build a clear design system that can be shared across public pages and the admin interface.

During implementation:

- Use the existing Next.js App Router.
- Keep server components for appropriate server-side data access.
- Use client components only where interactivity, browser APIs, animation, or local state requires them.
- Keep privileged credentials and operations server-side.
- Preserve all existing working functions.
- Use reusable components for buttons, pills, section headings, course cards, modals, form controls, and status labels.
- Prefer CSS transitions for simple hover effects and reserve GSAP/Framer Motion for meaningful animations.
- Use `next/image` appropriately for local and supported remote images, with configuration that matches existing project needs.
- Keep animation components isolated so that GSAP and browser-only functionality do not break server rendering.
- Handle HLS initialization and cleanup correctly if HLS is used.
- Do not add unnecessary dependencies when an existing package or component already solves the problem.
- Never replace real database content with hard-coded demonstration content.
- Do not modify database policies, schemas, authentication, or server authorization to make frontend work easier.

After implementation:

- Test the public homepage and `/courses`.
- Verify course cards and filters use real data.
- Verify closed courses cannot accept inquiries.
- Test all inquiry form validation and failure states.
- Confirm that WhatsApp only opens after a successful database save.
- Verify existing admin pages and privileged actions still work.
- Check responsive layouts at mobile, tablet, and desktop sizes.
- Check reduced-motion behavior, keyboard navigation, focus states, and animation cleanup.
- Verify there are no hydration errors, broken routes, console errors, or horizontal overflow.
- Run the available lint, type-check, and build commands.
- Fix regressions caused by the redesign.

Do not claim a requirement is complete if it has not been verified.

---

# Final Design Acceptance Criteria

The redesign is successful only when all of the following are true:

1. **Visual fidelity:** The website retains the original reference's dark premium portfolio aesthetic, floating pill navigation, serif display typography, blue gradient accents, cinematic hero, rounded bento cards, refined hover effects, and animated footer.

2. **Animation fidelity:** The loader, hero reveal, rotating text, scroll indicators, section entrances, parallax interactions, and marquee preserve the same visual language and comparable timing.

3. **EEE Academy identity:** Portfolio-specific labels, project cards, journal content, personal contact details, and portfolio statistics are replaced with relevant academy content.

4. **Functional integrity:** Existing Next.js routes, Supabase integration, server actions, authentication, RLS policies, inquiry handling, payment/enrollment states, and admin operations remain intact.

5. **Data integrity:** All displayed course fees, admission statuses, teacher information, class demos, contact details, and operational counts come from verified data sources. No fake production content is introduced.

6. **Secure enrollment:** A successful database save precedes the WhatsApp handoff. Payment verification, enrollment activation, and Facebook group access remain separate, explicit admin-controlled actions.

7. **Responsive performance:** The same design language works across desktop, tablet, and mobile without broken layouts, excessive video overhead, or inaccessible interactions.

8. **Consistent experience:** The homepage, courses directory, inquiry UI, and administration screens belong to one coherent design system, with animation intensity adjusted to each screen's purpose.

**The central instruction is simple: preserve the original design; adapt the content and interactions to EEE Academy; protect all existing backend behavior. Do not turn this into a generic educational website or rewrite the application from scratch.**
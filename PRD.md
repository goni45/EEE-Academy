# EEE Academy --- Product Requirements Document (PRD)

**Version:** 1.0\
**Updated:** 21 October 2026\
**Status:** Final planning baseline --- ready for implementation\
**Project:** EEE Academy Web Platform\
**Infrastructure target:** Free tiers where practical. Verify provider
limits before launch.

## 1. Purpose and final MVP decisions

EEE Academy serves Diploma in Electrical and Electronics Engineering
(EEE) students in Bangladesh. The website presents courses, instructors,
class demonstrations, contact information, and a simple course
inquiry/enrollment workflow.

### Final MVP decisions

-   **No student login or student account system in the MVP.**
-   Students submit a course form. The server saves the inquiry and
    prepares a pre-filled WhatsApp message.
-   The student must send the WhatsApp message manually. Opening
    WhatsApp does not prove the message was sent.
-   Payments use manual bKash/Nagad instructions and admin verification.
    No payment gateway is included.
-   Admin manually adds students to the relevant private Facebook group
    after payment verification and enrollment confirmation.
-   Admin panel uses Supabase Auth and explicit server-side
    authorization. Being signed in does not automatically make someone
    an admin.
-   Private Facebook group URLs must never appear in publicly readable
    course records.
-   Public content and private student contact data must have separate
    access rules.
-   The website must not claim an inquiry succeeded unless the database
    confirms the lead was saved.

### Out of scope for MVP

Student login/accounts, automatic student account creation, password
reset, automated payment gateway/confirmation, automatic Facebook group
membership, custom video hosting, LMS, student progress tracking,
quizzes, certificates, and cart-based online payment.

These features can be considered after the basic inquiry-to-enrollment
process works reliably.

## 2. Product goals and audience

### Goals

1.  Help students understand available semester courses, DUET admission
    preparation, and job-preparation programs.
2.  Build trust through accurate teacher profiles, real class demos,
    transparent course information, and clear enrollment instructions.
3.  Let visitors submit an inquiry without creating an account.
4.  Save inquiries reliably and manage them through a protected admin
    panel.
5.  Keep payment verification and Facebook group access under human
    control.
6.  Allow authorized staff to update courses, fees, teachers, demos, and
    contact settings without code changes.
7.  Protect student contact information and admin actions.
8.  Keep the first release small enough to build and maintain on a
    limited budget.

### Audience

-   **Semester students:** Seeking support for relevant Diploma semester
    and board examinations.
-   **DUET admission candidates:** Preparing for DUET admission.
-   **Job candidates:** Preparing for government/private job
    examinations.
-   **Academy admins:** Managing courses, leads, payments, enrollment,
    and content.

Do not publish claims such as "100% success," guaranteed GPA, or "best
teachers" without evidence. Verify teacher qualifications and
affiliations before publication.

## 3. Technology and architecture

### Stack

-   Next.js App Router and TypeScript
-   Tailwind CSS and Lucide icons
-   Supabase PostgreSQL
-   Supabase Auth for admin login only
-   PostgreSQL Row Level Security (RLS) and server-side authorization
-   Vercel hosting
-   WhatsApp Click-to-Chat (`https://wa.me/`)
-   Public/embeddable Facebook videos where embedding is allowed
-   Private Facebook groups managed manually by EEE Academy

Use supported package versions at implementation time. Verify current
Supabase/Vercel limits rather than promising unlimited capacity or zero
downtime.

### Request architecture

``` text
Public visitor
  -> Next.js public pages
  -> Read active public courses, published teachers/demos, safe public settings

Course inquiry form
  -> Next.js server action / route handler
  -> Validate and normalize submitted fields
  -> Fetch course and current fee from database
  -> Check admission status
  -> Apply spam and duplicate-submit controls
  -> Save lead using server-only privileged credentials
  -> Confirm database success to browser
  -> Open pre-filled WhatsApp message for the visitor to send manually

Admin
  -> Supabase Auth session
  -> Server-side active-role check + RLS
  -> Manage leads, courses, teachers, demos, settings, payment/enrollment states
```

### Server-side security rules

-   The Supabase publishable/anon key is not a secret, but RLS must
    restrict data access.
-   Supabase `service_role`/secret key is server-only. Never put it in
    client bundles, public environment variables, URLs, browser
    responses, or logs.
-   Public form submissions pass through a server handler. Do not grant
    unrestricted anonymous `INSERT` access to private lead tables.
-   Validate every submitted value on the server.
-   The server fetches course, price, and admission status from the
    database. Never trust price, course title, status, or admin role
    supplied by the browser.
-   Protect admin routes in the UI and every server action/API. Hiding
    buttons is not authorization.
-   Enable RLS on all tables exposed through the Supabase API.
-   Keep private columns/tables out of public queries.

## 4. Public pages and experience

### Navigation

-   Home (`/`)
-   Courses (`/courses`)
-   Mentors (`#mentors`)
-   Class demos (`#demos`)
-   Contact (`#contact`)
-   Direct call and WhatsApp actions

### Homepage (`/`)

Recommended section order:

1.  Hero with clear value proposition and CTAs
2.  Semester/course selector
3.  Featured courses
4.  Teacher/mentor profiles
5.  Real class demo videos
6.  How enrollment works
7.  FAQ
8.  Location, contact, footer

Suggested headline: **"পলিটেকনিক EEE পড়াশোনায় প্রস্তুতি হোক আরও গোছানো"**

Supporting text: "নিজের সেমিস্টারের কোর্স দেখুন, শিক্ষকদের সঙ্গে পরিচিত হন
এবং বাস্তব ক্লাস ডেমো দেখে পড়ানোর ধরন বুঝে নিন।"

Primary CTA: **সব কোর্স দেখুন**\
Secondary CTA: **ক্লাস ডেমো দেখুন**

Do not display unverified trust badges or fabricated results.

### Course directory (`/courses`)

-   Show active courses whose admission is open.
-   Filter by course type and semester.
-   Each card shows title, category/semester, current fee, original fee
    if a valid discount exists, key features, and Buy Now.
-   Closed courses may be displayed as closed but must not accept new
    inquiries.
-   Deactivated courses remain available to admins for historical
    records.

### Course details

Course records support title, unique slug, description, category,
department, optional semester, current fee, optional original fee,
syllabus/topics, duration, delivery format, learning outcomes/features,
related teachers, admission state, visibility, and display order.

### Teachers and class demos

Teacher profiles include name, verified qualifications/affiliation,
subject expertise, short bio, optional photo, display order, and
publication status.

Class demos include title, topic, teacher, description, thumbnail, video
URL, display order, and publication status. Admins manage both. If a
Facebook embed fails, show a clear external-view link or fallback card.
Validate video URL schemes/providers and do not render arbitrary
unsanitized HTML.

## 5. Course inquiry form and WhatsApp workflow

### Form fields

Required:

-   Student full name
-   Polytechnic/institute name
-   Polytechnic roll number
-   Department
-   Semester or current study level, where relevant
-   Contact phone
-   WhatsApp number, with "same as phone" option
-   Selected course

Optional: email address.

Course title, ID, category/semester, and price are populated from the
selected course and treated as read-only in the UI. The server
independently looks up the course and fee.

Normalize valid Bangladeshi phone formats such as local `01XXXXXXXXX`
and country-code `+8801XXXXXXXXX` to a consistent stored format. Do not
reject valid numbers solely because they contain spaces or hyphens. Do
not collect passwords, NID, payment-card details, or unrelated sensitive
data.

### Submission sequence

1.  On click, synchronously attempt to open a blank tab/window before
    async work so browsers are less likely to block later WhatsApp
    navigation.
2.  Set loading state and disable repeated clicks.
3.  Send form data to a Next.js server action or route handler.
4.  Server validates/normalizes fields, applies anti-spam controls,
    fetches current course/price, and confirms the course is active and
    admission is open.
5.  Generate an idempotency key or equivalent duplicate-submit guard.
6.  Save the inquiry to `course_leads`.
7.  Only after database confirmation, return the saved lead ID and
    server-confirmed course details.
8.  Build a WhatsApp Click-to-Chat URL using the configured official
    number and URL-encoded message.
9.  Navigate the pre-opened tab to WhatsApp. If blocked, show a visible
    retry link and copy-message fallback.
10. Show an accurate confirmation: the request is saved and the visitor
    must send the WhatsApp message manually.
11. If saving fails, do not show success. Preserve the form values and
    offer retry.

A database insert does not prove a WhatsApp message was sent. Opening
WhatsApp does not prove a message was sent. A saved inquiry is not a
confirmed payment or completed enrollment.

### WhatsApp message

Include greeting, course title/category/semester, server-confirmed fee,
student name, Polytechnic, roll, department, semester, phone, WhatsApp,
optional email, and a request for payment instructions/next steps.

Normalize the destination to international digits without `+` for
`wa.me`. Encode the full message with a standard URL-encoding function.
Never include private Facebook group links before payment verification.

### Duplicate and abuse controls

-   Disable submit while a request is in flight.
-   Use a unique idempotency key and database constraint so retries do
    not duplicate the same submission.
-   Flag likely duplicates using normalized phone, institute, roll, and
    course. Do not globally restrict a student to one course or one
    lifetime inquiry.
-   If a likely duplicate exists, reuse the pending lead or flag it for
    admin review according to the implemented policy.
-   Add server-side rate limiting through a suitable
    service/database-backed approach plus a honeypot. Client-only
    throttling is insufficient.
-   Avoid unnecessary logging of full form payloads.
-   Do not expose SQL errors, stack traces, secrets, or internal IDs in
    public error messages.

## 6. Admin dashboard

### Authentication and authorization

-   Use Supabase Auth for admin login.
-   Provision admin accounts through an authorized owner/super-admin. No
    public admin signup.
-   Identify admins by `auth.uid()` matching a row in `admin_users`, not
    by comparing a typed email alone.
-   Every server action/API verifies the current session and active role
    before privileged operations.
-   RLS policies restrict private data to authorized roles.
-   Signed-in non-admin users receive an access-denied state.
-   Handle expired sessions and authorization lookup errors without
    exposing data or leaving an infinite loading state.

### Overview

Show database-derived counts for new/pending leads, contacted leads,
payment states, active enrollments, and recent activity. Never hard-code
sample counts in production.

### Lead management (`/admin/leads`)

Display submission date/time, student name, Polytechnic, roll,
department/semester, course, phone, WhatsApp, optional email,
lead/payment/enrollment status, and internal notes.

Actions: search/filter leads, open WhatsApp chat, call student, update
lead status, add notes, view payment/enrollment history, and flag likely
duplicate submissions.

### Course management (`/admin/courses`)

Create/edit/reorder/publish/unpublish courses, update fees and course
details, and open/close admission. Prefer archive/deactivate over hard
deletion. Historical leads preserve the original course title and fee
snapshot even after a course is renamed or archived.

### Teacher management (`/admin/teachers`)

Add/edit teacher profile, qualifications, verified affiliation,
expertise, bio, photo URL, display order, and publication state.

### Class demo management (`/admin/demos`)

Add/edit demo title, topic, teacher, description, video URL, thumbnail,
display order, and publication state.

### Site settings (`/admin/settings`)

Manage official WhatsApp number, helpline, support email, address, map
configuration, public Facebook/social links, bKash/Nagad instructions
and receiving numbers, and other public contact details.

Only public contact settings should be anonymously readable. Keep
private Facebook group URLs out of the public settings response.

### Payment and enrollment handling

For the MVP, payment status can be stored on the lead record or in a
separate `payments` table. A separate table is recommended if storing
transaction IDs, multiple attempts, sender numbers, reviewer, timestamp,
and rejection reason. Preserve payment-attempt history rather than
overwriting prior attempts.

Admin actions must distinguish:

-   Lead contacted
-   Payment instructions provided
-   Transaction details submitted
-   Payment verified/rejected
-   Enrollment activated/cancelled
-   Student manually added to Facebook group
-   Group access removed

Payment verification does not automatically mean the student has been
added to the group. Track group addition separately.

## 7. Database design

Use UUID primary keys where appropriate, foreign keys, timestamps,
indexes, constraints, and controlled status values. Store schema changes
as version-controlled SQL migrations.

### `site_settings`

Purpose: public contact details and operational configuration.

Suggested fields: `id` (single-row primary key), `whatsapp_number`,
`helpline_number`, `support_email`, `location_address`, `map_url` or
safe embed configuration, `facebook_page_url`, `bkash_instructions`,
`nagad_instructions`, `updated_at`, `updated_by`.

Do not store private/secret Facebook course group links in publicly
readable settings. Separate fields with different access needs into
distinct tables or apply column-safe public queries. Do not return the
full settings row anonymously if it contains admin-only fields.

### `courses`

Suggested fields:

-   `id` UUID primary key
-   `title` required
-   `slug` unique and required
-   `description`
-   `department`
-   `category` (`semester`, `duet_admission`, `job_prep`)
-   `semester` nullable
-   `regular_price` numeric, non-negative
-   `discount_price` nullable, non-negative, and no greater than regular
    price
-   `features` text array or normalized related table
-   `syllabus` JSONB or normalized related table
-   `duration`
-   `delivery_format`
-   `is_active`
-   `admission_open`
-   `order_index`
-   `created_at`
-   `updated_at`

The server derives the actual course fee from this record.

### `course_leads`

Purpose: inquiry submissions and operational status.

Suggested fields:

-   `id` UUID primary key
-   `course_id` nullable FK to `courses`
-   `course_title_snapshot` required
-   `course_price_snapshot` required
-   `student_name` required
-   `polytechnic` required
-   `polytechnic_roll` required where applicable
-   `department` required
-   `semester` nullable
-   `phone` required and normalized
-   `whatsapp_number` required and normalized
-   `email` nullable
-   `lead_status` (`pending`, `contacted`, `closed`, `cancelled`)
-   `payment_status` (`not_submitted`, `submitted`, `verified`,
    `rejected`)
-   `enrollment_status` (`not_enrolled`, `pending`, `active`,
    `completed`, `cancelled`)
-   `group_access_status` (`not_added`, `added`, `removed`)
-   `admin_notes` nullable
-   `idempotency_key` unique per submission request
-   `created_at`, `updated_at`
-   `last_contacted_at` nullable
-   `enrolled_at` nullable

Snapshots preserve the original inquiry when a course is renamed or
archived. The course FK may be nullable for historical retention; avoid
deleting courses where possible.

Use PostgreSQL enums or `CHECK` constraints rather than arbitrary
free-text status strings.

### `payments` (recommended if tracking transaction attempts)

Suggested fields: `id`, `lead_id` FK, `method` (`bkash`, `nagad`,
`other_manual`), positive `amount`, nullable
`transaction_id_normalized`, nullable `sender_phone`, nullable
`proof_storage_path`, `status` (`submitted`, `verified`, `rejected`),
nullable `reviewed_by`, nullable `reviewed_at`, nullable
`rejection_reason`, `created_at`.

Normalize transaction references and prevent the same reference from
being accepted for multiple successful payments. Do not apply a global
unique constraint to empty/missing values. Validate duplicates
server-side and enforce an appropriate unique index for non-empty
normalized references where suitable.

Payment screenshots, if accepted, belong in a private storage bucket
with strict access control. Do not use public storage URLs for sensitive
proof.

### `teachers`

Suggested fields: `id`, `name`, `qualifications`,
`institution_or_batch`, `expertise`, `bio`, `photo_url`,
`display_order`, `is_published`, `created_at`, `updated_at`.

Publish verified claims only.

### `class_demos`

Suggested fields: `id`, `title`, `topic`, `description`, nullable
`teacher_id` FK, `video_url`, nullable `thumbnail_url`, `display_order`,
`is_published`, `created_at`, `updated_at`.

Validate URL schemes and allowed video providers. Do not render
arbitrary unsanitized HTML from the database.

### `admin_users`

Suggested fields: `user_id` UUID primary key referencing
`auth.users.id`, `role` (`super_admin`, `course_manager`,
`payment_verifier`), `is_active`, `created_at`, `created_by`.

Suggested roles:

-   `super_admin`: all administrative operations, settings, role
    management, audit access.
-   `course_manager`: course, teacher, and demo management; limited lead
    viewing as required.
-   `payment_verifier`: payment review and authorized payment/enrollment
    actions, but no role management.

Keep roles simple. Even if one trusted admin operates the MVP, create an
explicit `super_admin` record and enforce server-side authorization.

### `audit_logs`

Suggested fields: `id`, `actor_user_id`, `action`, `entity_type`,
`entity_id`, `safe_metadata` JSONB, `created_at`.

Log payment verification/rejection, enrollment status changes, group
access changes, course fee changes, settings updates, and admin role
changes. Do not log passwords, tokens, secret keys, or unnecessary
personal data.

### `course_private_access`

Suggested fields: `course_id` primary/FK, `facebook_group_url`,
`access_instructions`, `updated_at`, `updated_by`.

No anonymous/public policy. Only authorized admin server operations may
read/change these records. The MVP does not expose these URLs to
students through the website because admins add students manually.

### Relationships, indexes, and retention

-   `course_leads.course_id` references `courses.id`.
-   `payments.lead_id` references `course_leads.id`.
-   `class_demos.teacher_id` references `teachers.id`.
-   `course_private_access.course_id` references `courses.id`.
-   Index admin filters such as `created_at`, `lead_status`,
    `payment_status`, `enrollment_status`, and `course_id`.
-   Enforce valid status values and price ranges in the database.
-   Avoid deleting leads or payment history as a routine admin action.
-   Define a reasonable retention policy for contact information and
    delete it when no longer needed, subject to legitimate
    business/legal requirements.

## 8. RLS and authorization matrix

RLS is mandatory on every table exposed through the Supabase API.
Implement and test exact policies, not only the policy descriptions.

  -----------------------------------------------------------------------------------
  Data/table                Anonymous visitor    Authenticated     Authorized admin
                                                 non-admin         
  ------------------------- -------------------- ----------------- ------------------
  Active public courses     Read public fields   Same public read  Role-based
                            only                                   read/write

  Published teachers/demos  Read published       Same public read  Role-based
                            records                                read/write

  Public site settings      Read safe public     Same              Role-based edit
                            fields                                 

  `course_leads`            No direct            No access         Authorized roles
                            read/insert/update                     only

  `payments`                No access            No access         Payment
                                                                   verifier/super
                                                                   admin as
                                                                   authorized

  `admin_users`             No access            No access         Super admin
                                                                   manages roles;
                                                                   minimal role check
                                                                   for authorization

  `audit_logs`              No access            No access         Super
                                                                   admin/authorized
                                                                   auditor

  `course_private_access`   No access            No access         Authorized admin
                                                                   only
  -----------------------------------------------------------------------------------

### Required policy logic

-   Public course read requires `is_active = true` and returns only
    non-secret columns.
-   Public teacher/demo reads require `is_published = true`.
-   Anonymous users receive no direct access to private leads, payment
    records, admin records, audit logs, or private group links.
-   Lead creation is performed by a validated server handler using
    server-only credentials. Do not create a broad anonymous insert
    policy for the full lead table.
-   Admin policies check for a matching active `admin_users` row using
    `auth.uid()` and the required role.
-   Role-management operations require `super_admin`.
-   Clients cannot directly set admin roles, payment status, enrollment
    status, or audit log entries.
-   Student RLS policies/student profile routes are not needed in this
    MVP because students have no accounts.
-   `auth.role() = 'authenticated'` alone is never sufficient to
    authorize an admin.
-   Test anonymous requests, ordinary authenticated users, every admin
    role, and disabled admins.

Service-role access bypasses RLS. If privileged server code uses it,
that code must explicitly authorize each admin operation first.
Service-role access is not a replacement for application authorization.

## 9. Payment, enrollment, and Facebook group process

1.  Student submits the course inquiry.
2.  Server saves the lead and returns an accurate success response.
3.  Student sends the prepared WhatsApp message manually.
4.  Admin contacts the student and provides bKash/Nagad instructions.
5.  Student pays manually and provides the transaction reference through
    the agreed communication/form process.
6.  Admin checks the receiving account/transaction details. A screenshot
    or student claim alone is not proof that funds were received.
7.  Admin records payment verification/rejection and a note/reason when
    appropriate.
8.  After payment verification and any required course checks, admin
    marks enrollment active.
9.  Admin manually adds the student to the correct private Facebook
    group.
10. Admin records `group_access_status = added`.
11. If enrollment is cancelled or access should end, admin updates
    enrollment/group-access state separately and removes the student
    manually.

The system must not imply payment verification, enrollment, or group
access happened automatically. Each state change is an explicit admin
action and should be logged.

## 10. Error handling and consistency

-   If lead insertion fails, do not show success. Preserve entered
    values and allow retry.
-   If database insertion succeeds but WhatsApp fails to open, keep the
    lead and show a retry link plus copy-message option.
-   If WhatsApp opens, do not claim the message was sent.
-   A repeated click/network retry must not create duplicate leads when
    using the same idempotency key.
-   Database constraints and server logic must handle concurrent
    requests.
-   If a course becomes inactive or admission closes between page render
    and submit, reject the inquiry with a clear message.
-   If fee changes before submission, use the current database fee and
    show it in the resulting message.
-   If an admin action fails, preserve the previous state and show a
    useful error. Do not claim a payment was verified or enrollment
    activated before the database confirms the change.
-   Validate status transitions on the server. Avoid impossible
    combinations such as marking group access added while enrollment
    remains pending, unless an explicit admin exception is recorded.
-   Record actor and timestamp for important state changes.
-   Do not expose internal database errors or personal data in public
    responses/logs.

## 11. Privacy and data handling

-   Publish a Privacy Policy and Terms of Service.
-   Explain why each form field is collected and how EEE Academy uses it
    to respond to inquiries and manage enrollment.
-   Restrict student contact data to authorized admins.
-   Do not put student phone, roll, email, payment reference, or
    internal IDs into public URLs.
-   Do not expose leads in public page source, analytics events, or
    public API responses.
-   Use HTTPS in production.
-   Configure database backups/recovery according to the selected plan
    and maintain a practical export/recovery procedure. Free tiers do
    not guarantee zero downtime or unlimited backup retention.
-   Define who may export lead data and where exports are stored.

## 12. Non-functional requirements

### Performance and responsive UI

-   Mobile-first layout.
-   Optimize image sizes/formats.
-   Lazy-load embeds and below-the-fold media where practical.
-   Target Lighthouse Performance 90+ on representative pages as a goal,
    not a guarantee on every device/network.
-   Provide loading, empty, success, and error states for data-driven
    components.

### Accessibility

-   Labels for every form field.
-   Keyboard-operable navigation and modal.
-   Visible focus indicators and sufficient contrast.
-   Accessible status/error messages.
-   Respect reduced-motion preferences.

### SEO

-   Unique titles and meta descriptions for key public pages.
-   Open Graph metadata.
-   Canonical URLs where appropriate.
-   Structured data only for verified information.
-   Do not index admin routes or internal/private content.

### Reliability and cost

-   Design for free-tier limits but verify current quotas before
    deployment.
-   Avoid claiming zero downtime.
-   Add basic error monitoring and a database recovery/export plan.
-   Do not add paid integrations without approval.

## 13. Admin status definitions

### Lead status

-   `pending`: inquiry saved, not yet contacted
-   `contacted`: academy contacted the student
-   `closed`: inquiry closed without enrollment
-   `cancelled`: inquiry cancelled by student or academy

### Payment status

-   `not_submitted`: no payment details submitted
-   `submitted`: student claims payment or submits transaction details;
    not yet verified
-   `verified`: admin confirmed the payment was received
-   `rejected`: admin rejected submitted payment details

### Enrollment status

-   `not_enrolled`: no enrollment confirmed
-   `pending`: verification/processing remains
-   `active`: admin confirmed enrollment
-   `completed`: enrollment has ended
-   `cancelled`: enrollment cancelled

### Group access status

-   `not_added`: student not yet added
-   `added`: admin confirms the student was added
-   `removed`: student was removed from the group

The UI must not combine lead, payment, enrollment, and group-access
states into one ambiguous dropdown.

## 14. Testing and acceptance criteria

### Public pages and content

-   [ ] Home and course directory work on mobile and desktop.
-   [ ] Only active courses appear in the public catalogue.
-   [ ] Closed courses cannot accept new inquiries.
-   [ ] Teacher/demo updates appear without code edits.
-   [ ] Unverified credentials and unsupported claims are not published.
-   [ ] Facebook embed failure has a fallback.

### Form and WhatsApp

-   [ ] Required fields are validated on client and server.
-   [ ] Bangladeshi phone formats normalize consistently.
-   [ ] Course ID is validated and price comes from the database.
-   [ ] Client-supplied price/title/status changes are ignored.
-   [ ] A valid inquiry is saved once despite double-click/network
    retry.
-   [ ] Duplicate attempts follow the documented duplicate policy.
-   [ ] Database failure never shows a success message.
-   [ ] Popup blocking shows retry link and copy-message fallback.
-   [ ] Success copy says the WhatsApp message still needs to be sent.
-   [ ] No private group URL appears in public form responses or
    WhatsApp text.

### Admin authentication and permissions

-   [ ] Anonymous users cannot access admin data/routes.
-   [ ] Authenticated non-admin users are denied.
-   [ ] Disabled admins lose privileged access.
-   [ ] Course managers cannot perform super-admin-only actions.
-   [ ] Payment verifiers cannot change admin roles.
-   [ ] Every privileged server action checks authorization.
-   [ ] RLS blocks unauthorized direct database requests.
-   [ ] Service-role/secret keys never appear in browser
    bundles/responses.

### Payment and enrollment

-   [ ] Payment cannot become verified without authorized admin action.
-   [ ] Duplicate transaction references cannot be accepted for multiple
    successful payments.
-   [ ] Rejected attempts retain history and reason.
-   [ ] Enrollment state is separate from payment state.
-   [ ] Group access state is separate from enrollment state.
-   [ ] Important state changes record actor and timestamp.
-   [ ] Admin search/filter and call/WhatsApp actions work.

### Deployment and operations

-   [ ] Production environment variables are correct.
-   [ ] Migrations are version-controlled and reproducible.
-   [ ] RLS is tested against every role.
-   [ ] Privacy Policy and Terms are published.
-   [ ] Backup/export and recovery procedure is documented.
-   [ ] Mobile end-to-end test covers course card → database lead →
    WhatsApp handoff.
-   [ ] Production errors do not expose stack traces or secrets.

**Release gate:** Do not launch with failing RLS tests, publicly exposed
student records/private group URLs, or admin endpoints protected only by
frontend routing.

## 15. Implementation roadmap

### Phase 1 --- Foundation

-   Initialize Next.js, TypeScript, Tailwind, and shared UI.
-   Configure Supabase project and environment variables.
-   Create SQL migrations, indexes, constraints, enums, and RLS
    policies.
-   Provision the first super-admin securely.
-   Test anonymous/admin access before building the full dashboard.

### Phase 2 --- Public catalogue

-   Build homepage and course directory.
-   Connect public course queries.
-   Add teacher/demo data structures and public settings.

### Phase 3 --- Inquiry and WhatsApp

-   Build validated inquiry modal/form.
-   Implement server-side course/price validation.
-   Implement idempotent lead creation and anti-spam controls.
-   Implement WhatsApp message, popup-safe navigation, and fallback.
-   Run end-to-end tests.

### Phase 4 --- Admin operations

-   Build admin overview and lead table.
-   Add search/filter, call/WhatsApp actions, and lead status.
-   Add course, teacher, demo, and public settings management.
-   Add payment verification and enrollment/group-access state handling.
-   Add audit logging.

### Phase 5 --- Security, QA, launch

-   Test RLS and every admin role.
-   Test duplicate requests, invalid payloads, closed courses, and
    database failures.
-   Test popup blocking and mobile browsers.
-   Review privacy, security headers, SEO, accessibility, and production
    environment variables.
-   Confirm database recovery procedure.
-   Deploy to Vercel and run production smoke tests.

## 16. Backend logic review: issues corrected

The original high-level lead-generation flow was appropriate, but its
sample RLS policies were **not safe for production**:

1.  `auth.role() = 'authenticated'` does not prove the user is an admin.
    Any authenticated user might satisfy the condition.
2.  Unrestricted anonymous inserts into `course_leads` permit spam and
    forged values unless validated server-side.
3.  Storing `fb_group_link` in a publicly readable `courses` table risks
    exposing private group access URLs.
4.  One status field such as `pending → enrolled` does not accurately
    track payment verification and manual Facebook group addition as
    separate events.
5.  Opening WhatsApp does not prove the message was sent.
6.  Frontend-only validation and hidden admin buttons do not secure the
    database or server.

This PRD addresses those issues with validated server-side lead
creation, separated public/private data, explicit admin roles,
independent payment/enrollment/group states, and release-blocking
security tests.

**Source of truth:** This document defines the MVP. Do not add student
login, automatic account creation, automatic payment confirmation, or
automated Facebook group access unless the product owner explicitly
approves a later scope change.

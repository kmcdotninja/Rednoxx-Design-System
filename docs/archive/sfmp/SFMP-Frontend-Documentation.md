# SFMP — Frontend Product & Engineering Documentation

> **Repository:** `hubuktech/Sterloan-Frontend` (branch analysed: `staging`) — note the repo path, `package.json` name (`sterloan`), Docker images (`hubuk/ster_frontend`) and Pino logger still carry the **legacy `sterloan`/`ster` identifiers**; only the product/brand name has changed.
> **Product:** **SFMP — Sustainable Finance Marketplace** (formerly *Sterloan*, an *"all‑inclusive loan management system"*), by **Hubuk Technology**, built for **Sterling Bank**. *(Rebrand details in §20.)*
> **Nature of this repo:** The **web frontend** (a Next.js application). The backend is a separate .NET/Azure service (`starloanbackend.sterlingapps.p.azurewebsites.net`).
> **Scope of this document:** Everything discoverable from the source code — architecture, security model, domain, features end‑to‑end, API surface, state, validation, UI system, build & deployment, tooling, and an honest engineering review.

> **🔄 Update — SFMP Branding & Onboarding Enhancement (approved 07 Apr 2026).**
> A new user‑story suite (*"Enhancement of SFMP Branding and Onboarding"*) rebrands the platform to the **Sustainable Finance Marketplace (SFMP)** and optimises the onboarding/application experience around **renewable‑energy financing**. **Sections 1–19 remain the as‑built reference for the current `staging` code; they are unchanged.** The approved enhancement is captured in **[§20](#20-sfmp-enhancement--branding--onboarding-update)**, with a mapping back to the current code in [§20.8](#208-impact-on-this-codebase-as-built--sfmp). *This document is marked **CONFIDENTIAL** per Sterling Bank handling guidelines.*

---

## Table of Contents

1. [What SFMP Is](#1-what-sfmp-is)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure](#3-repository-structure)
4. [Configuration & Runtime Environment](#4-configuration--runtime-environment)
5. [Security Architecture](#5-security-architecture)
6. [Authentication, Roles & Authorization](#6-authentication-roles--authorization)
7. [Session Management](#7-session-management)
8. [Domain Model & Actors](#8-domain-model--actors)
9. [Features, End to End](#9-features-end-to-end)
10. [State Management (Zustand)](#10-state-management-zustand)
11. [Data Layer (React Query + OpenAPI + Axios)](#11-data-layer-react-query--openapi--axios)
12. [Backend API Surface](#12-backend-api-surface)
13. [Validation Rules](#13-validation-rules)
14. [UI Component Library](#14-ui-component-library)
15. [Design System & Styling](#15-design-system--styling)
16. [Routing Map](#16-routing-map)
17. [Build, Docker & CI/CD](#17-build-docker--cicd)
18. [Developer Tooling & Conventions](#18-developer-tooling--conventions)
19. [Engineering Review & Observations](#19-engineering-review--observations)
20. [SFMP Enhancement — Branding & Onboarding Update](#20-sfmp-enhancement--branding--onboarding-update) 🔄 *new*

---

## 1. What SFMP Is

SFMP is a **B2B / B2B2C lending and loan‑management platform**. It connects three principal parties around structured lending, and adds advisory and community‑lending capabilities on top:

- **Borrowers** — corporate entities (identified by **TIN**, Nigerian Tax Identification Number, and **RC Number**, corporate registration) that seek financing for projects.
- **Financiers** — institutions that fund projects.
- **Admin (Sterling Bank operators)** — the platform operator that curates sectors, reviews/recommends projects, manages participants, and runs approvals and audit.

The core workflow is a **project‑finance / structured‑credit appraisal marketplace**:

> A borrower onboards → creates a **Project** (a financing request with a full credit‑appraisal document pack) → the project is published to a **Marketplace** → Admin reviews and **recommends** it → **Financiers** see recommended projects, **select** them, and **accept or reject** → an **acceptance checklist** and **repayment** terms are agreed.

Alongside this, the platform runs:

- **Community lending** — communities with leaders/members, published loan **offers** (tenor + interest rate), member loan applications, and **disbursement / repayment** against **Sterling bank accounts**.
- **Advisory services** — in‑app **messaging** (inbox/sent) and **meetings** (with guests, scheduling, and video links) between institutions.
- **Notifications & Approvals** — a maker‑checker approval queue and notification centre.
- **Audit Trail** — full change history for admins.

Every page footer states: *"Proudly Powered by Sterling Bank and CBN."* Branding assets in `public/` include Sterling, CBN, Access, GTBank, Fidelity, and UBA logos (partner banks shown on the landing page).

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | **Next.js** (Pages Router) | `^15.3.0` |
| UI runtime | **React** / React DOM | `^18.3.1` |
| Language | **TypeScript** | `^5.8.2` (strict mode on) |
| Styling | **Tailwind CSS** + PostCSS + Autoprefixer | `^3.4.17` |
| Client state | **Zustand** (+ persist middleware, React context) | `^3.7.2` |
| Server state / caching | **React Query** (`react-query`) | `^3.39.3` |
| HTTP | **Axios** + **auto‑generated OpenAPI client** (`typescript-axios`) | `^1.8.4` |
| Forms | **React Hook Form** + **Formik** (both present) | `^7.54.2` / `^2.4.6` |
| Validation | **Yup** (+ `@hookform/resolvers`) | `^0.32.11` |
| Crypto | **crypto-js** (AES payload encryption) | `^4.2.0` |
| Auth tokens | **jwt-decode**, **js-cookie** | `^3.1.2` / `^3.0.5` |
| Sanitisation | **DOMPurify** | `^3.3.1` |
| Charts | **Chart.js** + **react-chartjs-2** | `^3.9.1` / `^4.3.1` |
| Dates | **react-datepicker**, **react-datetime**, **moment-timezone** | — |
| File upload | **react-dropzone** | `^12.1.0` |
| UI primitives | **@headlessui/react**, **@heroicons/react**, **react-feather** | — |
| Selects | **react-select** | `^5.10.1` |
| Pagination | **react-paginate** | `^8.3.0` |
| Toasts | **react-toastify** | `^8.2.0` |
| Animations | **@lottiefiles/react-lottie-player**, **react-lottie** | — |
| Loaders | **react-loader-spinner** | `^5.4.5` |
| Logging | **pino** | `^7.11.0` |
| Images | **sharp** (Next.js image optimisation) | `^0.33.5` |
| Utility | **lodash**, **clsx** | — |

**Runtime:** Node **20** (Docker + CI). **Package manager:** Yarn (with `yarn.lock`; a `package-lock.json` is also committed).

---

## 3. Repository Structure

```
Sterloan-Frontend-staging/
├── .github/workflows/         # CI/CD: deploy_staging, deploy_production, pull_request
├── .husky/                    # Git pre-commit hook (format + lint + types + build)
├── .idea/ .vscode/            # JetBrains + VS Code editor config
├── Dockerfile                 # Multi-stage build (node:20-alpine, standalone output)
├── next.config.js             # standalone output + SVGR (SVG-as-component) webpack rule
├── tailwind.config.js         # Design tokens (colors, typography, screens)
├── tsconfig.json              # strict TS; baseUrl = src
├── package.json
├── public/                    # Static assets: logos, landing images, SVG illustrations
└── src/
    ├── _middleware.ts         # Route-guard middleware (redirects unauthenticated users)
    ├── pages/                 # 60 route files (Pages Router)
    │   ├── api/config.ts      # Runtime-config endpoint (exposes env to the browser)
    │   ├── auth/ …            # login, signup(+otp,+password,+verified), forgot(+otp,+reset), verify-2fa
    │   ├── borrower/ …        # list, [id], onboarding(+start,+success)
    │   ├── financier/ …       # list, [id], onboarding(+start,+success)
    │   ├── projects/ …        # on_marketplace, selected, accepted, rejected, recommended, checklist
    │   ├── marketplace/ …     # list, [projectId], success
    │   ├── communities/ …     # list, [id], loan_application
    │   ├── advisory/ …        # meetings, messages(+[messageId])
    │   ├── sectors/ …         # list, [sectorId]
    │   ├── user_management/    # persona (user) management
    │   ├── audit/ …           # audit trail list + [auditId]
    │   ├── notification(s)/    # approvals + notification centre
    │   ├── dashboard/, profile/, settings/, reactivation/
    │   └── 403 / 404 / 500 / faqs / privacy / index (landing)
    ├── components/            # ~238 .tsx across ~30 feature folders (see §14)
    ├── store/                 # 11 Zustand slices (see §10)
    ├── hooks/                 # 6 custom hooks (auth, permissions, session, etc.)
    ├── lib/
    │   ├── constants.ts       # Config getters, role names, React-Query cache tags, cookie options
    │   ├── runtimeConfig.ts   # Fetch/caches runtime env from /api/config
    │   ├── interfaces/        # Form/domain TypeScript interfaces
    │   ├── schema/            # Yup validation schemas
    │   └── utils/
    │       ├── encrypt.ts         # AES-128-CBC encrypt/decrypt
    │       ├── jwt.ts             # JWT decode + role/user-type helpers
    │       ├── httpClient.ts      # Axios instances (JSON + file/blob)
    │       ├── Interceptors.ts    # Request/response encryption + token-refresh logic
    │       ├── clearAuthData.ts   # Cookie/session teardown
    │       ├── validation.ts      # XSS/email/name/URL/password validators
    │       ├── notification.ts    # Toast helpers
    │       ├── logger.ts          # Pino logger
    │       └── httpGen/           # ⚙️ AUTO-GENERATED OpenAPI client (do not hand-edit)
    ├── Utils/index.tsx        # Currency/number formatting, misc helpers
    └── styles/                # globals.css, Home.module.css
```

**File composition of `src/`:** 238 `.tsx`, 61 `.ts`, 2 `.css`.

---

## 4. Configuration & Runtime Environment

SFMP uses a **runtime configuration pattern** (rather than build‑time `NEXT_PUBLIC_*` inlining) so a single Docker image can be promoted across environments with env vars injected at container start.

**How it works**

1. `src/pages/api/config.ts` is a Next.js API route that reads server‑side environment variables and returns them as JSON.
2. On the client, `src/lib/runtimeConfig.ts` fetches `/api/config` **once at app startup** (`_app.tsx` blocks render until `initializeConfig()` resolves), caches the result in memory, and exposes typed getters.
3. `src/lib/constants.ts` re‑exports these as **callable functions** — e.g. `API_URL()`, `JWT_KEY()`, `ENCRYPTION_KEY()` — so config is resolved lazily at call time on both server and client.

**Environment variables consumed**

| Variable | Purpose |
|---|---|
| `API_URL` | Base URL of the backend API (client calls `${API_URL()}/api`) |
| `ENCRYPTION_KEY` | AES symmetric key for request/response payload encryption |
| `ENCRYPTION_IV` | AES initialisation vector |
| `JWT_KEY` | Cookie name under which the access token (JWT) is stored |
| `REFRESH_TOKEN_KEY` | Cookie name for the refresh token |
| `EMAIL_KEY` | Cookie name for the user email |
| `TOKEN_KEY` | Cookie name for an auxiliary token |
| `TEMP_ID_KEY` | Cookie name for a temporary user id (used during signup/OTP) |
| `ACCOUNT_TYPE_KEY` | Cookie name for account type |

> The **cookie *names* themselves are configurable** via env — a mild obfuscation measure so cookie keys aren't guessable across deployments.

---

## 5. Security Architecture

This is the most distinctive part of the codebase. Security posture is **bank‑grade** and consists of several layers.

### 5.1 Application‑layer payload encryption (on top of TLS)

Implemented in `lib/utils/encrypt.ts` and applied globally by `lib/utils/Interceptors.ts`:

- **Every outbound request body is AES‑128‑CBC encrypted** (`crypto-js`, hex output) before being sent.
- **Every inbound response body is decrypted** before it reaches application code.
- Uses a symmetric `ENCRYPTION_KEY` + `ENCRYPTION_IV` from runtime config, CBC mode, 128‑bit key size.
- **Exceptions (sent/received in the clear):**
  - File **uploads** (`POST /api/File`) — sent as raw multipart/data.
  - File **downloads** (Axios `responseType: "blob"`, GET) — returned as raw binary.

This means API traffic is encrypted twice: once by HTTPS in transit, and again at the message level, so payloads are opaque even to anything terminating TLS in between.

### 5.2 Token handling

- **JWT access token** and **refresh token** are stored in **cookies** (via `js-cookie`) — not `localStorage`.
- Cookie options (`lib/constants.ts` → `COOKIE_OPTIONS`): `secure` (true on HTTPS / in production) and `sameSite: "strict"`.
- JWT claims decoded (`lib/utils/jwt.ts`): `id`, `email`, `unique_name`, `completed`, `tin`, `role[]`, `firstName`, plus standard `exp`.
- `getUserType()` maps the role claim to a coarse type: `Borrower` / `Financier` / `Admin`.

### 5.3 Token refresh with request queueing

`lib/utils/Interceptors.ts` implements a robust refresh mechanism:

- A module‑level `isRefreshing` flag plus a `failedQueue` **serialises concurrent refreshes**: while one refresh is in flight, other requests park their promises and resume once a new token is available.
- The refresh call hits `POST /api/Auth/RefreshToken` **directly via raw axios** (not the intercepted client) to avoid an infinite interceptor loop; its body is itself AES‑encrypted.
- On refresh success, new access/refresh tokens are written back to cookies.
- On refresh failure → `clearAuthData()` and redirect to `/auth/login`.

### 5.4 HTTP error semantics

The response‑error interceptor centralises auth/permission handling:

- **401 + valid token + `!completed` claim (or error `code === 26`)** → user hasn't finished onboarding → redirect by role: Borrower Root → `/borrower/onboarding`, Financier Root → `/financier/onboarding`, else `/403`.
- **401 + valid token otherwise** → treated as an authorization problem → `/403` (with a special carve‑out that does *not* redirect for `…/community/members/…` requests).
- **401 + expired token** → attempt refresh (once, guarded by `_retry`), then retry the original request; otherwise log out.
- **403** → redirect to `/403`.

### 5.5 Input hardening (XSS / injection)

`lib/utils/validation.ts` provides reusable guards, wired into Yup schemas across the app:

- `containsXss` rejects any of `< > " ' \` ;`.
- `noXssTest` — a Yup test applied to virtually every free‑text field (project descriptions, comments, messages, community fields, etc.).
- `validNameTest` — names must be 2–50 chars, contain at least one letter, restricted character set.
- `isValidEmail` / `STRICT_EMAIL_REGEX`, `isSafeUrl` (http/https only), `isValidPassword` (8–32).
- **DOMPurify** is a dependency for sanitising any HTML that must be rendered.

### 5.6 Route protection (middleware)

`src/_middleware.ts` runs on the edge and guards a matcher set:

```
/borrower/*, /dashboard/*, /financier/*, /projects/*, /settings/*
```

If no access‑token cookie is present, the request is **rewritten to `/auth/login`**. (Note: this is a *rewrite*, so the URL stays but the login page renders.)

---

## 6. Authentication, Roles & Authorization

### 6.1 Role model — a banking maker‑checker (dual‑control) design

Nine named roles across three domains (`lib/constants.ts`):

| Domain | Root | Authorizer (checker) | Initiator (maker) |
|---|---|---|---|
| **Admin** | `Admin Root` | `Admin Authorizer` | `Admin Initiator` |
| **Borrower** | `Borrower Root` | `Borrower Authorizer` | `Borrower Initiator` |
| **Financier** | `Financier Root` | `Financier Authorizer` | `Financier Initiator` |

- **Root** — the organisation's super‑user (can manage users, is the account owner).
- **Initiator** — *makes* requests/changes.
- **Authorizer** — *approves* what initiators submit (this is what drives the **Approvals** queue and `ApprovalEndpointsApi`).

There is also a `PRE_2FA_TOKEN_KEY = "pre_2fa_token"` claim used between password validation and 2FA completion.

### 6.2 UI‑level permission gating

Two pieces work together:

- **`hooks/useAuthUserPermissionValidator.tsx`** exposes `hasPermission(...)` (OR / "some") and `hasPermissions(...)` (AND / "every") based on the current user's role claim.
- **`components/AuthUserUIPermission`** is a wrapper component that conditionally renders children based on a `permissions` array, with `validateAll` (require all) and `validateExclusive` (invert — render only if the user does *not* have the permission) modifiers. When not permitted but `visible` is set, it renders children in a `pointer-events-none` state (visible but disabled).

This component wraps every sidebar item, so **navigation is role‑driven** (see §16).

### 6.3 Authentication flows

- **Signup** (corporate): `Init Signup` (TIN + first/last name + email) → **email OTP** verify → set **password** → verified. (`SignupEndpointsApi`: `signupInit`, `signupVerifyotp`, `signupComplete`.)
- **Login** → email + password → **2FA** step (`/auth/verify-2fa`) → tokens issued. (`AuthEndpointsApi`: `authLogin`, `authLogout`, `authRefreshtoken`.)
- **Forgot / Reset password**: request → OTP → reset. (`PasswordEndpointsApi`: `authForgotpassword`, `authVerifyotp`, `authResetpassword`, `authChnagepassword`.)
- **Reactivation** — flows for reactivating deactivated borrowers/financiers (`/reactivation`).

---

## 7. Session Management

`hooks/useSessionMonitor.tsx` implements an activity‑aware session watchdog:

- **Inactivity timeout:** 5 minutes → auto‑logout (also calls the backend `Auth/Logout` to invalidate server‑side).
- **Poll interval:** checks session every 30 seconds.
- **Proactive refresh:** if the token has < 2 minutes left *and* the user is active, it silently refreshes.
- **Activity tracking:** listens to `mousedown, mousemove, keydown, scroll, touchstart, click`, throttled to at most once/second, plus a re‑check on `window` focus.
- Guards against concurrent logout/refresh with refs.

There is also `hooks/useRefreshToken.tsx` (a React‑Query mutation‑based refresh, used on mount to bootstrap token validity) and `hooks/useAuthUser.tsx` (decodes the current user from the cookie).

---

## 8. Domain Model & Actors

The generated client defines **145 DTOs** and **9 enums**. The domain divides cleanly into these areas:

**Identity & onboarding**
- `InitSignupRequest`, `CompleteSignupRequest`, `VerifySignupOtpRequest`, `VerifyOtpRequest`
- `OnboardBorrowerRequest`, `OnboardFinancierRequest`, `VerifyBvnRequest` / `BvnVerificationResultContent`, `VerifyTinRequest` / `TinVerificationData`
- `LoginRequest` / `LoginResponse`, `RefreshTokenRequest`, `ChangePasswordRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`

**Borrower entity** — `BorrowerDetailsResponse`, `OwnerResponse`/`OwnerDetail`, `DirectorResponse`/`DirectorDetail`, `ManagementResponse`/`ManagementDetail`, `EducationDetail`/`WorkDetail`/`InvestimentDetail`, `CompanyDetails`. A borrower is a company with **owners (shareholders), directors, and management**, each with education/work/investment history, plus documents and a business‑analysis file.

**Financier entity** — `FinancierResponse`, `FinancierListResponse`, `CompanyResponse` (company details, documents, sectors of interest).

**Projects (structured‑credit appraisal)** — `NewProjectRequest`, `EditProjectRequest`, `ProjectResponse`, `ProjectListingResponse`, `BussinessRiskRequest`, `AcceptProjectRequest`, `RejectProjectRequest`, `ProjectRecommendationRequest`, `ProvideInfoRequest`, `AdditionalInfomationRequest`, `ReviewRequest`/`ReviewResponse`, `CheckListRequest`, `ProjectRejectedResponse`.

**Sectors (dynamic forms)** — `CreateSectorRequest`, `SectorDetailsResponse`, `SectorListingResponse`, `AddInputFieldRequest`/`EditInputFieldRequest`, `InputFieldResponse`, `InputDataRequest`, `SectorChartItem`. Sectors carry **configurable input fields** (`InputType` enum), so each economic sector can require a tailored data set.

**Facility types** — `FacilityTypeResponse` (the catalogue of loan/facility products a project can request).

**Communities & offers** — `CreateCommunityRequest`, `EditCommunityRequest`, `CommunityResponse`, `CommunityListingResponse`, `CommunityMemberListingResponse`, `CommunityRejectionResponse`, `AddMemberRequest`, `CreateOfferRequest`/`EditOfferRequest`, `OfferResponse`, `SubscriptionListingResponse`, `CreateLoanAccountRequest`, `DisburseLoanRequest`, `RejectRequest`.

**Advisory** — `NewMeetingRequest`/`MeetingResponse`/`MeetingGuestRequest`, `CreateMessageRequest`/`ReplyMessageRequest`/`MessageResponse`/`GetMessageResponse`/`MessageListResponse`/`MessageReplyResponse`.

**Personas (users)** — `CreatePersonaRequest`, `EditPersonaRequest`, `UpdatePersonaRequest`, `PersonaResponse`, `PersonaListingResponse`. A **persona** is a user account within an institution.

**Platform** — `DashboardDataResponse`, `NotificationResponse`, `ApprovalResponse`, `TrailListingResponse`/`TrailDetailsResponse` (audit), `FileResponse`, `ObjectChangeResponse`, plus generic envelopes (`BaseResponse`, `*ApiResponse`, `ProblemDetails`, `ValidationError`).

### Enums

These arrive from the backend as **integer enums** (the generated client names them `NUMBER_0`, `NUMBER_1`, … — the semantic labels live on the backend, not in this repo):

| Enum | Values present |
|---|---|
| `ApprovalStatus` | 0, 1, 2 |
| `CommunityMembership` | 0, 1, 2 |
| `DashboardType` | 0, 1, 2 |
| `EntityStatusType` | 0, 1, 2, 3 |
| `InputType` | 0, 1, 2, 3, 4 (sector field types, e.g. text/number/date/select/file) |
| `Institution` | 2, 3 |
| `InstitutionType` | 1, 2, 3 |
| `OfferType` | 0, 1 |
| `RoleType` | 0, 1 |

---

## 9. Features, End to End

### 9.1 Marketing / Landing (`/`, `/faqs`, `/privacy`)

Public marketing site (`components/Landing/*`): hero, multi‑panel feature details (`LandingDetails`, `…2`, `…3`), **Our Partners** (Sterling, CBN, Access, GTBank, Fidelity, UBA), footer/nav, and a **Get Started** CTA. Legal pages for FAQs and Privacy. Terms component for acceptance.

### 9.2 Authentication (`/auth/*`)

Full self‑service auth: **signup** (TIN + name + email → OTP → password → verified), **login → 2FA**, **forgot/reset password** (with OTP), and **reactivation**. OTP UX includes a dedicated `OTPInput` and an `OTPTimer`/`OTPTimerSign` countdown/resend. All fields are Yup‑validated (see §13).

### 9.3 Borrower Onboarding (`/borrower/onboarding/*`)

A **multi‑step stepper** (`OnboardingStepper`, `OnboardingSteps`, `Stepper`) that collects a complete corporate profile before the borrower can transact:

- **Business details** + **shareholders/owners** (name, units held, % held, position, BVN, board‑representation flag).
- **Directors** (personal details + **education history** + **work experience** + **investment/loan‑exposure detail**).
- **Management** (education + work history).
- **Business analysis** document + supporting **documents**.
- A **summary** review step before submission (`onboardBorrower`).

BVN and TIN are verified against the backend (`onboardVerifybvn`, `onboardVerifytin`).

### 9.4 Financier Onboarding (`/financier/onboarding/*`)

Stepper collecting: **company details** (company name, RC number, primary contact name/phone/email/position), **sectors of interest**, and **business documents**, with a summary step (`onboardFinancier`).

### 9.5 Sectors (`/sectors`, `/sectors/[sectorId]`) — Admin

Admins define **economic sectors** and, for each, a set of **dynamic input fields** that borrowers must complete. Operations: create, rename, activate/reactivate/deactivate, and per‑field add/edit/delete (`sectorsAddinput`, `sectorsEditInput`, `sectorsDeleteinput`). Components: `SectorCreateDialog`, `SectorItem`, `SectorItemField`, `SectorItemFieldDialog`, `SectorItemFieldDeleteDialog`.

> 🔄 **SFMP update:** the create/edit‑sector flows are being reworked around a maker‑checker model, per‑facility‑type fields, a typed field form (Text/Document/Number/Percentage), and a combo section selector — see [§20.6](#206-admin--sector-configuration-updates-95).

### 9.6 Projects — the core appraisal lifecycle (`/projects/*`)

A **Project** is a financing request carrying a rich credit‑appraisal package. Creation (`/projects/on_marketplace/create_project`) is a multi‑step flow (`components/ProjectsOnMarketplace/*`):

> 🔄 **SFMP update:** project creation is being refined — a **Facility Type** step (with per‑item tooltips) replaces the "Selected Sector" label, an **equity‑contribution minimum of 20 %** is enforced, supporting‑document sections become **facility‑type‑specific** with info‑icon tooltips and multi‑upload "Other", and in‑progress applications are **auto‑saved on timeout**. See [§20.2](#202-facility-type-model-renewable-energy-focus)–[§20.4](#204-mandatory-documents-by-facility-type).

1. **Select sector.**
2. **Project details:** name, description, **facility type**, **facility amount**, purpose, **tenor** (whole months), **moratorium requirement**, **domiciliation arrangement**, **equity contribution** (0–100 %), **source of repayment**.
3. **Business risks:** repeating set of *perceived risk → consequences → mitigating factors*.
4. **Supporting documents** — a full project‑finance document taxonomy, each with detailed guidance prompts baked into the UI:
   - **Proposed Project** (feasibility, financial model & cash‑flow projection over the tenor, repayment structure, contractor profiles, signed contracts, equity, **proposed security/collateral**, statutory approvals, site layout, bill of quantities…)
   - **Credibility** (existing bank facilities: bank/branch, facility type, amount granted/outstanding, date, tenor)
   - **Project Execution** (cost breakdown, funding structure, work programme, technical operations, vendors/suppliers)
   - **Sustainability** (safety & environmental / ESG policy and mitigants)
   - **Sector Overview** (local/international developments, government policy effects, major players & competitors)
   - **Product Specification**, **Supply Analysis**, **Demand Analysis**, **Pricing**, **Sales (marketing arrangements)**, **Critical Sales (key success factors)**
   - Plus **security**, **transaction**, and **additional inputs** documents.
5. **Additional details** and a **creation summary**.

Project **states / queues** (each a page and a dashboard/marketplace view):

| Queue | Meaning | Who sees it |
|---|---|---|
| **On Marketplace** | Borrower's own projects listed for funding | Borrower |
| **Recommended** | Admin‑recommended projects | Admin, Financier |
| **Selected** | Projects a financier has selected | All |
| **Accepted** | Projects accepted (deal proceeding) | All |
| **Rejected** | Rejected projects (with **rejection history** & comments) | All |

Backend operations: `projectCreate`, `projectEdit`, `projectDelete`, `projectDelist`, `projectDetails`, `projectInfo`, `projectList`, `projectMarketplace`, `projectRecommendation`, `projectSelect`, `projectAccept`, `projectReject`, `projectRejected`, `projectRequestInfo`, `projectProvideInfo`. The **request‑info / provide‑info** pair lets a reviewer ask the borrower for more information mid‑appraisal.

### 9.7 Marketplace (`/marketplace`, `/marketplace/[projectId]`) — Financier

Financiers browse recommended projects, open a project's full detail (business details, directors, management, analysis, rejection history — `components/MarketPlace/MarketPlaceBorrowerDetails/*`), review supporting documents, and **accept** a project (`MarketplaceAcceptance`).

### 9.8 Project Acceptance Checklist (`/projects/checklist`)

After acceptance, an **acceptance checklist** (`components/ProjectAcceptanceChecklist/*`) is completed and a **repayment form** (`ProjectAcceptanceRepaymentForm`) captures repayment terms (`CheckListRequest`).

### 9.9 Communities & Community Lending (`/communities/*`)

A parallel **community‑based lending** product (26 backend operations — the richest module):

- **Community CRUD** — create/edit; activate/deactivate.
- **Leaders & members** — add, activate, deactivate leaders and members; `join`; view members/leaders; membership **requests** and **rejections** (`communityRequests`, `communityRejectRequest`, `communityGetRejeced`).
- **Offers** — publish/edit loan **offers** (name, tenor in months, interest rate %); list offers; list **subscribers** to an offer.
- **Loan accounts** — `communityCheckAccount`, `communityCreateLoanAccount`, `communityDisburseLoanAccount`, `communityRepayLoan`.

**Member loan application** (`/communities/loan_application`) is a two‑part form:
- *Basic info*: phone, address, gender, date of birth, nationality, state of residence, nearest landmark, requested amount.
- *Business info*: **BVN**, **TIN**, sector, monthly salary.
- *Documents*: means of ID, photo mandate, signature mandate, employee letter of introduction.

**Disbursement** (`LoanDisbursmentForm`) captures BVN, phone, **Sterling account**, monthly salary, loan amount, and offer id — confirming disbursement runs directly against **Sterling Bank accounts**.

> Note: the "Communities" sidebar entry is currently **commented out** in `Sidebar.tsx`, so the module exists in full but may be hidden from primary navigation on this branch.

### 9.10 Advisory Services (`/advisory/*`)

- **Messages** (`/advisory/messages`, `…/[messageId]`): an **inbox/sent** messaging system between institutions — compose (subject + body), reply, mark read, unread counts. Components: `Inbox`, `Sent`, `MessageForm`, `MessageCard`, `replyForm`. Institution targeting uses `InstitutionType`. *(🔄 SFMP update: adds a **date filter** and **server‑side value search** with DB‑backed pagination — see [§20.5](#205-messaging--search--date-filter-updates-910).)*
- **Meetings** (`/advisory/meetings`): schedule meetings with **guests** (typed guest + selection), **date** (cannot be in the past), **duration**, and a **meeting link** (validated as a safe http/https URL); view **invites**; cancel. Components: `MeetingForm`, `NewMeetingForm`, `MeetingCard`, `Meetinglist`, `InvitesPage`.

### 9.11 Dashboard (`/dashboard`)

Role‑aware landing dashboard with analytics: `DashboardDataResponse` (headline metrics) and a **sector chart** (`dashboardSectorChart` → `SectorChartItem`, rendered via Chart.js in `AdminChart`). `DashboardType` distinguishes dashboard variants.

### 9.12 Notifications & Approvals (`/notification`, `/notifications`, `/notifications/[notifyId]`)

- **Notification centre** — list, detail, mark read, unread count (`notificationsGet`, `notificationGet`, `notificationRead`, `notificationsCount`).
- **Approvals** — the maker‑checker queue for Authorizer/Root roles: pending items, counts, and accept actions (`aprovalPending`, `aprovalCount`, `aprovalAccept`). UI: `NotificationPendingApprovalCard`, `NotificationPendingApprovalDialog`.

### 9.13 User Management / Personas (`/user_management`) — Root roles

Institution **Root** users manage their **personas** (users): list, create (email, phone, name, role, password), edit, activate/deactivate, reactivate, permanently delete (`personaAll`, `personaList`, `personaCreate`, `personaEdit`, `personaDeactivate`, `personaReactivate`, `personaPermanentDelete`). Also `personaMyCompany`, `personaMyprofile`, `personaUpdatemyprofile` back the **Profile/Settings** screens. UI: `UserManagementUserItem`, `UserManagementNewUserFormDialog`, `UserManagementActivationDialog`.

### 9.14 Profile & Settings (`/profile`, `/settings`)

Self‑service profile view/update and account settings (`SettingFormCard`), backed by the persona "my profile" endpoints and password change.

### 9.15 Audit Trail (`/audit`, `/audit/[auditId]`) — Admin

Full change history for compliance: list of trail entries and per‑entry details showing object changes (`auditTrailList`, `auditTrailDetails` → `TrailListingResponse`, `TrailDetailsResponse`, `ObjectChangeResponse`).

### 9.16 Error & Status Pages

Custom `403` (forbidden), `404` (not found, with a bespoke SVG), and `500` (server error) pages.

---

## 10. State Management (Zustand)

`src/store/index.ts` builds **one root store** by composing 11 slices, wrapped in a React context provider (`zustand/context`) and **persisted to `localStorage`** under the key `"store"`. Persistence uses a light **Base64 obfuscation** (`serialize: btoa(JSON.stringify(...))`, `deserialize: JSON.parse(atob(...))`). SSR‑safe: a fresh store is created per request on the server, reused on the client.

| Slice | File | Responsibility |
|---|---|---|
| Financier onboarding | `financier.ts` | company details, documents, sectors of interest |
| Borrower onboarding | `borrower.ts` | owners, directors, management, documents, analysis doc; add/edit/remove for each |
| Project creation | `project.ts` | project details + business risks + additional inputs + **12 appraisal document paths**; full reset |
| Checklist | `checklist.ts` | acceptance checklist + repayments |
| Loan application | `loanApplication.ts` | community loan basic/business info + ID/mandate/letter document paths |
| Signup | `signup.ts` | in‑progress signup payload |
| Stepper | `stepper.ts` | current step + step‑1/2/3 completion flags |
| Notification count | `notification.ts` | unread notification counter |
| Notification modal | `notificationModal.ts` | modal open/title state |
| Additional detail | `additional.ts` | additional‑info document path |
| Global | `global.ts` | edit‑offer scratch data + global loading‑modal toggle |

The `useLoadingModal` hook reads/writes the global loading‑modal flag to drive `LoadingBackdrop`/`LoadingContent` across the app.

---

## 11. Data Layer (React Query + OpenAPI + Axios)

- **React Query** (`react-query` v3) provides caching, background refetch, and mutations. The `QueryClient` is created in `_app.tsx`, with `Hydrate` for SSR state and **React Query Devtools** enabled (closed by default).
- **Cache keys** are centralised as `QtkTagEnum` in `lib/constants.ts` — ~60 named tags covering every domain (`PROJECTS`, `MARKETPLACE`, `BORROWER_DETAILS`, `COMMUNITY_MEMBERS`, `AUDIT_TRAIL`, `OFFERS`, `NOTIFICATION_COUNT`, …). This keeps invalidation consistent.
- **Axios instances** (`lib/utils/httpClient.ts`):
  - `httpClient` — JSON client; base URL resolved at request time to `${API_URL()}/api`; **5‑minute timeout** (300 000 ms) to accommodate large financial‑document operations.
  - `fileHttpClient` — a `blob`/GET client for downloads.
  - Both are wired through `setupInterceptorsTo(...)` (encryption + auth/refresh — see §5).
- **Generated OpenAPI client** (`lib/utils/httpGen`, `typescript-axios`) — the typed API surface. Regenerated via:
  ```bash
  openapi-generator-cli generate -g typescript-axios \
    --additional-properties=prependFormOrBodyParameters=true \
    -o src/lib/utils/httpGen \
    -i https://starloanbackend.sterlingapps.p.azurewebsites.net/swagger/v1/swagger.json
  ```
  `api.ts` alone is ~20,000 lines. API classes are instantiated with `new XxxApi(undefined, API_URL(), httpClient)`.

---

## 12. Backend API Surface

**18 endpoint groups, 111 operations.** (Names are the generated method names; the underlying REST paths live under `${API_URL}/api/...`.)

| Group | Ops | Operations |
|---|---:|---|
| **AuthEndpoints** | 3 | `authLogin`, `authLogout`, `authRefreshtoken` |
| **PasswordEndpoints** | 4 | `authForgotpassword`, `authVerifyotp`, `authResetpassword`, `authChnagepassword` |
| **SignupEndpoints** | 3 | `signupInit`, `signupVerifyotp`, `signupComplete` |
| **OnboardEndpoints** | 4 | `onboardBorrower`, `onboardFinancier`, `onboardVerifybvn`, `onboardVerifytin` |
| **BorrowerEndpoints** | 6 | `borrowerAll`, `borrowerBusinessDetails`, `borrowerBusinessDetailsByTin`, `borrowerActivate`, `borrowerDeactivate`, `borrowersDeactivated` |
| **FinancierEndpoints** | 6 | `financierAll`, `financierDetails`, `financierDetailsByTin`, `financierActivate`, `financierDeactivate`, `financiersDeactivated` |
| **ProjectEndpoints** | 15 | `projectCreate`, `projectEdit`, `projectDelete`, `projectDelist`, `projectDetails`, `projectInfo`, `projectList`, `projectMarketplace`, `projectRecommendation`, `projectSelect`, `projectAccept`, `projectReject`, `projectRejected`, `projectRequestInfo`, `projectProvideInfo` |
| **FacilityTypesEndpoints** | 1 | `facilityTypesAll` |
| **SectorsEndpoints** | 9 | `sectorsAll`, `sectorsGet`, `sectorsCreate`, `sectorsRename`, `sectorsDeactivate`, `sectorsReactivate`, `sectorsAddinput`, `sectorsEditInput`, `sectorsDeleteinput` |
| **CommunityEndpoints** | 26 | `communityCreate`, `communityEdit`, `communityList`, `communityDetails`, `communityActivate`, `communityDeactivate`, `communityAddLeader`, `communityActivateLeader`, `communityDeactivateLeader`, `communityLeaders`, `communityAddMember`, `communityActivateMember`, `communityDeactivateMember`, `communityMembers`, `communityJoin`, `communityRequests`, `communityRejectRequest`, `communityGetRejeced`, `communityCreateOffer`, `communityEditOffer`, `communityOfferList`, `communityOfferSububscriberList`, `communityCheckAccount`, `communityCreateLoanAccount`, `communityDisburseLoanAccount`, `communityRepayLoan` |
| **MeetingEndpoints** | 4 | `meetingCreate`, `meetingCancel`, `meetingList`, `meetingInvites` |
| **MessageEndpoints** | 7 | `messageCreate`, `messageReply`, `messageRead`, `messageGet`, `messagesGet`, `messagesInbox`, `messagesCount` |
| **NotificationEndpoints** | 4 | `notificationsGet`, `notificationGet`, `notificationRead`, `notificationsCount` |
| **ApprovalEndpoints** | 3 | `aprovalPending`, `aprovalAccept`, `aprovalCount` |
| **PersonaEndpoints** | 10 | `personaAll`, `personaList`, `personaCreate`, `personaEdit`, `personaDeactivate`, `personaReactivate`, `personaPermanentDelete`, `personaMyCompany`, `personaMyprofile`, `personaUpdatemyprofile` |
| **DashboardEndpoints** | 2 | `dashboardData`, `dashboardSectorChart` |
| **AuditTrailEndpoints** | 2 | `auditTrailList`, `auditTrailDetails` |
| **FileEndpoints** | 2 | `fileUpload`, `fileGet` |

---

## 13. Validation Rules

All forms validate with **Yup** (`lib/schema/*`), reusing the XSS/name guards from §5.5. Notable, domain‑specific rules:

**Auth**
- Email: strict regex `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`.
- Password (set/reset/new‑user): 8–32 chars **and** must contain lower + upper + digit + special (`!@#$%^&*`).
- **TIN** (signup): 13–15 chars incl. dash, format `XXXXXXXX-XXXX` (8–10 digits, dash, 4 digits).

**Borrower onboarding**
- **BVN:** exactly **11 digits**.
- Shareholder: units held & % held positive numbers; position (no‑XSS); board‑representation required.
- Director/Management: name, DOB, ≥1 work experience (place + position), ≥1 education entry (school + qualification + year); director investment detail (loan exposure + other investments).

**Financier onboarding**
- Contact name & position (valid‑name), **contact phone exactly 11 digits**, contact email (strict), ≥1 document.

**Project**
- Name/description/purpose (no‑XSS), facility type required, **facility amount** must not start with `0`, **tenor** positive integer, moratorium & domiciliation (no‑XSS), **equity contribution** 0–100 (no leading zero), **source of repayment** letters/limited punctuation only.
- Business risk: perceived risk + consequences + mitigating factors (all no‑XSS).

**Community**
- New community: name + description (no‑XSS).
- Offer (publish/edit): name (no‑XSS), tenor (months), interest rate (%).
- Loan application: address, phone, DOB (auto‑transformed `dd/mm/yyyy → yyyy/mm/dd`), nationality, state of residence, landmark, positive amount; then BVN + TIN + monthly salary.
- Disburse: loan amount required.

**Advisory**
- Meeting: subject (no‑XSS), ≥1 guest (type + id), date **not in the past**, duration, link (**safe http/https URL**).
- Message: subject ≥5 chars, body ≥5 chars (both no‑XSS); reply body required.

---

## 14. UI Component Library

~238 components across ~30 folders. Highlights:

**Foundational primitives (`components/`)** — `Button`, `IconButton`, `Badge`, `Checkbox`, `RadioButton`, `Select`, `SearchInput`, `InputFields`, `InputScaffold`, `Dialog`, `Backdrop`, `Tooltip`, `Progress`, `Spinner`, `LoadingIndicator`, `LoadingBackdrop`, `LoadingContent`, `EmptyState`, `Pagination`, `PaginatedLayout`, `Tab`/`Tabs`, `Card`, `ItemCard`, `MenuDropdown`, `UserDropdown`, `NotificationButton`, `OTPInput`, `OTPTimer`, `SuccessAnimation` (Lottie), `Terms`.

**Layouts & shell** — `AppLayout`, `AuthLayout`, `OnBoardingLayout`, `OnboardingSteps`, `Header`, `Sidebar` / `SidebarResponsive` / `SidbarSection` / `SidebarSectionItem`, `ApproveLayout`, `MarketplaceLayout`, `MarketplaceHeader`.

**Stepper system** — `Stepper`, `Step`, `StepButton`, `StepIcon`, `StepLabel`, plus `OnboardingStepper`.

**Document handling** — `DocumentUploadInput`, `DocumentUploadItem`, `DocumentItem`, `LoanAccountFilesUpload`, `LoanUpload` (react‑dropzone based).

**Feature suites** — `Borrower` (8), `BorrowerOnBoarding` (11), `Financier` (4), `FinancierOnBoarding` (4), `ProjectsOnMarketplace` (10), `ProjectAcceptanceChecklist` (7), `MarketPlace` + `MarketPlaceBorrowerDetails` (14), `Communities` (20), `AdvisoryServices` (12), `Sector` (5), `UserManagement` (3), `Notification` (2), `Reactivation` (2), `Landing` (8), plus `Alert`, `Modals`, `Dropdown`, `RegSuccess`, `ResetPasswordInput`, `AuthUserUIPermission`, `Settings`, `Tabs`, `Card`.

---

## 15. Design System & Styling

> 🔄 **SFMP rebrand:** the current palette/logo set below stays as the technical baseline, but branding is moving to **SFMP** — Sterling × CBN references and partner logos are removed, "Powered by Sterling" is retained, and the UI is aligned to SFMP brand guidelines. See [§20.1](#201-rebrand-sterloan--sterling--cbn--sfmp).

`tailwind.config.js` defines the design tokens:

- **Font:** Inter (loaded via `next/font/google`, weights 100–900; sans/serif/mono all map to Inter).
- **Primary brand:** `#01E092` (mint/teal green) — `light #CCFAE7`, `dark #01BB7A`, `pale #CFFCF4`.
- **Secondary:** `#344054` (slate). **Body text:** `#344054`.
- **Semantic:** error `#FB5555`, warning `#ed6c02`, success `#CCFAE7`/`#90FECF`, info `#0288d1`.
- **Action tokens:** hover/selected/disabled/focus overlays, plus a modal **backdrop** `rgba(52,64,84,0.6)` with `blur(16px)`.
- **Backgrounds:** `landingBackground #F8FDFC`, `getStartedbg #CFFCF4`.
- **Custom breakpoint:** `xs: 375px`; extra widths (`98 = 32rem`, `vw`, `vw4 = 60vw`).
- **Typography plugin:** utility classes `text-h1`…`text-h5`, `text-paragraph`, `text-label`, `text-small` with fixed sizes/line‑heights (e.g. `text-h1` = 65px/78px bold).

Global CSS: `styles/globals.css`; module CSS `styles/Home.module.css`. SVGs are importable as React components via **SVGR** (`next.config.js` webpack rule).

---

## 16. Routing Map

60 route files (Pages Router). **Navigation is role‑gated** (`Sidebar.tsx` → `NAVIGATION_ITEMS`, each wrapped in `AuthUserUIPermission`):

| Nav item | Path | Visible to |
|---|---|---|
| Dashboard | `/dashboard` | everyone (authenticated) |
| My Financiers | `/financier` | Borrower (Root/Authorizer/Initiator) |
| My Borrowers | `/borrower` | Financier (Root/Authorizer/Initiator) |
| Financiers | `/financier` | Admin (all) |
| Borrowers | `/borrower` | Admin (all) |
| Sectors | `/sectors` | Admin (all) |
| Projects › On Marketplace | `/projects/on_marketplace` | Borrower (all) |
| Projects › Selected/Accepted/Rejected | `/projects/*` | everyone |
| Projects › Recommended | `/projects/recommended` | Admin + Financier |
| Advisory › Messages / Meetings | `/advisory/*` | Admin/Borrower/Financier (Root + Initiator) |
| User Management | `/user_management` | Root roles only |
| Settings | `/settings` | everyone |
| Approvals | `/notification` | Root + Authorizer roles |
| Audit Trail | `/audit` | Admin (all) |
| *(Communities)* | `/communities` | *commented out in nav* |

Public routes: `/` (landing), `/faqs`, `/privacy`, all `/auth/*`. Middleware‑guarded prefixes: `/borrower`, `/dashboard`, `/financier`, `/projects`, `/settings`.

---

## 17. Build, Docker & CI/CD

### Build

- `next build` with **`output: "standalone"`** — produces a self‑contained server bundle for small Docker images.
- Scripts: `dev`, `build`, `start` (`next start -p ${PORT:=3000}`), `check-types` (tsc), `check-format` (prettier), `check-lint` (eslint), `format`, `test-all` (format + lint + types + build), `cm` (git‑cz commit), `prepare` (husky install).

### Docker (`Dockerfile`)

Three‑stage `node:20-alpine` build:
1. **deps** — `yarn install --frozen-lockfile` (adds `libc6-compat`).
2. **builder** — copies source, `yarn build`.
3. **runner** — non‑root user `sterlaon` (uid 1001), copies `public/`, `.next/standalone`, `.next/static`; `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`, exposes `3000`, runs `node server.js`.

`.dockerignore` keeps `node_modules`/`.next` out of context.

### CI/CD (`.github/workflows/`)

- **`pull_request.yml`** — on PRs to `main`/`staging`/`develop`: Node 20 → `yarn install --frozen-lockfile` → `yarn build` (build gate).
- **`deploy_staging.yml`** — on push to `staging`: build & push Docker image `hubuk/ster_frontend:staging` → **SSH** to the host and `docker compose pull/stop/up sterloan_frontend_staging` → **Slack** notify `#sterling-loan-platforn`.
- **`deploy_production.yml`** — on push to `main`: build & push `hubuk/ster_frontend:production` → Slack notify. (No SSH deploy step in this file — production rollout appears to happen out‑of‑band.)

**Secrets used:** `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SSH_HOST`, `SSH_USERNAME`, `SSH_PRIVATE_KEY`.

**Branching (Gitflow):** `main` (production), `staging`, `develop`.

---

## 18. Developer Tooling & Conventions

- **TypeScript:** strict, `baseUrl: src` (absolute imports like `lib/…`, `components/…`), `noEmit`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `isolatedModules`, source maps.
- **ESLint:** `plugin:react/recommended` + `google` + `next/core-web-vitals` + `prettier`; `@typescript-eslint` parser; custom `new-cap` exceptions for the config‑getter functions (`API_URL`, `JWT_KEY`, …).
- **Prettier:** LF line endings, print width 80, 2‑space tabs, ES5 trailing commas.
- **Husky pre‑commit:** runs **format → lint → types → build** and blocks the commit on any failure (with playful messaging).
- **Commitizen** with **Jira‑aware conventional changelog** (`@digitalroute/cz-conventional-changelog-for-jira`) via `yarn cm` — commits reference Jira tickets.
- **Editor config:** `.idea/` (JetBrains, incl. code style) and `.vscode/` (`launch.json`, `settings.json`).
- **Logging:** Pino logger named `sterloan` at `debug` level.

---

## 19. Engineering Review & Observations

An honest read of the "nitty gritty." None of these block functionality, but they're worth knowing.

**Strengths**
- **Serious security posture** for a fintech: double‑layer (message‑level AES + TLS) encryption, cookie‑stored tokens with `sameSite=strict`, robust refresh‑with‑queue, activity‑based session expiry with server‑side logout, pervasive XSS validation + DOMPurify, non‑root Docker user.
- **Clean separation of concerns:** generated API client, centralised cache tags, composable Zustand slices, role‑driven UI gating via a single reusable component.
- **Strong CI hygiene:** build gate on PRs, full pre‑commit quality gate, conventional commits tied to Jira.
- **Domain depth:** the project‑finance appraisal model and community‑lending flows are thorough and clearly modelled.

**Things to flag**
- **Sensitive values committed to the repo:** the **Slack incoming‑webhook URL** is hard‑coded in both deploy workflows, and the **backend Azure hostname** is embedded in `README.md`. Webhooks in particular should be moved to GitHub Secrets and rotated.
- **Client‑exposed "encryption":** `ENCRYPTION_KEY`/`ENCRYPTION_IV` are shipped to the browser via `/api/config`. Message‑level AES here is effectively **obfuscation, not confidentiality** against a determined client‑side attacker (the key is retrievable). It still raises the bar and protects against passive intermediaries, but shouldn't be treated as end‑to‑end encryption.
- **`deCryptedData` in `encrypt.ts`** constructs `CipherParams` with several irrelevant/incorrect fields (random `salt`, `blockSize: 4`, `NoPadding`) — it works because only `ciphertext` matters for the subsequent `AES.decrypt`, but it's confusing and fragile.
- **State bugs (minor):**
  - `store/notification.ts` → `setNotificationCount` sets `{ count }` instead of `{ notificationCount }`, so the counter it exposes never actually updates.
  - `store/borrower.ts` → `addAnalysisDocument(documentPath)` ignores its argument and hard‑codes a filename (`"sterloan_637921846391307246.jpeg"`) — almost certainly leftover debug code.
  - `editBorrowerOwner/Director/Management` re‑append the edited item to the **end** of the array (filter‑then‑push), changing ordering on edit.
- **Two form libraries** (React Hook Form **and** Formik) plus **two lockfiles** (`yarn.lock` **and** `package-lock.json`) coexist — likely an in‑progress migration and a mixed npm/yarn history; worth consolidating.
- **Validation copy mismatch:** the signup TIN message says "max 13 digits" while the rule allows up to 15 chars (`.max(15)`); several user‑facing strings have typos (e.g. `Messsage`, `morotorium`, `bussiness`, `Percieved`, `Sububscriber`, `aproval`) — some of these typo'd names are baked into the generated API methods, so they can't be fixed without a backend contract change.
- **Middleware uses `NextResponse.rewrite`** to the login page for unauthenticated users, so the browser URL doesn't change to `/auth/login` (a redirect might be the more expected UX).
- **`react-query` v3** and **Formik/Yup 0.32** are older major lines; a future upgrade to TanStack Query v5 and current Yup would modernise the data/validation layers.

> 🔄 **Note:** several of the items above are now explicitly addressed by the SFMP "Default‑Adherence Standards" — no client‑side secret keys, dynamic (non‑reused) IVs, disabling Swagger outside QA, and AES‑**256** at rest. See [§20.7](#207-default-adherence-standards-non-functional) and the code‑mapping in [§20.8](#208-impact-on-this-codebase-as-built--sfmp).

---

## 20. SFMP Enhancement — Branding & Onboarding Update

> 🔄 **New section — added from the user‑story suite *"Enhancement of SFMP Branding and Onboarding."*** This documents the **approved change set**, not (yet) the state of the `staging` code. Sections 1–19 remain the as‑built reference; [§20.8](#208-impact-on-this-codebase-as-built--sfmp) maps each change onto the current codebase.

| Field | Detail |
|---|---|
| **Component** | Sustainable Finance Marketplace (SFMP) |
| **General description** | Optimisation of the onboarding and application process of the SFMP platform |
| **Target audience** | Developers · QA Testers · Product Managers |
| **Date created** | 07 April 2026 |
| **Created / Reviewed / Approved by** | Olusile Falusi · Oluwarotimi Adeyanju · Oluwaseyi Okunnuga |
| **Classification** | **CONFIDENTIAL** — Sterling Bank. Do not forward/copy without permission; restrict to the Access List; password‑protect if emailed externally. |

### 20.1 Rebrand: Sterloan / Sterling × CBN → SFMP

- Remove **all "Sterling X CBN" references** and replace them with **Sustainable Financial Market Place (SFMP)**.
- **Retain "Powered by Sterling"** (regulatory requirement).
- Remove all **Sterling logos and existing partner logos (e.g. CBN)**; replace with the **SFMP logo**.
- Align the interface to **SFMP brand guidelines**, changing things only where the guidelines diverge from work already done.

*Directly affected in current code:* the footer string *"Proudly Powered by Sterling Bank and CBN"* (`components/ApproveLayout`), the landing **Our Partners** logos, and the partner assets in `public/` (`CBN_Logo.png`, `Access.png`, `GTIcon.png`, `FidelityIcon.png`, `UBA.png`, `SterLoanLogo.png`).

### 20.2 Facility-Type Model (renewable-energy focus)

The platform now positions around **sustainable / renewable‑energy financing**.

- **Industry categories** (admin‑configurable; only previously‑configured ones appear to applicants): **Health, Education, Agriculture, Renewable Energy, Transport, Others.**
- The **"Selected Sector" label is replaced by "Facility Type"** across **all borrower / financier / admin** interfaces (the application speaks to one sector type for now).
- **Facility types** (for the renewable‑energy sector) with mandatory nomenclature tooltips on the dropdown:

| Facility Type | Tool‑tip |
|---|---|
| **Solar Home System** | For solar vendors to scale deployment through aggregated demand, offering lease‑to‑own or pay‑as‑you‑go options while the Bank funds the vendors. |
| **Commercial and Industrial Projects** | A structured financing solution for renewable‑energy transition for commercial and industrial companies. |
| **Isolated Mini Grid Projects** | For rural electrification with repayments tied to project cashflows. |
| **Interconnected Mini Grid Projects** | For interconnected mini‑grids that enhance grid reliability using distributed renewable energy integrated with existing DISCO infrastructure and billing systems. |

- **Facility types and project‑detail fields are admin‑configurable per sector**; the Details page renders **only what the admin has configured**.

### 20.3 Borrower — Project Creation UX (updates §9.6)

Flow: **Projects → On Market Place → Create New Project → select sector → Continue.** The application page has three segments — **Details**, **Supporting Document**, **Additional Details**.

- **Details** fields: Name of Project, Project Description, **Facility Type**, Facility Amount, Purpose, Tenor, Moratorium Requirement, Domiciliation Arrangement, Equity Contribution, Source of Repayment.
- **Equity Contribution rule:** tool‑tip reads *"minimum of 20% contribution"*; a value **below 20** is rejected gracefully with *"enter a value from 20."* *(Current code validates 0–100; the update raises the floor to 20.)*
- **Supporting Documents page:** carries a **Facility Type header** and a **back arrow** (to change facility type); one **upload field per supporting‑document section**; **"Other" allows multiple uploads**; each document's description is shown via the **info‑icon tool‑tip / accordion** (kept off‑screen for tidiness).
- **Validation:** attempting to submit with any missing field **highlights the missing fields** and directs the user to complete them.
- **In‑progress save:** if the application **times out** mid‑creation, the system **saves progress** and lists it under Projects with an **"in progress" icon.** *(Ties directly to the existing 5‑minute session timeout — see §7.)*
- **Categorisation:** all uploaded documents are filed under the section chosen at upload.

### 20.4 Mandatory Documents by Facility Type

The supporting‑document taxonomy becomes **facility‑type‑specific**. Two new document sections appear alongside the existing set: **Inherent Risk** and **Critical Success Factors** *(Hubuk to rename)*.

| Document | Solar Home System | Commercial & Industrial | Isolated Mini Grid | Interconnected Mini Grid |
|---|:--:|:--:|:--:|:--:|
| Memorandum & Articles of Association | ✅ | ✅ | ✅ | ✅ |
| CAC status report | ✅ | ✅ | ✅ | ✅ |
| Audited financial statements | ✅ (min 3 yrs, where available) | ✅ (2–3 yrs) | — | — |
| Management accounts | — | ✅ (where applicable) | — | — |
| Business plan | ✅ (incl. customer pipeline) | — | ✅ (feasibility + business plan) | ✅ (feasibility + project business plan) |
| Use‑of‑proceeds breakdown | ✅ | — | — | — |
| Vendor quotation / system specs | ✅ | — | — | — |
| Distribution network & operational capacity | ✅ | — | — | — |
| Energy audit / load assessment | — | ✅ | ✅ (load + demand analysis) | ✅ (load + network analysis) |
| Technical system design & specifications | — | ✅ | ✅ | ✅ (design + integration plan) |
| EPC / developer agreement | — | ✅ | — | — |
| Corporate governance structure | — | ✅ | — | — |
| Community engagement agreements (Exclusivity, PPA, Deed of Assignment) | — | — | ✅ | — |
| Interconnection agreement with DISCO | — | — | — | ✅ |
| Power Purchase Agreement (PPA) / service agreement | — | — | — | ✅ |
| Tariff model & regulatory approvals | — | — | ✅ (where applicable) | ✅ |
| Developer track record & management CVs | — | — | ✅ (or any document evidencing this) | ✅ |
| Grant status / REA grant approval | — | — | ✅ | — |
| Financial model demonstrating viability | — | — | ✅ | ✅ |
| **Others** | ✅ | ✅ | ✅ | ✅ |

### 20.5 Messaging — Search & Date Filter (updates §9.10)

- **Inbox** and **Sent** each gain a **date filter** and a **search bar**.
- Messages are **paginated**, and **search/date filter query the database** (not just the current UI page).
- Search is **value‑based** (e.g. `"financier"`, `"Hubuk"`, `"50000"`) — not limited to role, name, amount, or time.

### 20.6 Admin — Sector Configuration (updates §9.5)

All sector work follows the **maker‑checker** model: the **admin initiator** creates/edits and saves on their own view; nothing reaches borrower/financier/admin‑authoriser views until the **admin authoriser** approves it from their queue.

**Create New Sector**
1. Admin → **Sector** → **Create New Sector** → enter sector **name** → add a **list of facility types** → save.
2. The new sector appears **only on the admin‑initiator list**.
- Facility Types are input fields with an **Add More** function.
- A sector is routed to the authoriser **only after** it has been further edited with **project‑detail fields**; it becomes visible on the borrower workflow **only after authoriser approval**.

**Edit Existing Sector** — returns four segments: **Facility Type, Project Details, Supporting Documents, Additional Requirement.** In each, the admin can **Add / Edit / Delete** fields.
- **Add field** form: **Field Name · Section · Description · Field Type** (Text, Document, Number, Percentage).
- **Edit** re‑opens the form pre‑filled; **Delete** shows a **confirmatory modal** and holds the request until the initiator completes all segments.
- Changes are **saved per segment** ("Save and Continue") but only **sent for approval on "Submit Changes"** (end of form), and only **reflect on other views after authoriser approval**.
- **Field routing after approval:** **Text / Number / Percentage** fields stay in the section selected at creation (or the original section, if an edit didn't change it); **Document** fields are retained in the **Supporting Document** segment.
- **Section field UX:** a combo control accepting **free input *and* a dropdown of previously‑entered sections** (selecting one autofills it); a **new value is registered as a new section option**.
- **Value‑based search** is available on each segment/page; **field descriptions render as an info accordion** across all interfaces.

**Edit New Sector** (publishing a just‑created sector)
1. Select the newly created sector → four segments as above.
2. **Facility Type** → add facility type(s) (**Add More**) → **Save and Continue**.
3. **Project Details** → **Add Project Details** (Field Name · Section · Description · Field Type) → add as many as needed → **Save and Continue**.
4. **Additional Requirements** preview (a **default additional field** exists after creation) → **Submit Change** → routed to the **admin‑authoriser approval queue.**

### 20.7 Default-Adherence Standards (non-functional)

A baseline set of security, logging, usability and validation standards the platform must meet (from *Section 4* of the user story). Several were **already implemented** in this frontend (marked ✅ *implemented*); others are **backend/DevOps** concerns.

| Area | Requirement (summary) |
|---|---|
| **Login** | Valid credentials → dashboard; wrong password → "Invalid credentials"; unknown user → "User does not exist"; blank fields → required‑field prompt; **biometric** login where applicable; **re‑login required after logout even via the back button.** |
| **2FA** | Second factor via **Sterling OneToken PIN** after credentials; invalid PIN denies login; **admin features require a second factor.** *(✅ a `verify-2fa` step exists.)* |
| **Session** | **5‑minute inactivity timeout**; back‑button after timeout still requires fresh login; secure logout with no session restore. *(✅ implemented — see §7.)* |
| **Exception logging** | All exceptions logged to **file path + MongoDB**, with **ElasticSearch** for real‑time access. Format: `refID │ Error Code │ Error Description │ Exception │ AffectedPage │ Module │ DateTimeAdded`. *(Frontend uses `pino`; the store is a backend concern.)* |
| **Audit trail** | All user actions recorded (**MongoDB**), viewable via audit path. Format: `ClientMachine IP │ Username │ ApplicationModuleName │ ActivityDescription │ DateCreated │ OtherFields`. *(✅ audit UI exists — see §9.15.)* |
| **Encryption (at rest)** | Passwords, OTPs, 2FA tokens and **BVNs** encrypted in the database; standard = **AES‑256.** |
| **Usability** | Responsive across mobile / tablet / desktop / large (projector) screens; proper alignment & padding; inputs constrain text (no overflow); legible contrast; consistent colours/fonts/spacing; visually distinct buttons/icons; responsive with minimal loading. |
| **Injection** | User input sanitised; SQL/script‑injection attempts rejected and (server‑side) logged. *(✅ frontend XSS guards + DOMPurify — see §5.5.)* |
| **Token auth** | Robust auth; valid logins succeed, invalid fail; **account lockout after multiple failed attempts.** |
| **Access control** | **Role‑based access control** blocks unauthorised actions. *(✅ implemented — see §6.)* |
| **Security config** | No default passwords; proper **HTTP security headers**; **no hardcoded secret keys in client‑side JS**; **env vars + secure key management**; **generate/manage IVs dynamically, no IV reuse**; **disable Swagger/OpenAPI on non‑QA environments.** |
| **Data validation** | Email standard format; **phone** = 11 digits (non‑country‑code) / 10 digits (country‑code‑prefixed); **account number** = 10 digits; validate against real vs invalid **Sterling Bank account numbers.** |

### 20.8 Impact on this Codebase (as-built → SFMP)

How the update lands against the current `staging` code documented in §§1–19:

| Current behaviour (as‑built) | SFMP change |
|---|---|
| Footer *"Powered by Sterling Bank and CBN"*; CBN/partner logos in `public/`; `SterLoanLogo.png`; product name "Sterloan" | Rebrand to **SFMP**; drop Sterling×CBN + partner logos → SFMP logo; **keep** "Powered by Sterling" ([§20.1](#201-rebrand-sterloan--sterling--cbn--sfmp)) |
| **12 hard‑coded appraisal‑document constants** (`…SupportingDocumentConstants.tsx`) shared across projects | **Admin‑configurable, per‑facility‑type** document sections; add **Inherent Risk** + rename **Critical Success Factors** ([§20.4](#204-mandatory-documents-by-facility-type)) |
| Project step 1 labelled **"Select sector"**; `sectorId` in the project store | Relabel to **"Facility Type"** everywhere; drive from admin‑configured facility types ([§20.2](#202-facility-type-model-renewable-energy-focus)) |
| Equity contribution validated **0–100 %** (`project.schema.ts`) | Enforce **minimum 20 %** with tool‑tip + "enter a value from 20" ([§20.3](#203-borrower--project-creation-ux-updates-96)) |
| No message search/filter (React‑Query tags `INBOX`/`SENT`/`MESSAGES` only) | Add **date filter + server‑side value search + pagination** ([§20.5](#205-messaging--search--date-filter-updates-910)) |
| No draft persistence for project creation | **Auto‑save in‑progress** on timeout; show an **"in progress"** project state ([§20.3](#203-borrower--project-creation-ux-updates-96)) |
| Sector fields added/edited via existing dialogs | **Typed field form** (Text/Document/Number/Percentage), **combo Section selector**, per‑segment search, tightened **maker‑checker** gating ([§20.6](#206-admin--sector-configuration-updates-95)) |
| **AES‑128‑CBC** payload encryption with a **static IV**, `ENCRYPTION_KEY`/`IV` served to the browser via `/api/config` (flagged in §19) | **AES‑256**, **dynamic per‑operation IVs (no reuse)**, and **no secret keys in client‑side JS** ([§20.7](#207-default-adherence-standards-non-functional)) |
| `verify-2fa` page present (generic) | Standardise on **Sterling OneToken**; add **login lockout** and **biometric** (where applicable) ([§20.7](#207-default-adherence-standards-non-functional)) |
| Backend swagger publicly reachable (client is generated from it) | **Disable Swagger on non‑QA** environments ([§20.7](#207-default-adherence-standards-non-functional)) |
| Frontend logging via `pino` | Backend exception logging to **Mongo + ElasticSearch**; standardised audit/exception log formats ([§20.7](#207-default-adherence-standards-non-functional)) |

*Copyright © Sterling Bank 2024.*

---

*Generated from a full static read of the `staging` branch source: configuration, middleware, security/auth utilities, all Zustand stores, interfaces, Yup schemas, hooks, the generated OpenAPI client (18 groups / 111 operations / 145 DTOs), the complete page tree, the component inventory, the Tailwind theme, and the CI/CD + Docker setup. §20 added from the "Enhancement of SFMP Branding and Onboarding" user‑story suite (approved 07 Apr 2026); §§1–19 unchanged.*

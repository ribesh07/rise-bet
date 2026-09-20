# Admin Panel Specification — RiseBet Separate Admin App

## Problem

RiseBet currently has no admin backend UI. Business operators need a dedicated,
separate web application to manage the betting platform: view users, transactions,
games, bets, promotions, affiliates, VIP tiers, site settings, and support,
with role-based access control (admin / superadmin).

The admin panel must be completely separate from the customer-facing RiseBet
Next.js app so it can be deployed, scaled, and secured independently. Docker is
used to orchestrate both containers plus a shared network so they can
communicate over internal hostnames.

## Users

- **Superadmin** — Full access: user CRUD, role management, system settings,
  game RTP configuration, finances, promotions approval.
- **Admin** — Moderate users, view transactions, approve KYC, manage
  promotions & affiliates, respond to tickets. No role or RTP changes.

## Goals

1. Deliver a fully functional, dockerized admin Next.js application living in
   a new top-level `admin/` folder, completely isolated from `app/` (RiseBet
   frontend code).
2. Provide every core page a betting platform admin typically needs, backed
   by a data layer that reads/writes via the shared backend API
   (NEXT_PUBLIC_API_BASE_URL).
3. Provide a `docker-compose.yml` that spins up:
   - `risebet-frontend` — existing customer app on port 3044
   - `risebet-admin`    — new admin panel on port 3045
   - optional database/redis placeholders for future
4. Authentication: login page + JWT bearer token stored in admin-only
   localStorage; protected routes with redirect; logout.
5. Luxury dark + gold aesthetics matching the RiseBet brand (glassmorphism,
   Framer Motion animations, responsive).

## Non-Goals

- Not building the backend API itself — admin panel calls existing endpoints
  via `NEXT_PUBLIC_API_BASE_URL` (same API used by RiseBet) and falls back to
  mock/demo data when endpoints aren't available (so UI is always shippable
  and demo-able).
- Not implementing real-time game administration controls (start/stop round,
  force result) — those are shown as read-only dashboards with future
  placeholder buttons.
- Not implementing payment gateway webhook handling in admin UI.
- Not multi-tenant / white-label.

---

## Functional Requirements

### FR-1  Separate Project Structure
- A new top-level folder `admin/` exists in the repo, independent of the
  customer-facing `app/` and `components/`.
- `admin/` is its own Next.js project: has its own `package.json`,
  `next.config.ts`, `tsconfig.json`, `.env.example`, `Dockerfile`.
- No imports cross `admin/` ↔ root `app/` boundaries (no `@/components/...`
  from the root project used inside `admin/` — admin has its own components).

### FR-2  Docker Orchestration
- Repo root contains a new `docker-compose.yml` defining two services:
  - `risebet-frontend` — built from root `Dockerfile`, port `3044:3044`
  - `risebet-admin`    — built from `admin/Dockerfile`, port `3045:3045`
- Both services share a user-defined bridge network.
- Admin container can reach the backend API via `NEXT_PUBLIC_API_BASE_URL`
  env var (passed through compose).
- `docker compose up` from repo root must start both services successfully.

### FR-3  Admin Auth
- `/login` page: email + password form → POST `/admin/login` (or fallback
  mock login).
- JWT token stored only in `admin` app localStorage under key
  `admin_token`.
- Protected route wrapper redirects unauthenticated requests to `/login`.
- Logout button in top navbar clears token + returns to login.
- Role badge (Admin / Superadmin) displayed in user menu.

### FR-4  Dashboard / Overview
Route: `/` (protected)
- KPI cards: Total Users, Active Users Today, Total Bets (24h), Total Wagered
  (24h), Net Revenue (24h), Pending Withdrawals count, Deposits (24h).
- Charts: Daily Revenue (7-day line), Game Popularity (bars), Recent Bets
  feed, Top Winners table.
- Quick action buttons to Users, Transactions, Promotions.

### FR-5  User Management
Route: `/users` + `/users/[id]`
- Paginated, searchable, filterable users table: username, email, status,
  KYC status, balance, VIP level, registration date, last login.
- Filters: role, status (active / banned / suspended), KYC, VIP tier,
  date range.
- Row actions: View details, Ban / Unban, Reset password, Edit profile,
  Adjust balance (credit / debit modal with note), Toggle KYC status.
- User detail page (`/users/[id]`): profile card, balance history, bet
  history, deposits/withdrawals, KYC docs, notes timeline, action buttons.

### FR-6  Transactions / Finances
Route: `/transactions` with tabs
- Deposits tab: amount, method, status, user, timestamp, actions (approve /
  reject for manual methods).
- Withdrawals tab: amount, method, status, user, wallet address, actions
  (approve / reject / mark paid).
- Bonuses tab: bonus type, amount, user, claimed at, source (promotion /
  rakeback / manual).
- Raffles & Races tabs: events, prize pool, winners.
- Others: generic ledger entries.
- All tables: date range filter, status filter, export CSV button.

### FR-7  Bets & Games
Route: `/bets` + `/games`
- Bets table: game type, user, amount, multiplier, result (win/loss),
  timestamp, profit/loss, search/filter by game, user, date range.
- Games page: catalog of all 23 games with status toggle (active / disabled),
  RTP display, number of bets (24h), volume (24h), edit modal (name,
  category, status, RTP placeholder).
- Per-game live stats: players, bets, volume — click-through.

### FR-8  Promotions
Route: `/promotions`
- Promotions list table: title, type (bonus / freespin / cashback / raffle),
  start date, end date, status (draft / active / expired), claimed count.
- Create / Edit promotion form with fields: title, description, image, type,
  bonus amount, wagering requirement, eligible tiers, start/end dates.
- Banner toggle and sort order.

### FR-9  Affiliates
Route: `/affiliates`
- Affiliates table: username, referral code, referrals count, commission
  rate, total earned, pending payout, status.
- Commissions overview: period, total commission, paid / pending.
- Campaigns: list, edit, performance.
- Payout queue: approve / mark paid.
- FAQ: CRUD editor.

### FR-10  VIP Program
Route: `/vip`
- Tier list (1..N): name, min wagering requirement, cashback %, rakeback %,
  weekly bonus, exclusive perks.
- Add / Edit tier form.
- Per-tier user count + total wagered summary cards.
- VIP progress: users approaching next level watchlist.

### FR-11  Responsible Gambling
Route: `/responsible-gambling`
- Self-exclusion list: user, reason, start date, end date, status, action
  (reactivate early / extend).
- Cooling-off requests: same pattern.
- Deposit limits: per-user overrides view.
- Responsible gambling content editor (3 sections + FAQs).

### FR-12  Blog
Route: `/blog`
- Posts list: title, author, category, published, views, status.
- Create / Edit: title, slug, category, featured image, content
  (textarea/richtext placeholder), publish toggle.
- Categories CRUD: name, slug, post count.

### FR-13  Forum / Community
Route: `/forum`
- Redirects to Telegram (configurable URL) setting page — shows config
  inputs for Telegram URL, Discord URL, Twitter, with test links.

### FR-14  Support Tickets
Route: `/support`
- Tickets table: id, user, subject, category, priority (low/med/high),
  status (open / in-progress / resolved / closed), assignee, opened.
- Detail view: conversation thread, internal notes, assign, change status,
  reply box, close ticket.

### FR-15  Settings
Route: `/settings` with tabs
- Account: admin profile, email, change password.
- Security: 2FA toggle (placeholder), active sessions, API keys list
  (placeholder).
- Verification: KYC verification queue, approve/reject.
- Preferences: theme (dark/light), currency display, timezone, language.
- Offers: bonus offers toggle, default values.
- Site Settings: site name, logo upload (placeholder), SEO meta, support
  email, active currencies, maintenance mode toggle.

### FR-16  System / Logs
Route: `/logs`
- Recent activity log: action, actor, target, IP, timestamp.
- Error log viewer: message, stack preview, endpoint, time, severity.
- Audit log entries from all admin actions (placeholder).

### FR-17  UI/UX & Layout
- Fixed sidebar navigation with all routes listed + icons (lucide-react).
- Top navbar: search, notifications dropdown, admin user dropdown, role
  badge, logout.
- Mobile: sidebar collapses to drawer, bottom nav, responsive tables.
- Design language: dark theme (`#0f1420`, `#1a2c38`) with gold accents
  (`#D4AF37`, `#FFD700`) matching RiseBet luxury glassmorphism.
- Framer Motion entrance animations on every page.
- Toasts for success / error (react-hot-toast).
- Confirmation modals for destructive actions (ban user, delete promo,
  reject withdrawal).

---

## Non-Functional Requirements

### NFR-1  Build & Type Check
- `admin/` TypeScript `strict: true` passes `tsc --noEmit`.
- `npm run build` inside `admin/` produces a valid Next.js build with no
  TypeScript errors (unused var warnings acceptable for placeholders).

### NFR-2  Independence
- Admin project shares no source files with the root RiseBet project.
  Everything admin needs lives under `admin/` (components, lib, types,
  hooks).

### NFR-3  Graceful API Failures
- Every data-loading page has: loading skeleton, empty state, and error
  state with retry. When backend is unavailable, pages render mock data so
  UI is demonstrable.

### NFR-4  Security Hygiene
- Tokens stored only in localStorage; never printed to console in
  production.
- Pages don't leak admin-token to any browser extension-friendly
  `console.log`.

### NFR-5  Docker Reproducibility
- Fresh clone → `docker compose up` runs both services without manual step
  beyond environment variables.

### NFR-6  Responsive
- Every page is usable at 375px width (mobile), 768px (tablet), 1280px+
  (desktop). Tables horizontally scroll on mobile.

---

## Constraints & Dependencies

- **Shared API:** Admin uses the same `NEXT_PUBLIC_API_BASE_URL` as the
  frontend. If endpoints like `/admin/users` don't exist yet, admin ships
  with well-structured mock data adapters that are easy to swap to real
  endpoints later.
- **Docker availability:** Assumes Docker Engine is installed on the host.
- **Tech stack fixed:** Next.js 15, React 19, TypeScript strict, Tailwind 4,
  Framer Motion, lucide-react, react-hot-toast (admin brings its own
  dependencies; no version tie to root unless identical by choice).

## Assumptions

- Backend already exposes or will expose admin-scoped endpoints under
  `/admin/*` guarded by admin JWT. UI is built to interface with those once
  available, falling back to typed mock data now.
- Two roles (Admin / Superadmin) are enough for V1.
- RiseBet frontend continues to operate as-is on port 3044; admin is added
  beside it on 3045.

## Open Questions (for user before implementation)

1. **Backend admin endpoints:** Do you have an existing admin API surface
   (e.g., `/admin/users`, `/admin/transactions`) we should target, or shall
   we ship with mocked data + ready-to-swap request shapes?
2. **Auth scheme:** Same JWT issuer as frontend user auth (role field in
   token), or separate admin-only `/admin/login`?
3. **Database in compose:** Include Postgres + Redis services in
   `docker-compose.yml` (with placeholder env vars) so backend can be
   added later, or keep compose minimal (frontend + admin only)?
4. **Primary color tone:** Confirm same luxury gold-on-dark as RiseBet
   main site (assumed "yes" based on user preferences).

---

## Acceptance Criteria

All ACs are typed explicitly as either `rule` (binary pass/fail) or
`rubric` (graded with threshold).

### Rule ACs

- AC-01 `rule`
  Pass condition: A top-level folder `admin/` exists and contains its own
  standalone `package.json`, `next.config.ts`, `tsconfig.json`,
  `.env.example`, `Dockerfile`, and `app/` directory with no imports
  referencing `@/components`, `@/app`, `@/utils`, or `@/lib` paths from
  the root RiseBet project.
  Evidence: `ls admin/` listing + grep for cross-boundary imports.

- AC-02 `rule`
  Pass condition: Repo root contains `docker-compose.yml` with at least
  two services (`risebet-frontend` on 3044, `risebet-admin` on 3045) and a
  shared custom network. `docker compose config` validates without
  errors.
  Evidence: Output of `docker compose config`.

- AC-03 `rule`
  Pass condition: Admin app has a public `/login` route and every other
  listed page under `/` is protected by an auth wrapper that redirects
  to `/login` when `admin_token` is absent.
  Evidence: Code inspection of layout + auth hook + manual test.

- AC-04 `rule`
  Pass condition: Admin app contains all 15 functional pages / route
  groups: Dashboard, Users, Users/[id], Transactions (6 tabs), Bets,
  Games, Promotions, Affiliates, VIP, Responsible Gambling, Blog,
  Forum, Support, Settings (6 tabs), Logs.
  Evidence: File listing of `admin/app/**/page.tsx`.

- AC-05 `rule`
  Pass condition: Every list page (users, transactions, bets,
  promotions, affiliates, tickets, posts, logs) has a data table with:
  column headers, search input, at least one filter, loading skeleton,
  empty-state, pagination controls (even if frontend-only mock).
  Evidence: Manual page inspection per route.

- AC-06 `rule`
  Pass condition: Every data-fetching page loads successfully even when
  `NEXT_PUBLIC_API_BASE_URL` is unreachable (mock data rendered, no
  blank screens, retry button present on error state).
  Evidence: Build and browse app with no backend reachable.

- AC-07 `rule`
  Pass condition: Admin `npm run build` inside `admin/` succeeds with
  exit code 0. `tsc --noEmit` also succeeds.
  Evidence: Command output.

- AC-08 `rule`
  Pass condition: Design language matches RiseBet brand: dark backgrounds
  (#0f1420 / #1a2c38), gold accent colors, glassmorphism panels, lucide
  icons, sidebar + topbar + footer layout, responsive, Framer Motion
  page transitions.
  Evidence: Screenshots / visual code inspection.

- AC-09 `rule`
  Pass condition: No sensitive data (admin tokens, passwords, user
  balances) is printed via `console.log` / `console.error` in the
  admin bundle (except explicit error states on API failure that do not
  include secrets).
  Evidence: Grep for console statements in admin source.

### Rubric ACs

- AC-10 `rubric`
  Dimension: Code quality & maintainability.
  Scale: 0 = no separation, tangled code / 1 = separated but repetitive,
  missing abstractions / 2 = clean layers (components, lib/api,
  hooks/types, UI primitives reused), consistent naming, no dead code.
  Pass threshold: ≥ 1.5
  Evidence source: Code review of `admin/components`, `admin/lib`,
  `admin/app`.

- AC-11 `rubric`
  Dimension: Completeness of admin workflows.
  Scale: 0 = empty placeholders only / 1 = tables + basic actions,
  missing edit modals on several pages / 2 = every page has tables,
  filters, create/edit/delete flows (modals or forms), action buttons
  are wired to toast feedback and optimistic UI.
  Pass threshold: ≥ 1.5
  Evidence source: Per-route walkthrough.

- AC-12 `rubric`
  Dimension: Docker developer experience.
  Scale: 0 = compose missing / broken / 1 = works but missing
  documentation / 2 = `docker-compose.yml` + README-style comments in
  `.env.example` + service names + volumes; single command brings up
  both frontend + admin.
  Pass threshold: ≥ 1.5
  Evidence source: Compose file content + `docker compose up` attempt.

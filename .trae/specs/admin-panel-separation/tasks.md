# Admin Panel Implementation Tasks

Derived from [spec.md](./spec.md). Each task maps to at least one Acceptance
Criterion (AC-XX). Task status lives here.

## Task 1: Scaffold admin/ standalone Next.js project

**Status:** pending
**Priority:** high
**Covers:** AC-01, NFR-1, NFR-2

Create a completely standalone `admin/` directory. No imports into root
`app/`, `components/`, or `utils/`.

### Sub-steps
- [ ] `admin/package.json` — Next 15, React 19, TS strict, Tailwind 4,
      Framer Motion, lucide-react, react-hot-toast, clsx, tailwind-merge,
      recharts (charts).
- [ ] `admin/tsconfig.json` — strict, `@/*` paths point inside admin/.
- [ ] `admin/next.config.ts` — separate port candidate 3045.
- [ ] `admin/postcss.config.js`, `admin/tailwind.config.ts` (or Tailwind 4
      CSS-first config) with dark/gold theme tokens (--gold, --bg, --card).
- [ ] `admin/.env.example` — NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_WS_URL, NEXTAUTH_SECRET placeholder, ADMIN_PORT.
- [ ] `admin/Dockerfile` — multi-stage node:20-alpine, same pattern as
      root DOCKERFILE but separate.
- [ ] `admin/lib/api.ts` — `adminApiRequest(url, tokenReq?, opts)` helper
      using `admin_token`; falls back to mock data on network error.
- [ ] `admin/lib/mock.ts` — typed mock datasets for all pages.
- [ ] `admin/lib/types.ts` — shared TS interfaces (User, Bet, Tx, Promo,
      Affilate, VIPTier, Ticket, Post, LogEntry, DashboardStats).
- [ ] `admin/hooks/useAuth.ts` — getToken, setToken, logout, isAdmin,
      role.
- [ ] `admin/hooks/useProtectedRoute.ts` — redirect to /login when no
      token.

### Task-local Test Requirements
- TR-1.1 `rule`
  Pass: `grep -r "from \"@/" admin/src admin/app admin/lib admin/components admin/hooks 2>/dev/null` does NOT match any path outside admin (no `@/components/...`, `@/utils/...` from root).
  Evidence: Command output.
- TR-1.2 `rule`
  Pass: `docker build -f admin/Dockerfile admin/` produces a valid image
  (no cross-boundary import errors).
  Evidence: Docker build log tail.

---

## Task 2: Root docker-compose.yml orchestration

**Status:** pending
**Priority:** high
**Covers:** AC-02, NFR-5

### Sub-steps
- [ ] Root `docker-compose.yml` with services:
  - `risebet-frontend`: build `./` (root DOCKERFILE), ports `3044:3044`,
    network `risebet-net`, env_file `.env` (or pass vars inline).
  - `risebet-admin`: build `./admin`, ports `3045:3045`, network
    `risebet-net`.
  - Optional: `db` (postgres:16-alpine placeholder, commented out by
    default with notes).
  - Optional: `redis` (redis:7-alpine placeholder, commented out by
    default with notes).
- [ ] Root `volumes:` section for any DB placeholders; top-level
  `networks:` defining `risebet-net`.
- [ ] Root `.env.example` update with admin vars, compose-ready.
- [ ] Comments in compose explain each service, ports, env var sources.

### Task-local Test Requirements
- TR-2.1 `rule`
  Pass: `docker compose config` runs with exit code 0 from repo root.
  Evidence: Command output.
- TR-2.2 `rubric`
  Dimension: Clarity & completeness of compose file.
  Scale: 0 = missing 1 or both services / 1 = both services present but
  no network or minimal docs / 2 = services + network + volumes +
  comments + optional DB placeholders present.
  Pass threshold: ≥ 1.5
  Evidence source: File review.

---

## Task 3: Admin auth (login page + protected layout)

**Status:** pending
**Priority:** high
**Covers:** AC-03, FR-3

### Sub-steps
- [ ] `admin/app/layout.tsx` — Root layout: Tailwind + global styles +
      Toaster, providers.
- [ ] `admin/app/login/page.tsx` — Login form (email, password, submit).
      On success stores token, redirects to `/`. Fallback mock admin
      login (admin@risebet.com / admin123 → mock JWT).
- [ ] `admin/app/(protected)/layout.tsx` — Protected layout wrapper that
      uses `useProtectedRoute`. Renders sidebar + topbar + main content
      area + mobile bottom nav.
- [ ] `admin/components/layout/Sidebar.tsx` — All 15 routes listed with
      icons, role-gated items (RTP/Site Settings visible only
      superadmin), collapse toggle, Framer Motion animation.
- [ ] `admin/components/layout/Topbar.tsx` — Search, notifications, role
      badge, admin dropdown (profile, settings, logout).
- [ ] `admin/components/layout/MobileBottomNav.tsx` — Mobile quick links
      (Dashboard, Users, Bets, Support, Settings).
- [ ] `admin/components/ui/*` — GlassCard, StatCard, DataTable
      (headless), Button, Input, Select, Modal, ConfirmDialog, Badge,
      Tag, Avatar, Tabs, Toast, CopyToClipboard, Skeleton, EmptyState,
      Pagination.

### Task-local Test Requirements
- TR-3.1 `rule`
  Pass: Visiting `/` without `admin_token` redirects to `/login`.
  Evidence: Manual navigation.
- TR-3.2 `rule`
  Pass: After submitting mock login, token exists under `admin_token`
  and `/` loads dashboard.
  Evidence: localStorage inspection + route.
- TR-3.3 `rule`
  Pass: Logout button clears token and returns to `/login`.
  Evidence: Manual test.
- TR-3.4 `rubric`
  Dimension: UI quality of login + layout.
  Scale: 0 = white screen / 1 = works but no motion or brand styling / 2
  = dark-gold, glassmorphism, animated, responsive.
  Pass threshold: ≥ 1.5
  Evidence source: Screenshots.

---

## Task 4: Dashboard (Overview)

**Status:** pending
**Priority:** high
**Covers:** AC-04, AC-05, AC-06, FR-4

### Sub-steps
- [ ] `admin/app/(protected)/page.tsx` — Dashboard.
- [ ] 7 StatCards with animations.
- [ ] Recharts charts: daily revenue line, game popularity bar, recent
      winners (pie/bar).
- [ ] Recent bets feed + top winners table.
- [ ] Loading skeleton, error state, mock data fallback.

### Task-local Test Requirements
- TR-4.1 `rule`
  Pass: 7 KPI cards rendered, at least 2 charts, 2 tables rendered even
  without API.
  Evidence: Visual inspection.
- TR-4.2 `rule`
  Pass: Retry button on error state re-triggers data fetch (or mock
  load).
  Evidence: Manual test.

---

## Task 5: Users Management (list + detail)

**Status:** pending
**Priority:** high
**Covers:** AC-04, AC-05, AC-06, FR-5

### Sub-steps
- [ ] `admin/app/(protected)/users/page.tsx` — Users table with search,
      filters (role, status, KYC, VIP, date range), pagination.
- [ ] Row actions: View, Ban/Unban, Reset Password (modal), Edit
      Profile (modal), Adjust Balance (credit/debit modal with note),
      Toggle KYC.
- [ ] `admin/app/(protected)/users/[id]/page.tsx` — User detail: profile
      card, tabs (Overview / Bets / Transactions / KYC / Notes / Actions).
- [ ] All modals wire optimistic UI + toast feedback.

### Task-local Test Requirements
- TR-5.1 `rule`
  Pass: Users list has 6 filters + search + pagination + skeleton +
  empty state.
  Evidence: UI check.
- TR-5.2 `rule`
  Pass: User detail page loads a user and renders 4+ tabs.
  Evidence: Visit `/users/1`.
- TR-5.3 `rule`
  Pass: Ban/Unban + Adjust balance modals show confirm dialog and
  success toast.
  Evidence: Manual flow.

---

## Task 6: Transactions (6 tabs)

**Status:** pending
**Priority:** high
**Covers:** AC-04, AC-05, AC-06, FR-6

### Sub-steps
- [ ] `admin/app/(protected)/transactions/page.tsx` — Tabs: Deposits,
      Withdrawals, Bonuses, Raffles, Races, Others.
- [ ] Each tab: table, date range filter, status filter, CSV export
      button (placeholder that triggers toast "Export queued").
- [ ] Withdrawals: Approve / Reject / Mark Paid actions with confirm.
- [ ] Deposits: Approve / Reject.

### Task-local Test Requirements
- TR-6.1 `rule`
  Pass: All 6 tabs render; each has filters, table, skeleton, empty
  state.
  Evidence: Click through tabs.
- TR-6.2 `rule`
  Pass: Withdrawal "Approve" → confirm dialog → success toast.
  Evidence: Manual.

---

## Task 7: Bets + Games

**Status:** pending
**Priority:** medium
**Covers:** AC-04, AC-05, AC-06, FR-7

### Sub-steps
- [ ] `admin/app/(protected)/bets/page.tsx` — Bets table: game, user,
      amount, multiplier, result, P/L, time. Search + filter by game,
      user, date, outcome.
- [ ] `admin/app/(protected)/games/page.tsx` — Games grid/cards for all
      23 RiseBet games: toggle status, RTP display, 24h stats.
- [ ] Edit game modal: name, category, status, RTP (read-only unless
      superadmin).

### Task-local Test Requirements
- TR-7.1 `rule`
  Pass: Bets table has filter + search + skeleton. Games page shows ≥10
  game cards.
  Evidence: Visual.
- TR-7.2 `rule`
  Pass: Game edit modal opens; save fires toast.
  Evidence: Manual.

---

## Task 8: Promotions, Affiliates, VIP, Responsible Gambling

**Status:** pending
**Priority:** medium
**Covers:** AC-04, AC-05, AC-06, FR-8, FR-9, FR-10, FR-11

### Sub-steps
- [ ] `admin/app/(protected)/promotions/page.tsx` — list + create/edit
      modal + toggle status.
- [ ] `admin/app/(protected)/affiliates/page.tsx` — affiliates table,
      commissions overview, campaigns list, payout queue.
- [ ] `admin/app/(protected)/vip/page.tsx` — tier cards, add/edit tier
      modal, watchlist table.
- [ ] `admin/app/(protected)/responsible-gambling/page.tsx` — tabs
      (Self-Exclusions / Cooling-Off / Deposit Limits / Content Editor).

### Task-local Test Requirements
- TR-8.1 `rule`
  Pass: All 4 pages render skeleton, table/list, at least one
  create/edit action with modal + toast.
  Evidence: Walkthrough.

---

## Task 9: Blog, Forum, Support Tickets

**Status:** pending
**Priority:** medium
**Covers:** AC-04, AC-05, AC-06, FR-12, FR-13, FR-14

### Sub-steps
- [ ] `admin/app/(protected)/blog/page.tsx` — Posts list, create/edit
      post, categories CRUD (sidebar section).
- [ ] `admin/app/(protected)/forum/page.tsx` — Community URL config
      (Telegram, Discord, Twitter) + test links.
- [ ] `admin/app/(protected)/support/page.tsx` — Tickets table with
      priority + status filters.
- [ ] `admin/app/(protected)/support/[id]/page.tsx` — Ticket detail:
      thread, reply, assign, status.

### Task-local Test Requirements
- TR-9.1 `rule`
  Pass: All 3 pages render. Ticket detail page loads at `/support/1`.
  Evidence: Manual.

---

## Task 10: Settings (6 tabs) + Logs

**Status:** pending
**Priority:** medium
**Covers:** AC-04, AC-05, AC-06, FR-15, FR-16

### Sub-steps
- [ ] `admin/app/(protected)/settings/page.tsx` — Tabs: Account,
      Security, Verification, Preferences, Offers, Site Settings.
- [ ] Each tab: form fields, save button, toast on submit.
- [ ] `admin/app/(protected)/logs/page.tsx` — Tabs (Activity / Errors /
      Audit). Tables + filters + severity coloring.

### Task-local Test Requirements
- TR-10.1 `rule`
  Pass: All 6 settings tabs render + save buttons produce toasts. Logs
  page has 3 tabs with tables.
  Evidence: Walkthrough.

---

## Task 11: Build validation, lint, and demo polish

**Status:** pending
**Priority:** high
**Covers:** AC-07, AC-08, AC-09, NFR-6, FR-17

### Sub-steps
- [ ] Run `npm install` inside admin/.
- [ ] Run `tsc --noEmit` inside admin/, fix all TS errors.
- [ ] Run `npm run build` inside admin/, fix all build errors.
- [ ] Verify mobile responsiveness (375px width) for dashboard, users,
      transactions tables (horizontal scroll).
- [ ] Strip all `console.log(token)` / `console.log(password)` — grep
      for secrets logging (AC-09).
- [ ] Final polish: consistent spacing, gold accent colors, animations.

### Task-local Test Requirements
- TR-11.1 `rule`
  Pass: `cd admin && npm run build` succeeds with exit code 0.
  Evidence: Command output.
- TR-11.2 `rule`
  Pass: `cd admin && npx tsc --noEmit` succeeds with exit code 0.
  Evidence: Command output.
- TR-11.3 `rule`
  Pass: `grep -rn "console" admin/app admin/components admin/lib admin/hooks`
  shows no occurrences of `token` concatenated into a console log, and
  no occurrences of password logged.
  Evidence: Command output.
- TR-11.4 `rubric`
  Dimension: Brand match & visual polish.
  Scale: 0 = white / unstyled / 1 = styled but missing animations or
  inconsistent accents / 2 = dark + gold, glassmorphism, lucide icons,
  motion, responsive.
  Pass threshold: ≥ 1.5
  Evidence source: Final screenshots.

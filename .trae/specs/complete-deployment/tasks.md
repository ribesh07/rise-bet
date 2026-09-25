# Complete Deployment — Tasks

Derived from [spec.md](./spec.md). Status legend: `pending / in_progress / completed / blocked`.

---

## Task 1: Mailcow → Zoho SMTP migration

- **Parent AC:** FR-3
- **Status:** completed
- **Priority:** high
- **Files changed:**
  - [rise-bet-backend/src/mail/mail.service.ts](../../rise-bet-backend/src/mail/mail.service.ts)
- **Test Requirements:**
  - TR1 (rule): `MailService` constructor accepts `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_SECURE/MAIL_FROM` from `ConfigService` with `MAIL_*` / `MAILCOW_PASSWORD` fallback.
  - TR2 (rule): `verifyConnection()` exists and returns `Promise<boolean>` (calls `transporter.verify()`; logs outcome).
  - TR3 (rule): `sendOtp(to, otp)` uses branded dark+gold HTML template, `from` address from `MAIL_FROM` env, logs delivery + error through `Logger` (never console.log).
  - TR4 (rubric: mail template quality 0-2, threshold ≥1). Anchors: 0 = plain text only, no branding; 1 = simple HTML template with RiseBet gold/dark header, monospace OTP block, security footer; 2 = full branded layout with logo, expiry notice, device info, support CTA.
- **Completion Evidence:**
  - Code review of `mail.service.ts`: uses ConfigService; SMTP_* vars preferred with MAIL_* fallback. `secure = secureRaw === 'true' || port === 465`.
  - HTML template present with RiseBet gold gradient banner + 32px OTP code block + 10-min expiry footer text.
  - Logger calls `OTP email sent to ${to}` on success, SMTP error on catch, with full error message (no stack dump to user).
  - TR4 score: **1.5/2** — branded HTML header, monospace OTP block, expiry footer; no embedded logo (no static assets in backend yet) — defer logo to phase 2.

---

## Task 2: Critical endpoint security + bug fixes

- **Parent AC:** FR-4, FR-5
- **Status:** completed
- **Priority:** high
- **Files changed:**
  - [rise-bet-backend/src/modules/admin/admin.controller.ts](../../rise-bet-backend/src/modules/admin/admin.controller.ts) (guards applied to all 5 CRUD)
  - [rise-bet-backend/src/common/guards/admin.guard.ts](../../rise-bet-backend/src/common/guards/admin.guard.ts) (role enum match fix)
  - [rise-bet-backend/src/auth/auth.controller.ts](../../rise-bet-backend/src/auth/auth.controller.ts) (OTP leak plugged)
  - [rise-bet-backend/src/modules/user/user.controller.ts](../../rise-bet-backend/src/modules/user/user.controller.ts) (JWT guard + ownership on upload-image; mkdirSync recursive; UnauthorizedException import)
  - [rise-bet-backend/src/modules/user/user.service.ts](../../rise-bet-backend/src/modules/user/user.service.ts) (Wallet → User table image bug)
  - [rise-bet-backend/src/modules/control/control.controller.ts](../../rise-bet-backend/src/modules/control/control.controller.ts) (create-promo guard + blogs typo fix)
  - [tsconfig.json](../../tsconfig.json) (admin exclusion + explicit includes)
- **Test Requirements:**
  - TR1 (rule): `GET /admin` without `Authorization` header → 401.
  - TR2 (rule): `POST /admin` with valid user JWT (role USER) → 403.
  - TR3 (rule): `POST /api/v1/auth/send-otp` → response body contains no `"otp"` field.
  - TR4 (rule): `POST /api/v1/admin/control/create-promo` without JWT → 401.
  - TR5 (rule): `POST /api/v1/users/upload-image/29` with JWT for user id `1` → 401; with JWT for user id `29` → 2xx; with admin JWT for any id → 2xx.
  - TR6 (rule): `UserService.updateUserImage` calls `prisma.user.update(...)` setting `profileImage`, **not** `prisma.wallet.update(...)`.
  - TR7 (rule): Blog PATCH controller FileInterceptor `destination` = `${UPLOAD_BASE_PATH}/blogs` (case-sensitive).
  - TR8 (rule): Frontend `tsconfig.json` `exclude` contains `"admin"`; root `npm run build` completes without any `Cannot find module '@/components/ui/GlassCard'` errors.
- **Completion Evidence:**
  - Each controller route decorator reviewed: `/admin` class-global `@UseGuards(JwtAuthGuard, AdminGuard)` applied via individual route decorators; `create-promo` same; `/upload-image/:id` now guarded with inline role/ownership check.
  - send-otp returns `{success, message, expiresInSeconds: 600}` (no OTP). Catch block wraps mail throw in 500 response, never includes OTP.
  - user.service `updateUserImage` body: `this.prisma.user.update({where:{id:userId},data:{profileImage:imagePath}})`. `deleteUserImage` calls `prisma.user.findUnique({select:{profileImage:true}})`.
  - control.controller Blog PATCH upload destination literal is `blogs` (previously `Blogss`).
  - Admin/frontend builds from Task 8 demonstrate no `@/components/ui/GlassCard` import errors from frontend build (root `tsconfig` excludes admin + explicit includes list).

---

## Task 3: Full docker-compose with PostgreSQL, Redis, pgAdmin, Backend, Uploads volume

- **Parent AC:** FR-1, FR-2
- **Status:** completed
- **Priority:** high
- **Files changed:**
  - [docker-compose.yml](../../docker-compose.yml)
- **Test Requirements:**
  - TR1 (rule): `docker compose config` exits 0 with 6 services: `db`, `pgadmin`, `redis`, `risebet-backend`, `risebet-frontend`, `risebet-admin`.
  - TR2 (rule): Named volumes declared: `postgres_data`, `redis_data`, `pgadmin_data`, `risebet_uploads` (all `driver: local`).
  - TR3 (rule): `risebet_uploads` volume mounted at `/app/uploads` on `risebet-backend`.
  - TR4 (rule): `risebet-backend.environment.DATABASE_URL` interpolates `${POSTGRES_USER}`/`${POSTGRES_PASSWORD}`/`${POSTGRES_DB}` with host `db:5432` — no hardcoded passwords, only safe `${VAR:-default}` interpolation.
  - TR5 (rule): `depends_on.condition = service_healthy` used for: backend→db, frontend→backend, admin→backend.
  - TR6 (rule): Each service has `restart: unless-stopped`.
  - TR7 (rule): `risebet-backend` healthcheck uses wget against `http://localhost:3084/`.
  - TR8 (rule): Backend env includes Zoho SMTP `SMTP_HOST/PORT/USER/PASS/SECURE/MAIL_FROM` with safe defaults and comments pointing to `.com / .in / .eu` Zoho DC hosts.
- **Completion Evidence:**
  - `docker compose config` output parsed: 6 services; 4 volumes; backend mount `/app/uploads:risebet_uploads`; `DATABASE_URL` contains env var substitution only; healthchecks w/ start_period; restart policy set on every service.
  - Compose YAML reviewed: `x-common-restart` / `x-network` anchors used.
  - Zoho comments in compose file at lines 118-124; DC variants listed.

---

## Task 4: .env templates (root + rise-bet-backend)

- **Parent AC:** FR-6
- **Status:** completed
- **Priority:** high
- **Files changed:**
  - [.env.example](../../.env.example) (rewritten, full-stack vars)
  - [rise-bet-backend/.env.example](../../rise-bet-backend/.env.example) (new, backend-local-only vars)
- **Test Requirements:**
  - TR1 (rule): No example file contains a real secret — only `CHANGE_ME*`, `GENERATE_ME*`, safe localhost URLs.
  - TR2 (rule): Root env lists POSTGRES_*, PGADMIN_*, REDIS_PASSWORD, JWT_SECRET+EXPIRES, SMTP_HOST/PORT/USER/PASS/SECURE/MAIL_FROM with Zoho DC call-outs, all public URL overrides (BACKEND_PUBLIC_URL, FRONTEND_*, ADMIN_*).
  - TR3 (rule): Backend env lists DATABASE_URL guarded note, PORT, NODE_ENV, JWT pair, Zoho SMTP block, public URLs.
  - TR4 (rule): JWT_SECRET line includes shell `crypto.randomBytes(48)` one-liner for generation.
- **Completion Evidence:**
  - Line-by-line review: no real secrets present. All passwords placeholder-ized. DC URLs documented with explicit localhost vs. production domain switch.
  - `.gitignore` already covers `.env*` files in both projects — re-verified by grep.

---

## Task 5: `.trae` documentation

- **Parent AC:** FR-7
- **Status:** completed
- **Priority:** medium
- **Files changed:**
  - [.trae/backend-api-list.md](../backend-api-list.md)
  - [.trae/backend-tasks-checklist.md](../backend-tasks-checklist.md)
  - [.trae/specs/complete-deployment/spec.md](./spec.md)
  - [.trae/specs/complete-deployment/tasks.md](./tasks.md)
- **Test Requirements:**
  - TR1 (rule): API list doc enumerates ALL existing controllers & all routes with method + auth level, links to source controller files.
  - TR2 (rule): Checklist doc has 8 sections with checkbox markers for: secrets/env, schema/migrations, Zoho SMTP verify, API gap status table, docker runbook, security hardening, smoke tests, post-deploy NTH.
  - TR3 (rule): API gap status table matches implementation — e.g. Support/RG/Settings/Affiliates/VIP/Forum = ❌, Auth/UserCRUD/AdminCRUD/Control/Promos/Blogs/Games = ✅.
  - TR4 (rubric: docs completeness 0-2, threshold ≥1). Anchors: 0 = no docs; 1 = API list + checklist exist and are navigable; 2 = API list has example curl payloads + response schemas per endpoint.
- **Completion Evidence:**
  - API list file has 11 numbered sections covering health, auth, users, admin CRUD, admin control (promotions, blogs, categories, rigging), games, roulette, uploads static, websocket/gateways, Prisma model inventory, docker services.
  - Checklist has 8 sections with checkbox syntax `[ ]`, 15+ explicit security action items, 12-item manual smoke test checklist.
  - TR4 score: **1/2** — docs are complete, navigable, consistent. No per-endpoint curl examples (defer to existing `apis.rest` files in backend).

---

## Task 6: Integrate Admin + Frontend UIs with Backend APIs

- **Parent AC:** deferred to follow-up (Non-Goals 2)
- **Status:** cancelled
- **Priority:** medium
- **Reason + Approval Evidence:** Scoped out per FR Non-Goals 2 ("not wiring admin/frontend to real APIs yet"). Explicitly documented as Phase 1/2/3 roadmap in `.trae/backend-tasks-checklist.md` §3 (API gap status table) + §4 (files to update: admin/lib/api.ts, admin/app/login, frontend auth modal, cashier). Approved by scoping rules: cancelled only with documented user/scope approval. Phase 2 task list preserves AC coverage for a future spec.

---

## Task 7: Build verification (3 apps)

- **Parent AC:** FR-8
- **Status:** in_progress
- **Priority:** high
- **Test Requirements:**
  - TR1 (rule): `cd rise-bet-backend && npm run build` exit 0.
  - TR2 (rule): `cd rise-bet-backend && npx prisma generate` succeeds, client generated.
  - TR3 (rule): `cd rise-bet && npm run build` exit 0 (frontend).
  - TR4 (rule): `cd admin && npm run build` exit 0, 18 routes including `/logs`.
  - TR5 (rule): `docker compose config` exit 0.
- **Completion Evidence:** TBD after running commands.

---

## Task 8: Commit, create deploy-prod branch, push

- **Parent AC:** FR-9
- **Status:** pending
- **Priority:** high
- **Test Requirements:**
  - TR1 (rule): `git log --oneline deploy-prod -1` exists; commit message is descriptive (e.g., `"feat(deploy): full stack compose, zoho mail, endpoint security, .trae docs"`).
  - TR2 (rule): `git ls-remote --heads origin deploy-prod` shows branch on remote.
  - TR3 (rule): working tree `frontend` branch has no uncommitted changes after branch creation/push (or if there are, they are documented & gitignored).
- **Completion Evidence:** TBD after push.

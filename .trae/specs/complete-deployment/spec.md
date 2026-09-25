# Complete Deployment Spec — RiseBet Full Stack

## Problem

The RiseBet monorepo contains 3 deployable services:
1. **Frontend** (root Next.js app, user-facing casino on port 3044)
2. **Admin** (`admin/` Next.js app, internal dashboard on port 3045)
3. **Backend** (`rise-bet-backend/` NestJS + Prisma + PostgreSQL + WebSockets on port 3084)

Previous deploys were failing because:
- Backend + PostgreSQL + Redis were not part of the docker-compose (only frontend + admin existed).
- Uploads storage was ephemeral — user profile images, KYC documents, promotions, blog images would be lost on container restart.
- Mail service was hard-coded to read `MAIL_HOST` / `MAIL_USER` / `MAILCOW_PASSWORD` env vars (the old Mailcow setup) while the populated `.env` had switched to Zoho SMTP env vars `SMTP_*`. Emails would silently fail.
- Several critical endpoints were unguarded (`/admin` CRUD, `/create-promo`, `/upload-image/:id`), the `send-otp` endpoint returned the plaintext OTP in the HTTP response (defeating email OTP), `updateUserImage()` wrote to the wrong Prisma table (Wallet instead of User), and the blog PATCH upload path had a typo (`Blogss` instead of `blogs`).
- Frontend `tsconfig.json` used `**/*.ts(x)` includes that pulled the admin folder into the frontend typecheck during docker build, triggering `Cannot find module @/components/ui/GlassCard`.

## Users

- **System Operator / DevOps**: Spins up `docker compose up --build`, runs migrations, backs up volumes, performs zero-downtime updates.
- **RiseBet admin**: Uses the admin dashboard (guarded APIs) at port 3045.
- **RiseBet customers**: Use the frontend at port 3044; auth emails + OTPs sent via Zoho SMTP.

## Goals

1. **End-to-end working stack** — `docker compose up --build` results in a fully-operational RiseBet: PostgreSQL healthy, Prisma migrations applied on backend boot, Redis up, backend listening on 3084, frontend 3044, admin 3045, pgAdmin on 5050.
2. **Persistent uploads** — profile images / documents / promotions / blogs survive `docker compose down` via a Docker named volume `risebet_uploads` mounted at the exact `UPLOAD_BASE_PATH` (`/app/uploads`) used by the NestJS app in production.
3. **Production-hardened critical endpoints** — admin CRUD, create-promo, upload-image guarded; send-otp never leaks the OTP.
4. **Zoho SMTP mail delivery** — `MailService` reads the active `SMTP_*` Zoho env vars (with Mailcow `MAIL_*` as fallback), logs delivery, sends branded HTML emails.
5. **Admin + frontend build isolation** — root tsconfig cannot pull admin/ sources into frontend typecheck (fix from previous session kept as-is).
6. **`.trae` documentation** — API master list + backend task/runbook checklist + this spec + tasks.md.
7. **Dedicated deploy branch** — `deploy-prod` branch created and pushed for CI/CD promotion.

## Non-Goals

- Not implementing the remaining API gaps (SupportTickets, Affiliates, Forum, SiteSettings, VIP, GamesConfig) in this pass — those are documented in `.trae/backend-tasks-checklist.md` as Phase 1/2/3.
- Not wiring admin/frontend UI to real APIs yet — the helpers exist, the API matrix is documented, but UI wiring is a separate follow-up phase.
- Not implementing webhooks, payment gateways, or the Affiliate cash-out processor.
- Not setting up TLS/CDN/reverse-proxy at the compose level — left to operator's choice of Caddy/Nginx/Cloudflare Origin CA (documented).

---

## Functional Requirements

### FR-1 — docker-compose.yml — full 6-service stack
- rule: `docker compose config` validates with no errors.
- rule: 6 services defined: `db` (postgres:16-alpine), `pgadmin` (dpage/pgadmin4:latest), `redis` (redis:7-alpine), `risebet-backend`, `risebet-frontend`, `risebet-admin`.
- rule: 4 named volumes defined: `postgres_data`, `redis_data`, `pgadmin_data`, `risebet_uploads`.
- rule: `risebet_uploads` volume mounted at `/app/uploads` on `risebet-backend` — matches `src/main.ts` `NODE_ENV=production` upload base path.
- rule: all services on `risebet-net` bridge network.
- rule: `risebet-backend.depends_on.db.condition = service_healthy`; frontend/admin depend on backend healthy.
- rule: `risebet-backend` environment composes `DATABASE_URL` from `POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB` env vars referencing the `db` hostname (never hardcoded password in compose file — only `$VAR` interpolation + safe defaults).
- rule: every service has `restart: unless-stopped`.

### FR-2 — PostgreSQL + migrations
- rule: Backend Dockerfile CMD auto-applies migrations on start: `npx prisma migrate deploy && node dist/main.js`.
- rule: DB user/password come from env, not committed files.
- rule: Backend includes `@prisma/client` generated at build time (`prisma generate` in Dockerfile builder stage).

### FR-3 — Zoho SMTP
- rule: `MailService` constructor prefers `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `MAIL_FROM` env vars. Falls back to `MAIL_HOST` / `MAIL_PORT` / `MAIL_USER` / `MAILCOW_PASSWORD` / `MAIL_PASSWORD` if `SMTP_*` are unset (for legacy Mailcow compatibility).
- rule: `secure: true` when port is 465 regardless of `SMTP_SECURE` string (Zoho standard).
- rule: `MailService.sendOtp` uses a branded RiseBet HTML template, `from` address from env, Logger-based success/error lines instead of raw console.log.
- rule: Exposes `verifyConnection()` method for future smoke-test endpoints.

### FR-4 — Endpoint security
- rule: All 5 routes in `/admin` controller require `JwtAuthGuard + AdminGuard`.
- rule: `POST /api/v1/admin/control/create-promo` requires `JwtAuthGuard + AdminGuard`.
- rule: `POST /api/v1/users/upload-image/:id` requires `JwtAuthGuard + (owner || admin/superadmin)` ownership check.
- rule: `POST /api/v1/auth/send-otp` **never** returns OTP in response body — response is `{ success: true, message, expiresInSeconds: 600 }`. Invalid email returns 400. SMTP failure returns 500 success=false (no leak).
- rule: `AdminGuard` accepts `ADMIN`, `SUPERADMIN`, `SUPER_ADMIN`, `MODERATOR` roles and the `isAdmin=true` flag (matches Admin model + JwtStrategy return values).

### FR-5 — Bug fixes (must-pass tests + build)
- rule: `UserService.updateUserImage()` updates `prisma.user.profileImage`, NOT `prisma.wallet.image`.
- rule: `UserService.deleteUserImage()` reads `prisma.user.profileImage`, NOT `prisma.wallet.image`.
- rule: `PATCH /api/v1/admin/control/Blogs/:id` disk upload destination is `${UPLOAD_BASE_PATH}/blogs` (no extra `s`).
- rule: `upload-image` endpoint creates `/uploads/users` dir with `mkdirSync(..., { recursive: true })` before disk write.
- rule: Frontend `tsconfig.json` `include` uses explicit root-only folders; `exclude: ["node_modules", "admin"]`; `npm run build` (root) does not fail with admin alias errors.

### FR-6 — Environment templates
- rule: Root `.env.example` exists with placeholders for: `POSTGRES_*`, `PGADMIN_*`, `REDIS_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `SMTP_*` (with Zoho DC examples), MAIL_FROM, all `*_PUBLIC_URL`/`*_API_URL`/`*_WS_URL`/`*URL` overrides. Values never contain real secrets.
- rule: `rise-bet-backend/.env.example` exists with backend-only copy of SMTP/JWT/DATABASE_URL/PORT placeholders.

### FR-7 — `.trae` documentation
- rule: `.trae/backend-api-list.md` exists. Lists every endpoint: method, path, auth level, controller file link, model inventory, docker service map.
- rule: `.trae/backend-tasks-checklist.md` exists with sections: secrets/env, schema/migrations, Zoho mail verify, API gap status table, docker/deploy runbook, security hardening checklist, smoke test checklist, nice-to-have backlog.
- rule: `.trae/specs/complete-deployment/spec.md` (this file) + `tasks.md` exist following TRAE Spec Mode template.

### FR-8 — Build verification
- rule: `cd rise-bet-backend && npm run build` exits 0.
- rule: `cd rise-bet && npm run build` exits 0 (frontend; 68 routes; no admin alias errors).
- rule: `cd admin && npm run build` exits 0 (18 routes including /logs).
- rule: `docker compose config` exits 0.

### FR-9 — Branching
- rule: New branch `deploy-prod` exists in local and remote `origin/deploy-prod`.
- rule: Branch HEAD contains all the commits from the current `frontend` state plus the changes applied in this spec (no stale state).

---

## Non-Functional Requirements

- rubric: **Security posture (0-5)**. Pass threshold: 4/5. Anchors: 0 = many unguarded endpoints + OTP leak; 2 = endpoints guarded but no CORS whitelist, no rate limit, cookies still localStorage; 4 = guarded endpoints + secrets never in files + CORS whitelist-ready + volume for sensitive uploads; 5 = full production hardening (rate limit, csrf, HttpOnly cookies, HSTS, secrets via vault).
- rubric: **Deployability (0-5)**. Pass threshold: 4/5. Anchors: 0 = `docker compose up` fails to boot; 2 = services boot but data is lost on restart; 4 = `docker compose up --build` one-liner works end-to-end, uploads + DB persisted in named volumes, healthchecks correctly gate depends_on; 5 = blue/green or rolling updates configured.
- rubric: **Maintainability (0-5)**. Pass threshold: 4/5. Anchors: 1 = no docs; 3 = docs exist but drift from code; 4 = API list + checklist + spec/tasks match implementation and are linked from `.trae` root.

## Constraints

- `DATABASE_URL`, `JWT_SECRET`, `SMTP_PASS`, `POSTGRES_PASSWORD`, `REDIS_PASSWORD` MUST remain only in `.env` files / CI secret stores; NEVER printed to logs, NEVER committed.
- Admin project remains completely separated from frontend; no cross imports.
- docker-compose must not require a pre-existing external swarm or Kubernetes — vanilla Docker Compose v2 on any Linux/Windows/Mac Docker host.
- Uploads volume mount path must exactly match `process.env.NODE_ENV === 'production' ? '/app/uploads' : join(cwd(), 'uploads')` logic from NestJS `src/main.ts`.
- Zoho SMTP setup must be backwards compatible with Mailcow env vars (old deployments don't break if `MAIL_*` are still set).

## Dependencies & Assumptions

- Docker Engine ≥ 24 + Docker Compose v2 plugin.
- 4 GB RAM minimum for the full stack (2 x Next.js standalone + NestJS + Postgres + Redis + pgAdmin).
- Zoho account with 2FA enabled (App Password is a prereq). Operator is responsible for generating the 16-char app password.
- Ports 3044, 3045, 3084, 5050, 5432, 6379 free on host.

## Open Questions

1. **Support tickets / Affiliates / Site settings / VIP / Forum APIs** — implement as Phase 1-3 in a follow-up spec? Currently mock data-backed in admin UI.
2. **Do we want HttpOnly cookie auth** for admin + frontend (instead of localStorage JWT) before production deploy? Recommended: YES.
3. **Reverse proxy / TLS**: Do you want Caddy/Nginx bundled in compose, or handled by Cloudflare/hosting-provider LB?

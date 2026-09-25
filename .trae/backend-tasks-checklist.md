# RiseBet — Backend Tasks & Things to Perform

A checklist + runbook for every backend task you need to do in `rise-bet-backend/`, ordered from
"before first deploy" → "ongoing operations".

This is a living checklist — check boxes as you complete each task.

---

## 0. Secrets & Env (do first, **before** any build/deploy)

- [ ] **Never commit `.env`**. All 3 projects have `.env` in `.gitignore`; verify with `git status` before each push.
- [ ] Generate a cryptographically strong **JWT_SECRET**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
  Save to **both** root `.env` (`JWT_SECRET=…`) *and* `rise-bet-backend/.env`.
- [ ] **Postgres credentials**: Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` in root `.env` before starting db.
- [ ] **Redis password**: Generate + save as `REDIS_PASSWORD` in root `.env`.
- [ ] **Zoho Mail app-specific password**:
  1. Log into Zoho Accounts (https://accounts.zoho.com)
  2. Security → **App Passwords** → Generate New Password → choose `Other` → name it "RiseBet NestJS"
  3. Copy the 16-char password → set `SMTP_PASS=…` in **both** `.env` files.
  4. Verify Zoho DC host:
     - Global → `SMTP_HOST=smtp.zoho.com` `SMTP_PORT=465` `SMTP_SECURE=true`
     - India  → `SMTP_HOST=smtp.zoho.in`  `SMTP_PORT=465` `SMTP_SECURE=true`
     - EU     → `SMTP_HOST=smtp.zoho.eu`  `SMTP_PORT=465` `SMTP_SECURE=true`
  5. Ensure `SMTP_USER` = the Zoho mailbox email. Mailbox must be active, not suspended.
- [ ] **Public URL variables**: For localhost you can leave defaults (`http://localhost:3084` etc.). For production:
  ```dotenv
  BACKEND_PUBLIC_URL=https://api.playrise.vip
  FRONTEND_API_URL=https://api.playrise.vip
  FRONTEND_URL=https://playrise.vip
  ADMIN_URL=https://admin.playrise.vip
  ADMIN_API_URL=https://api.playrise.vip
  ```

---

## 1. Schema + Migrations (Prisma / PostgreSQL)

Backend Dockerfile CMD is:
```
sh -c "npx prisma migrate deploy && node dist/main.js"
```
…so migrations always apply on container start.

### One-time after a fresh `docker compose up`:

- [ ] Verify DB is reachable via `risebet-db:5432` from host:
  ```bash
  docker compose exec db psql -U risebet -d risebet -c "SELECT version();"
  ```
- [ ] Browse DB with pgAdmin at `http://localhost:5050` (login from `.env` `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`).
  - Register → Host name/address: **`db`**, Port: `5432`, Maintenance db: `risebet`, Username/Password from `.env`.
- [ ] (Dev only, never in prod) Seed a superadmin with:
  ```bash
  cd rise-bet-backend && npx prisma db seed  # if prisma/seed.ts exists
  # OR use:
  node prisma/seed-admin.js  # provided in repo
  ```
- [ ] **Add missing tables** (current schema gaps — needs manual migration):
  - [ ] `SupportTicket` / `SupportMessage`
  - [ ] `Affiliate`, `AffiliateLink`, `AffiliatePayout`
  - [ ] `ForumPost`, `ForumReply`, `ForumCategory`
  - [ ] `SiteSettings` singleton (for `Settings` page + Responsible Gambling toggles)
  - [ ] `KycSubmission` (user-facing documents upload already uses `documentImages` JSON, but a typed KYC table makes admin review easier)
  - [ ] `PromoGroup` — or use `PromotionGroup` enum
- [ ] Create migration after schema edits:
  ```bash
  cd rise-bet-backend
  npx prisma migrate dev --name NAME_YOUR_MIGRATION
  ```

### Ongoing schema ops:

- [ ] **Never** edit `migration.sql` files after they're merged to a deploy branch.
- [ ] Always run `prisma migrate deploy` against the production *before* deploying the app container that depends on the schema.
- [ ] Before deploy to prod: `prisma migrate resolve --applied` for failed migrations, **never** `prisma migrate reset`.
- [ ] Verify migrated list: `docker compose exec risebet-backend npx prisma migrate status`.

---

## 2. Zoho Mail — Verify Before First Email Send

- [ ] Open `.env` → confirm all `SMTP_*` vars are set.
- [ ] Send a test OTP via the API:
  ```bash
  curl -X POST http://localhost:3084/api/v1/auth/send-otp \
    -H 'Content-Type: application/json' \
    -d '{"email":"your-email@domain.com"}'
  ```
  Expect **201** + `{ success: true, message: "OTP sent…", expiresInSeconds: 600 }`.
  Expect email in inbox within ~30 sec with subject "Your RiseBet OTP Code".
- [ ] If send fails:
  1. Check backend logs: `docker compose logs risebet-backend --tail 100 | grep -i "smtp\|Mail\|OTP"`
  2. Did you use the correct Zoho DC host (`.com` / `.in` / `.eu`)?
  3. Did you use an **App-Specific Password** (not your Zoho login password)? 2FA must be on.
  4. Is `SMTP_SECURE=true` + `SMTP_PORT=465`? Zoho mandates SSL on 465, TLS on 587 (but SSL is more reliable).
  5. Check if Zoho flagged the account for "suspicious sending" (you'll get an email in Zoho inbox).
- [ ] Add a branded HTML email template (current template is in `MailService.sendOtp`; extend to password-reset, welcome, withdrawal-approved templates later).

---

## 3. Every Backend API — Done / To-Do Status

Status vs. what the **admin** + **frontend** dashboards currently expect:

| Feature | Backend API exists? | UI wired? | Notes |
|---|---|---|---|
| Auth: signup / login / admin-login / send-otp / me | ✅ | ✅ Frontend LoginForm / Admin login page | |
| User CRUD (update / update-password / details) | ✅ | ✅ Admin Users → user detail | |
| Wallet list per user | ✅ | ✅ Dashboard top-row + Wallets | |
| Transaction list / create | ✅ | ✅ Transactions page + Withdraw modal | |
| Bets list per user (game filter) | ✅ | ✅ Bets page / User Bets tab | |
| Promo create (admin) + redeem (user) | ✅ | ✅ Promotions page (admin) | |
| User image + documents upload | ✅ | ✅ User KYC tab | Bug: `updateUserImage()` used to write to Wallet → fixed to User |
| Admin CRUD | ✅ (now guarded) | ⚠️ Needs admin-roster page in settings | |
| Control: log viewer | ✅ | ⚠️ Admin /logs reads mocked `fetchLogs()` → swap to `api/v1/admin/control/logs` |
| Control: force-spin, bet-control update | ✅ | — | |
| Categories list/delete | ✅ | — | |
| Promotions CRUD + image upload | ✅ | ✅ Admin Promotions dashboard | |
| Blog CRUD + image upload | ✅ | ✅ Admin Blog dashboard | Upload path typo `Blogss` → fixed to `blogs` |
| Wingo bets + results | ✅ | ⚠️ Frontend Wingo page | |
| Limbo, Coinflip, RPS, Pump | ✅ | ⚠️ Per-game pages | |
| Roulette | ✅ | ⚠️ Roulette page | |
| Support tickets | ❌ | ✅ Admin Support dashboard (currently mocked) | **API gap** |
| Responsible gambling settings | ❌ | ✅ Admin RG dashboard (mocked) | **API gap** → use `SiteSettings` table |
| Affiliates | ❌ | ✅ Admin Affiliates (mocked) | **API gap** |
| Forum | ❌ | ✅ Admin Forum (mocked) | **API gap** |
| Site Settings (general, security, payments, appearance) | ❌ | ✅ Admin Settings tabs (mocked) | **API gap** |
| VIP tiers | ❌ | ✅ Admin VIP (mocked) | **API gap** (extend User.level with enum) |
| Games listing | ❌ | ✅ Admin Games (mocked) | **API gap** (Games config table) |

### Recommended roadmap to close API gaps:

- [ ] **Phase 1 — before public deploy**: Support tickets + Responsible Gambling + SiteSettings (4 models, ~8 endpoints, 3 controllers).
- [ ] **Phase 2**: Affiliates (referral code column exists as User.referral — just need aggregates + payout table).
- [ ] **Phase 3**: Forum + Admin Games list + VIP tiers (nice-to-have).

---

## 4. Integrate Admin + Frontend UIs with Backend APIs

Right now many admin/frontend tabs use `mock.ts` local data. Swap each to the
real API endpoints in [backend-api-list.md](./backend-api-list.md).

Priority order:

1. Admin login page → `POST /api/v1/auth/admin-login` then persist the bearer token (HTTP-only cookie preferred).
2. Admin Dashboard stats → extend backend `/api/v1/admin/control/dashboard` summary endpoint.
3. Admin Users list → extend `GET /admin` style endpoint to list users with pagination.
4. Admin Transactions → `GET /api/v1/users/transactions` (or add an admin variant without user id scope).
5. Admin Bets → `GET /api/v1/users/bets` (admin variant without user id scope).
6. Admin Support / RG / Settings / Affiliates → build Phase-1 APIs first, then wire.
7. Frontend auth modal → `signup` / `login` / `send-otp` / `me`.
8. Frontend Cashier → `wallets` + `/transaction` DEPOSIT/WITHDRAW flow.
9. Frontend Games → per-game bet endpoints.

### Concrete files to update:

| Project | Files to change |
|---|---|
| Admin | `admin/lib/api.ts` (every `fetchXxx()` function — change from `mockXxx()` → real HTTP with `apiRequest` helper) |
| Admin | `admin/app/(protected)/*/page.tsx` (relying on mocked data) |
| Admin | `admin/app/login/page.tsx` (currently mocked auth) |
| Frontend | User-login modal → `components/form/loginmodel.tsx`, `signupmodel.tsx` |
| Frontend | Wallet/transaction/cashier UI → wherever `fetchUserWallets()` lives |
| Both | Centralize JWT handling — HTTP-only cookies recommended over localStorage for CSRF safety |

---

## 5. Docker / Deploy

### First-time full stack boot:

```bash
# 1. Populate root .env
cp .env.example .env
# then edit every CHANGE_ME / GENERATE_ME placeholder

# 2. Build + launch (PostgreSQL → Redis → Backend(migrate+start) → frontend + admin)
docker compose up -d --build

# 3. Watch logs until all healthchecks pass
docker compose logs -f --tail 50

# 4. Verify services
curl http://localhost:3084/                       # backend health
curl -I http://localhost:3044/                     # frontend HTTP 200
curl -I http://localhost:3045/login                 # admin HTTP 200
curl -I http://localhost:5050/                       # pgAdmin HTTP 200
```

### Verify persistence:

```bash
# Upload something via admin (promo image, blog image, user image, documents)
# Then stop and restart the stack — uploads must survive:
docker compose down
docker compose up -d
# List the uploads volume
docker compose exec risebet-backend ls -la /app/uploads
docker volume inspect risebet_risebet_uploads
```

### Update strategy:

```bash
git pull origin deploy-prod
# Re-build changed services only:
docker compose up -d --build risebet-backend risebet-frontend risebet-admin
```

### Backups (before production):

- [ ] `postgres_data` → weekly `pg_dump` + offsite copy.
- [ ] `risebet_uploads` → nightly rsync/S3 sync of user images + documents + promo/blog assets.
- [ ] `redis_data` AOF is append-only; safe to snapshot.

---

## 6. Security & Production Hardening (checklist)

- [ ] `DATABASE_URL` **never** printed to logs or HTTP responses (already not — verify in each controller).
- [ ] `send-otp` no longer echoes OTP back to client — **verified ✓ (fixed)**.
- [ ] `Admin CRUD /admin` now requires JWT + AdminGuard — **verified ✓ (fixed)**.
- [ ] `/api/v1/admin/control/create-promo` now JWT + AdminGuard — **verified ✓ (fixed)**.
- [ ] `/api/v1/users/upload-image/:id` now JWT + ownership/role check — **verified ✓ (fixed)**.
- [ ] Add **CORS origin whitelist** in `src/main.ts` instead of `origin: true`. Example:
  ```ts
  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, /\.playrise\.vip$/],
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  });
  ```
- [ ] Add rate limiting (`@nestjs/throttler`) to:
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/admin-login`
  - `POST /api/v1/auth/send-otp` (1 email / 60 s per IP + per email)
- [ ] Force HTTPS + HSTS on reverse proxy (Nginx/Caddy/Cloudflare).
- [ ] Add request ID + structured logging (Pino) + Winston trace middleware.
- [ ] Admin dashboard JWT → HttpOnly cookie + CSRF double submit.
- [ ] Serve `uploads/` through a signed-URL proxy if you ever expose user documents publicly.
- [ ] Database backups encrypted at rest (enable Postgres TDE or encrypt volume).
- [ ] `NODE_ENV=production` on all 3 Node containers (already set in compose).

---

## 7. Manual Smoke Test Checklist (run after every deploy)

- [ ] Backend `/` returns 200
- [ ] `POST /api/v1/auth/send-otp` to a real email → email arrives in inbox, **no OTP in response**
- [ ] Admin login → `POST /api/v1/auth/admin-login` → JWT issued
- [ ] Admin CRUD `GET /admin` → returns 401 when unauthenticated, returns list when admin header present
- [ ] Create a promotion in admin dashboard → image shows in frontend (promotions page) without broken URL
- [ ] Update a blog → image goes to `blogs/` folder (not `Blogss/`)
- [ ] User signup → 10 wallets created for every currency
- [ ] Redeem a promo → INR wallet credited + PromoUsage + Promo.claimed increment
- [ ] Upload user image as user 29 via `/upload-image/29` authenticated as user 29 → 200
- [ ] Try `/upload-image/29` authenticated as user 1 → **401 Unauthorized**
- [ ] Place a Wingo bet → wallet debited, Bet row created, Match + MatchPlayer updated, result settled, wallet credited if win, Transaction rows BET + WIN/LOST
- [ ] `docker compose down && up` → wallets/promotions/users survive (postgres_data persists) + uploaded images survive (risebet_uploads persists)

---

## 8. Post-Deploy "Nice to Have"

- [ ] Sentry / Datadog APM on all 3 Node containers (error tracing + perf).
- [ ] Prometheus + Grafana: NestJS metrics endpoint, Postgres exporter, Redis exporter, cAdvisor.
- [ ] Uptime monitoring (BetterStack / StatusCake) on: `:3084`, `:3044`, `:3045`, Zoho mail MX health.
- [ ] Reverse proxy (Caddy/Nginx) for single host + TLS (Cloudflare Origin CA).
- [ ] Webhook for payment gateways + withdrawal processor (Razorpay/PayU/Crypto).

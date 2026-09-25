# RiseBet — Backend API Master List

All APIs are served by `rise-bet-backend` (NestJS + Prisma + PostgreSQL + WebSockets).

- **Default port**: `3084` (set via `process.env.PORT`, matches `docker-compose.yml` `risebet-backend` port mapping)
- **Base URL (dev)**: `http://localhost:3084`
- **Global prefix**: none (controllers add their own `api/v1/...` or `/admin` prefix)
- **Uploads**: served at `/uploads/**` from `UPLOAD_BASE_PATH` = `/app/uploads` in Docker
- **Auth header**: `Authorization: Bearer <JWT_TOKEN>`
- **Validation**: `ValidationPipe({ whitelist: true })` strips non-DTO properties
- **CORS (production)**: restrict origins in `src/main.ts`; currently allows all (`origin: true`)
- **Swagger**: auto-registered at startup via `setupSwagger()` in `main.ts`

---

## Legend

| Marker | Meaning |
|---|---|
| 🔓 | Public (no auth) |
| 🔒 | Requires **JWT bearer token** (any user) |
| 🛡️  | Requires **JWT + admin/superadmin role** |
| 🎲 | JWT required + writes wallet/bet/transaction rows |

---

## 1. Health

| Method | Path | Auth | Controller | Purpose |
|---|---|---|---|---|
| GET | `/` | 🔓 | [app.controller.ts](../rise-bet-backend/src/app.controller.ts) | Hello / health probe (used by docker healthcheck) |

---

## 2. Auth (`api/v1/auth`)

Controller: [auth.controller.ts](../rise-bet-backend/src/auth/auth.controller.ts)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/signup` | 🔓 | Register new user + auto-create 10 wallets per currency enum |
| POST | `/login` | 🔓 | User login (email **or** username + password) → returns JWT + user w/ wallets/transactions/bets |
| POST | `/admin-login` | 🔓 | Admin login (email + password) → returns JWT + admin details |
| POST | `/send-otp` | 🔓 | Generates 6-digit OTP, emails it via Zoho SMTP. Returns only `{success, message, expiresInSeconds: 600}` — **OTP is never echoed back** |
| GET  | `/test` | 🔓 | Test probe (unprotected) |
| GET  | `/me`   | 🔒 | Returns the full decoded user/admin row from `JwtStrategy.validate()` |

---

## 3. Users (`api/v1/users`)

Controller: [user.controller.ts](../rise-bet-backend/src/modules/user/user.controller.ts)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/update` | 🔒 | Update the authenticated user's profile fields (name, username, phone, dob, etc.) |
| POST | `/update-password` | 🔒 | Change password (validates current password first, bcrypt) |
| GET  | `/:id/details` | 🔒 | Full user dump: user + wallets[] + transactions[] + bets[] (with `match` include) |
| POST | `/redeem-promo` | 🔒 | Redeem promo code → credits INR wallet inside Prisma `$transaction` + bumps `Promo.claimed` + creates `PromoUsage` (unique per user/promo) |
| GET  | `/wallets` | 🔒 | List current user's wallets by currency |
| GET  | `/transactions` | 🔒 | List current user's transactions (newest first) |
| GET  | `/bets` | 🔒 | List current user's bets (optional `?game=` filter) |
| POST | `/:id/transaction` | 🔒 | Admin/manual transaction apply → `DEPOSIT/WIN` increments wallet, else decrements |
| POST | `/upload-image/:id` | 🔒 | Replace profile image. **Ownership enforced**: caller must own `:id` or be admin/superadmin (🛡️ bypass). Creates `/uploads/users/{filename}` → writes `User.profileImage`. Deletes old image from disk first. |
| POST | `/upload-user-files` | 🔒 | Bulk upload: one `profileImage` + up to 10 `documents`. Users partitioned by `userId` folder (`users/{id}`, `documents/{id}`) |

---

## 4. Admin CRUD (`/admin`)

> ⚠️ Previously **unguarded** — now guarded `JwtAuthGuard + AdminGuard`.

Controller: [admin.controller.ts](../rise-bet-backend/src/modules/admin/admin.controller.ts)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/` | 🛡️ | Create new admin row (`Admin` model) |
| GET  | `/` | 🛡️ | List all admins |
| GET  | `/:id` | 🛡️ | Get one admin |
| PATCH| `/:id` | 🛡️ | Update admin (email, role, isActive, password hash) |
| DELETE | `/:id` | 🛡️ | Delete admin |

---

## 5. Admin Control (`api/v1/admin/control`)

Controller: [control.controller.ts](../rise-bet-backend/src/modules/control/control.controller.ts)

### Control + rigging

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/force-spin/:tableId` | 🛡️ | Trigger `RouletteService.forceSpin()` — returns `{success, triggeredBy: "ADMIN", result}` |
| GET  | `/logs` | 🛡️ | Fetch `ControlLog[]` (default 50, max 500 via `?limit=`) |
| POST | `/create-promo` | 🛡️ | Create `Promo` code (previously **unguarded** → now admin-only) |
| POST | `/update` | 🛡️ | Upsert single `BetControl` row (mode AUTO/FORCE, forcedResult, winRatio, targetUserId). Logs admin action to `ControlLog` with `adminId`. |
| GET  | `/categories` | 🔓 | List all `Categories` rows |
| DELETE | `/categories?name=` | 🛡️ | Delete category by unique name |

### Promotions (image uploads)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/promotions/create` | 🛡️ | Upload image + create Promotion. Image dest: `UPLOAD_BASE_PATH/promotions/` → served at `/uploads/promotions/{filename}`. Image URL prefixed with `baseUrl` on read |
| GET  | `/promotions?group=` | 🔓 | List promotions, optional `group` filter (PromotionGroup enum) |
| GET  | `/promotions/:id` | 🔓 | Get single promotion by id |
| PATCH| `/promotions/:id` | 🛡️ | Update promotion + optional new image upload |
| DELETE | `/promotions/:id` | 🛡️ | Delete promotion (including image from disk by stored URL path) |

### Blogs

> ⚠️ Blog **update** path used to upload into `Blogss` (typo) — fixed → `blogs`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/Blogs/create` | 🛡️ | Upload image + create Blog row |
| GET  | `/Blogs?group=` | 🔓 | List blogs, optional group filter (BlogGroup enum) |
| GET  | `/Blogs/:id` | 🔓 | Single blog by id |
| PATCH| `/Blogs/:id` | 🛡️ | Update blog + optional image upload (dest: `UPLOAD_BASE_PATH/blogs/`) |
| DELETE | `/Blogs/:id` | 🛡️ | Delete blog |

---

## 6. Games (`api/v1/game`) — class-level `@UseGuards(JwtAuthGuard)` → 🔒 everywhere

Controller: [wingo.controller.ts](../rise-bet-backend/src/gamesapi/wingo.controller.ts).
All game endpoints perform: wallet debit → create `Match` + `Bet` → settle → wallet credit (if win) + new rows in `Transaction[]` with type BET/WIN/LOST.

| Method | Path | Auth | Game |
|---|---|---|---|
| POST | `/wingo/bet` | 🔒 🎲 | Wingo (color/number/size) — 180 rounds scanned by cron |
| GET  | `/wingo/result` | 🔒 | Wingo history |
| POST | `/limbo/bet` | 🔒 🎲 | Limbo (instant, target multiplier vs. crash point) |
| GET  | `/limbo/result` | 🔒 | Limbo history |
| POST | `/coinflip/bet` | 🔒 🎲 | Coin Flip HEAD/TAIL with streak bonuses |
| GET  | `/coinflip/result` | 🔒 | Coinflip history |
| POST | `/rps/play` | 🔒 🎲 | Rock/Paper/Scissors — accumulates streak |
| POST | `/rps/cashout` | 🔒 🎲 | Cashout RPS at current multiplier |
| GET  | `/rps/result` | 🔒 | RPS history |
| POST | `/pump/start` | 🔒 🎲 | Start Pump match (lock stake, difficulty Easy/Med/Hard) |
| GET  | `/pump/:id/pump` | 🔒 🎲 | Single pump tick: +0.1x multiplier chance or POP → lose |
| GET  | `/pump/:id/cashout` | 🔒 🎲 | Pump cashout at current multiplier |
| GET  | `/pump/result` | 🔒 | Pump history |

### Wingo multipliers (from `WingoService.placeBet`):

| Bet | Hit | Multiplier |
|---|---|---|
| NUMBER 0-9 exact | exact match | 9.0x |
| COLOR green (`{1,3,7,9}` or `5`) | hit | 2.0x or 1.5x |
| COLOR red   (`{2,4,6,8}` or `0`) | hit | 2.0x or 1.5x |
| COLOR violet/purple (`0` or `5`) | hit | 4.5x |
| BIG (5-9) or SMALL (0-4) | hit | 2.0x |

### Pump `difficulty → pop% / increment / max`:

| Difficulty | Base pop% | ∆pop% per 0.1x | Max multiplier |
|---|---|---|---|
| Easy   | 1% | 0.8% | 50x |
| Medium | 2% | 1.5% | 100x |
| Hard   | 3% | 2.5% | 200x |

---

## 7. Roulette (`/roulette`)

Controller: [roulette.controller.ts](../rise-bet-backend/src/roulette/roulette.controller.ts).
Supports: place bet, resolve, force spin (called from Admin Control). Interacts with `Match`, `MatchPlayer`, `Bet` tables.

---

## 8. Static files (uploads)

| Path | Auth | Source |
|---|---|---|
| GET `/uploads/users/**` | 🔓 | `UPLOAD_BASE_PATH/users/` |
| GET `/uploads/documents/**` | 🔓 | `UPLOAD_BASE_PATH/documents/` |
| GET `/uploads/promotions/**` | 🔓 | `UPLOAD_BASE_PATH/promotions/` |
| GET `/uploads/blogs/**` | 🔓 | `UPLOAD_BASE_PATH/blogs/` |
| GET `/uploads/currency/**` | 🔓 | `UPLOAD_BASE_PATH/currency/` |

Directories are created on every NestJS bootstrap (`ensureUploadDirs()` in `src/main.ts`), so a fresh empty `risebet_uploads` docker volume is safe.

---

## 9. WebSockets / Gates

| Class | Purpose |
|---|---|
| [live.gateway.ts](../rise-bet-backend/src/live/live.gateway.ts) | Live user-facing socket room (game state / chat) |
| [admin.gateway.ts](../rise-bet-backend/src/gateways/admin.gateway.ts) | Admin-only websocket for real-time control panel updates |
| [crash.gateway.ts](../rise-bet-backend/src/gateways/crash.gateway.ts) | Crash / Limbo-style crash broadcasts |
| [wingo.cron.ts](../rise-bet-backend/src/gamesapi/wingo.cron.ts) | `@nestjs/schedule` cron for Wingo rounds (settlement + results publish) |

---

## 10. Database Model Inventory (Prisma)

Schema file: [schema.prisma](../rise-bet-backend/prisma/schema.prisma)

| Model | Purpose | Key relations |
|---|---|---|
| `User` | Customer user | `wallets[]`, `transactions[]`, `bets[]`, `promoUsages[]`, `userGameStats[]` |
| `UserGameStats` | Per-user per-game streak/totals | FK → User |
| `Wallet` | Balance per user × currency | FK → User; unique `[userId, currency]` |
| `Transaction` | DEPOSIT / WITHDRAW / BET / WIN / LOST / BONUS / REFUND rows | FK → User; cascades on user delete |
| `Bet` | Single bet with `payload` JSON, game, odds, payout | FK → User, Match; uniqueBetId unique |
| `Match` | Room/round container; tracks players + countPlayers + wins | FK → User; `players[]`, `bets[]` |
| `MatchPlayer` | Per-match player ledger | FK → Match, User; unique `[matchId, userId]` |
| `Admin` | Backoffice user account | `logs[]` (ControlLog) |
| `ControlLog` | Every admin action in `/admin/control/**` | FK → Admin |
| `BetControl` | Single rigging config row (AUTO/FORCE, winRatio, target user) | |
| `Promo` | Promo codes (unique `code`) | `usages[]` |
| `PromoUsage` | Who claimed each promo (unique `[promoId, userId]`) | FK → Promo, User |
| `WingoBet` | Ledger for wingo bets (separate table with round status) | |
| `ExchangeRate` | Currency → INR rate (unique by currency) | |
| `Categories` | Casino/sports categories (unique by name) | |
| `Promotion` | Marketing promotion cards | `group` PromotionGroup; image URL column |
| `Blog` | Blog / content posts | `group` BlogGroup; image URL column |
| `ClientApp`, `ExternalPlayer`, `ExternalWallet` | White-label API (future) | |

---

## 11. Docker Compose Service Inventory

Service map (see [docker-compose.yml](../docker-compose.yml)):

| Service | Port | Purpose | Persistence |
|---|---|---|---|
| `db` | `5432` | PostgreSQL 16 | `postgres_data` named volume |
| `pgadmin` | `5050` | pgAdmin4 DB UI | `pgadmin_data` named volume |
| `redis` | `6379` | Redis 7 (sessions, cache, socket pubsub, rate limit) | `redis_data` AOF |
| `risebet-backend` | `3084` | NestJS API + WebSockets + cron | `risebet_uploads` volume at `/app/uploads`; auto-runs migrations on startup |
| `risebet-frontend` | `3044` | User-facing casino Next.js (standalone output) | Ephemeral (uploads at backend) |
| `risebet-admin` | `3045` | Admin Next.js (standalone output) | Ephemeral |

All services joined to `risebet-net` bridge network. `depends_on` with `service_healthy` where possible (db, risebet-backend).

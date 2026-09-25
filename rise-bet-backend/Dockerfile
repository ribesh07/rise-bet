# -----------------------------
# 1️⃣ BUILD STAGE
# -----------------------------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update -y \
 && apt-get install -y wget ca-certificates openssl libssl-dev build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci --legacy-peer-deps

COPY . .
# ensure node_modules and prisma schema are present
RUN npx prisma generate
RUN npm run build


# -----------------------------
# 2️⃣ RUN STAGE
# -----------------------------
FROM node:20-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y wget openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3084

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
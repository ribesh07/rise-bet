# -----------------------------
# 1️⃣ BUILD STAGE
# -----------------------------
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build


# -----------------------------
# 2️⃣ RUN STAGE
# -----------------------------
FROM node:20-bookworm-slim AS runner

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3088

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
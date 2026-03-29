# -----------------------------
# 1️⃣ BUILD STAGE
# -----------------------------
FROM node:20.12.2-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies)
COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci --legacy-peer-deps

# Copy full source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS project
RUN npm run build


# -----------------------------
# 2️⃣ RUN STAGE (SMALL FINAL IMAGE)
# -----------------------------
FROM node:20.12.2-alpine AS runner

WORKDIR /app

# Only copy necessary files
COPY package*.json ./
ENV NODE_ENV=production

# Install only production deps
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built app + Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Expose API port
EXPOSE 3084

# Run migrations and start app
CMD npx prisma migrate deploy && node dist/main.js

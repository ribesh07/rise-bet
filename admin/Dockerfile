# =========================
# Builder
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl bash build-base

COPY package*.json ./
RUN npm ci

COPY . .

# Next.js build-time environment variables
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_WS_URL

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

ENV NODE_ENV=production

RUN echo "API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}"
RUN echo "WS_URL=${NEXT_PUBLIC_WS_URL}"

RUN npm run build


# =========================
# Production
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3045

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3045

CMD ["node", "server.js"]
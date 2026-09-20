FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

RUN npm install

COPY app ./app
COPY components ./components
COPY hooks ./hooks
COPY lib ./lib
COPY public ./public
COPY next.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

EXPOSE 3045
ENV PORT=3045
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

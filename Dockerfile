FROM node:20.12.2-alpine

WORKDIR /src

# Install dependencies first
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

EXPOSE 3084

CMD npx prisma migrate deploy && node dist/main.js

FROM node:20.12.2-alpine

WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate prisma client
RUN npx prisma generate

# Build using local @nestjs/cli
RUN npx nest build

EXPOSE 3084

CMD npx prisma migrate deploy && node dist/main.js

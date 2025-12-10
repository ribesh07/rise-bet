# FROM node:20.12.2-alpine

# WORKDIR /src

# # Install dependencies first for caching
# COPY package*.json ./
# RUN npm ci --legacy-peer-deps

# # Copy rest of source code
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Build the app
# RUN npm run build

# # Expose API port
# EXPOSE 3084

# # Use an environment variable for DATABASE_URL (Coolify injects it)
# # Run migrations at container startup (safer for DB initialization)
# CMD npx prisma migrate deploy && node dist/main.js
FROM node:20.12.2-alpine

WORKDIR /src

COPY package*.json ./
RUN npm ci --legacy-peer-deps --include=dev
RUN npm install
COPY . .

RUN npm install -g @nestjs/cli
RUN npx prisma generate
RUN npm run build


EXPOSE 3084

CMD npx prisma migrate deploy && node dist/main.js

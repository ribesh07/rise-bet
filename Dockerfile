# Use official Node.js image
# FROM node:18-alpine
FROM node:20.12.2-alpine

# Set working directory
WORKDIR /src

# Copy package files first (for caching)
COPY package*.json ./

# Ensure clean install
RUN rm -rf node_modules && npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .
# Generate Prisma client
RUN npx prisma generate

# Run Prisma migrations (optional: only in production or at build time)
RUN npx prisma migrate deploy

RUN npm run build

# Expose port if needed
EXPOSE 3084

CMD ["node", "dist/main.js"]
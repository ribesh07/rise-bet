FROM node:20-alpine

WORKDIR /app

# Install system deps required by Prisma and for CSS tooling
RUN apk add --no-cache openssl
# Ensure bash and build tools for PostCSS/Tailwind
RUN apk add --no-cache bash build-base

# Ensure devDependencies are installed
ENV NODE_ENV=development
ENV HOSTNAME="0.0.0.0"
ENV PORT=3045

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3045

CMD ["npm", "run", "dev"]

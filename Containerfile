# --- Stage 1: Build ---
FROM node:24-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
# Install all deps so we have access to nest-cli
RUN npm ci

COPY . .
# This creates the /dist folder
RUN npm run build

# --- Stage 2: Production ---
FROM node:24-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Only copy the production-ready JS files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

EXPOSE 3000
# Run the compiled JS directly with node
CMD ["node", "dist/src/main.js"]

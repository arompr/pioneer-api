# --- Stage 1: Build ---
FROM node:24-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./

# Accept NPM_TOKEN as a build arg (Render + local)

ARG GITHUB_PAT
RUN npm config set "@arompr:registry" https://npm.pkg.github.com
RUN npm config set "//npm.pkg.github.com:_authToken" "${GITHUB_PAT}"

RUN npm ci

COPY . .

# Build the app (creates /dist)
RUN npm run build


# --- Stage 2: Production ---
FROM node:24-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy only what is needed for runtime
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

ARG GITHUB_PAT
RUN npm config set "@arompr:registry" https://npm.pkg.github.com
RUN npm config set "//npm.pkg.github.com:_authToken" "${GITHUB_PAT}"

# Install ONLY production dependencies (Render-safe)
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/src/main.js"]

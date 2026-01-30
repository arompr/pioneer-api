# Pioneers API

Node 24 + TypeScript + Express backend.

## Scripts

```bash
npm run dev          # run server
npm run test         # Run unit tests with Vitest
npm run lint         # check code style
npm run lint:fix     # fix style issues
npm run format       # format code
npm run format:check # check formatting
```

## Setup

```bash
npm install
npm run dev
```

## Containerization (Podman)

### Build the Image

```bash
podman build -t pioneers-api .
```

### Run the Container

```bash
# Runs the API on port 3000 in detached mode
podman run -d \
  --name pioneers-api-server \
  -p 3000:3000 \
  pioneers-api
```

## Test URLs

- <http://localhost:3000/>
- <http://localhost:3000/health>

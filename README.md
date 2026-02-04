# Pioneer API

Node 24 + TypeScript + Nest backend.

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
podman build -t pioneer-api .
```

### Run the Container

```bash
# Runs the API on port 3000 in detached mode
podman run -d \
  --name pioneer-api-server \
  -p 3000:3000 \
  pioneer-api
```

## Test URLs

- <http://localhost:3000/>
- <http://localhost:3000/health>

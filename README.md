# Pioneer API

A NestJS backend API built with TypeScript.

## Requirements

- Node.js (v22+)
- npm

## Setup

```bash
npm install
npm run start:dev
```

The API will run on `http://localhost:3000` by default.

## Available Scripts

```bash
npm run start:dev    # Start development server with watch mode
npm run start:debug  # Start with debugger
npm run build        # Build for production
npm run start:prod   # Run production build
npm run test         # Run tests with Vitest
npm run lint:check   # Check code style
npm run lint:fix     # Fix code style issues
npm run format:check # Check code formatting
npm run format:fix   # Fix code formatting
```

## Containerization

### Containerization with Podman

Build and run with Podman:

```bash
podman build -t pioneer-api .
podman run -d -p 3000:3000 --name pioneer-api-server pioneer-api
```

### Containerization with Docker

Build and run with Docker:

```bash
docker build -t pioneer-api .
docker run -d -p 3000:3000 --name pioneer-api-server pioneer-api
```

## Test URLs

- <http://localhost:3000/>

# Pioneer API

A NestJS backend API built with TypeScript.

## Requirements

- Node.js (v22+)
- npm
- A GitHub Personal Access Token (PAT) with `read:packages` scope

## Setup

### 1. Configure authentication

This project depends on `@arompr/typeship` from GitHub Packages, which requires a GitHub PAT.

Copy the example env file and fill in your token:

```bash
cp .env.example .env
# Edit .env and replace the placeholder with your real GitHub PAT
```

> **How to create a PAT:** GitHub → Settings → Developer settings → Personal access tokens → Generate new token → select `read:packages` scope.

### 2. Configure npm authentication

The project requires a `.npmrc` file that directs npm to use GitHub Packages for the `@arompr` scope.
Add the following to your .npmrc or create a new one in project root.

```
@arompr:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PAT}
```

This configuration reads the `GITHUB_PAT` from your `.env` file at install time, allowing npm to authenticate with GitHub Packages.

### 3. Install dependencies

```bash
npm run install
```

### 4. Start the development server

```bash
npm run start:dev
```

The API will run on `http://localhost:3000` by default.

## Available Scripts

```bash
npm run setup            # Install dependencies with GitHub Packages auth (replaces npm ci)
npm run container:build  # Build container image (reads GITHUB_PAT from .env)
npm run container:run    # Run container on port 3000npm run start:dev    # Start development server with watch mode
npm run start:debug  # Start with debugger
npm run build        # Build for production
npm run start:prod   # Run production build
npm run test         # Run tests with Vitest
npm run lint:check   # Check code style
npm run lint:fix     # Fix code style issues
npm run type:check   # TypeScript type checking without emit
npm run format:check # Check code formatting
npm run format:fix   # Fix code formatting
```

## Containerization

`GITHUB_PAT` is passed as a Docker build arg and is **never baked into the image layers**.

```bash
npm run container:build
npm run container:run
```

The scripts read `GITHUB_PAT` from your `.env` file automatically.

### Manual build (Docker)

```bash
docker build --build-arg GITHUB_PAT=$(grep '^GITHUB_PAT=' .env | cut -d'=' -f2- | tr -d '\r') -t pioneer-api .
docker run -d -p 3000:3000 --name pioneer-api-server pioneer-api
```

### CI/CD (Render)

Set `GITHUB_PAT` as a build environment variable in the Render dashboard — it is automatically passed as a build arg.

## Test URLs

- <http://localhost:3000/>

# Copilot Instructions for Pioneer API

## Instructions

- Use **bullet points** for communication; keep responses concise
- Run `npm run type:check`, `npm run lint:check`, and `npm run test` before considering a task done
- For multi-file changes, outline a brief plan before implementing
- When creating new files, check existing siblings for patterns to follow
- Use **named exports** — the project avoids `export default`
- Always use **import aliases** (`#common/*`, `#matchmaking/*`, `#game/*`, `#test/*`) instead of relative imports

## Project Overview

Pioneer API is a Node.js 24 + TypeScript + NestJS backend for a multiplayer game with matchmaking and hex-based gameplay.

## Architecture

### Core Structure

- **Domain-Driven Design (DDD)** with layered architecture: domain → usecase → interface/infrastructure
- **Module Organization**: Feature modules (`matchmaking`, `game`, `common`)
- **Domain Layer**: Pure business logic — entities, value objects, aggregates, domain services, domain events
- **Use Case Layer**: Application logic orchestrating domain operations via `execute()` methods
- **Interface Layer**: NestJS controllers, request/response DTOs, exception filters, mappers
- **Infrastructure Layer**: Repository implementations (currently in-memory)
- **Early Stage**: Root-level `app.module.ts`, `app.controller.ts`, `app.controller.spec.ts`, and `app.service.ts` are NestJS boilerplate — not yet part of the architecture

### Directory Structure

```
src/
├── common/
│   └── domain/
│       ├── aggregate/    # AggregateRoot base class, IEventSourcedAggregate
│       ├── events/       # DomainEvent interface, EventPayload type
│       └── DomainError.ts
├── matchmaking/
│   ├── domain/
│   │   ├── lobby/        # Lobby aggregate, states, config, errors, events, factories
│   │   └── player/       # Player entity, value objects, errors, factories
│   ├── usecase/          # Use cases (CreateLobby, GetLobby, JoinLobby, LeaveLobby)
│   ├── interface/http/lobby/
│   │   ├── filters/      # Exception filters
│   │   │   ├── domain/   # Domain error → HTTP response filters
│   │   │   └── usecase/  # Use case error → HTTP response filters
│   │   ├── mapper/       # Domain ↔ HTTP mappers
│   │   ├── request/      # Request DTOs
│   │   └── response/     # Response DTOs
│   └── infastructure/db/inMemory/  # InMemoryLobbyRepository
└── game/
    ├── domain/
    │   ├── board/        # Game board
    │   ├── coordinate/   # Hex coordinate system
    │   ├── distance/     # Distance calculations
    │   ├── tile/         # Tile entities
    │   └── Direction.ts
    └── infra/inMemory/events/  # Event store implementations

test/                     # Mirrors src/ structure
├── matchmaking/
├── game/
├── common/
└── *.Mother.ts           # Object Mother test fixtures
```

### Import Aliases

Defined in `package.json` — **always use these** instead of relative imports:

- `#common/*` → `./src/common/*.ts`
- `#matchmaking/*` → `./src/matchmaking/*.ts`
- `#game/*` → `./src/game/*.ts`
- `#test/*` → `./test/*.ts`

## Domain Rules

### Aggregates and Events

- Aggregate roots extend `AggregateRoot` from `#common/domain/aggregate/AggregateRoot`
- Aggregates record domain events via `this.record(event)` and expose them via `pullDomainEvents()`
- `AggregateRoot` tracks a `version` that increments with each recorded event
- `DomainEvent<TPayload>` has `type` (string) and `payload` properties

### State Pattern

- Used for entities with complex lifecycle behavior (e.g., `Lobby`)
- Each state class extends an abstract base class (e.g., `LobbyState`)
- States: `WaitingForPlayersState`, `ReadyToStartState`, `InGameState`, `ClosedState`
- The context entity delegates behavior to its current state

### Error Handling

- All domain errors extend `DomainError` (from `#common/domain/DomainError`)
- Domain errors represent business rule violations and bubble up to application/presentation layers
- Naming: `[Entity][Violation]Error` (e.g., `PlayerNotFoundInLobbyError`, `InvalidMinPlayersError`)
- Include relevant context as `public readonly` properties

### Entities, Value Objects, and Factories

- Entities encapsulate invariants, validate in constructors, fail fast with domain errors
- Private fields with public accessor methods — no bare setters
- **Value objects** are immutable with `equals()` for comparison (e.g., `PlayerId`, `LobbyId`, `HexCoordinate`)
- **Factories** encapsulate creation logic (e.g., `LobbyFactory`, `PlayerFactory`, `LobbyIdFactory`)
- **Repositories** defined as interfaces in domain, implemented in infrastructure (e.g., `LobbyRepository` + `InMemoryLobbyRepository`)
- DI tokens use `Symbol`: `export const LOBBY_REPOSITORY = Symbol('LobbyRepository')`

## Testing Conventions

- **Framework**: Vitest (configured in `vitest.config.ts`). Use Vitest for all new tests.
- **Location**: `/test` directory mirrors `/src` structure. Suffix: `.test.ts`
- **Pattern**: Arrange-Act-Assert with `describe`/`it` blocks
- **Object Mothers**: Factory classes in `/test` (e.g., `LobbyMother`, `PlayerMother`) with descriptive methods (`baseLobby()`, `readyToStartLobby()`)
- **Setup**: Use `beforeEach` for shared Arrange sections. Keep tests isolated — no shared mutable state.

### Test Naming

```typescript
describe('Lobby', () => {
    describe('leave', () => {
        describe('when the player is in the lobby', () => {
            it('removes the player from the lobby', () => {
                /* ... */
            });
        });
    });
});
```

- `describe`: entity/method names
- Inner `describe`: "when" clauses for context
- `it`: assertion starting with expected outcome

## Code Style

### TypeScript

- **Strict mode** enabled (`strictNullChecks`, `noImplicitAny`, `strictBindCallApply`)
- Explicit types for public APIs (parameters and return types)
- Prefer `type` for simple aliases, `interface` for extendable shapes
- **Named exports only** — avoid `export default`

### Naming Conventions

- Classes: `PascalCase` — Files: match primary export (e.g., `Lobby.ts`)
- Methods/functions: `camelCase` — Private fields: `private camelCase`
- Constants: `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for readonly
- Test files: `[Entity].test.ts`

### Comments

- JSDoc on public APIs with `@param`, `@returns`, `@throws` tags
- Avoid obvious comments — code should be self-documenting

## NestJS Conventions

- Dependency injection for services; domain layer is framework-agnostic
- Controllers handle HTTP concerns; use cases contain application logic
- Root-level `app.module.ts`, `app.controller.ts`, `app.service.ts` are unused boilerplate

### Exception Filters

Translate domain/use case errors into HTTP responses:

- **Location**: `interface/http/{module}/filters/domain/` and `filters/usecase/`
- **Naming**: `[Error]Filter.ts` (e.g., `LobbyFullErrorFilter.ts`)
- Each filter catches one error type and returns a JSON response with `statusCode`, `code`, `message`, `timestamp`, `method`, `path`
- `code` values are `SCREAMING_SNAKE_CASE` (e.g., `LOBBY_FULL`)
- Filters are composed via decorator functions (`UseDomainExceptionFilters()`, `UseUseCaseExceptionFilters()`) applied at controller level
- `UseExceptionFilters()` combines both domain and use case filter sets

## Development Workflow

### Commands

- `npm run start:dev` — Dev server with watch mode
- `npm run test` — Run tests (Vitest)
- `npm run type:check` — TypeScript compilation check
- `npm run lint:check` / `npm run lint:fix` — ESLint
- `npm run format:check` / `npm run format:fix` — Prettier
- `npm run build` — Production build

### Code Quality

- ESLint + Prettier configured — run before committing
- Unused variables prefixed with `_` are allowed
- No floating promises — handle or explicitly void

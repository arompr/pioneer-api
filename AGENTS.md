# AGENTS.md - Pioneer API

## Overview

Pioneer API is a Node.js 24 + TypeScript + NestJS backend for a multiplayer Catan-like game with matchmaking and hex-based gameplay.

## General Instructions

- Use **bullet points** for communication; keep responses concise
- Before considering a task done, always run validation: see [Validation Skill](./.claude/skills/validation/SKILL.md)
- For multi-file changes, outline a brief plan before implementing
- When creating new files, check existing siblings for patterns to follow
- Use **named exports** — the project avoids `export default`

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

### Slice-Specific Architecture

- **Matchmaking**: See [.claude/skills/matchmaking/SKILL.md](./.claude/skills/matchmaking/SKILL.md) for event-based aggregate pattern with state management
- **Game**: See [.claude/skills/game/SKILL.md](./.claude/skills/game/SKILL.md) for full event sourcing patterns

## Domain Rules

### Entities, Value Objects, and Factories

- Entities encapsulate invariants. **Domain business rules and validation are split by concern:**
    - **Data validation** (in constructors): Technical constraints that ensure values are well-formed (e.g., "a number must be positive", "a string can't be empty"). These enforce the type's inherent properties.
    - **Domain business rules** (in factories): Rules that enforce domain logic and concepts interacting (e.g., "a lobby can't start without 2+ players", "a player can't join a full lobby"). Factories encapsulate creation logic with business rule validation and throw domain errors on violation.
- Constructors assume valid input (data validation already passed); factories are responsible for business rule validation
- Private fields with public accessor methods — no bare setters
- **Value objects** are immutable with `equals()` for comparison (e.g., `PlayerId`, `LobbyId`, `HexCoordinate`)
- **Factories** encapsulate creation logic and enforce all domain business rule invariants (e.g., `LobbyFactory`, `PlayerFactory`, `LobbyIdFactory`). Use factories for all aggregate/entity/value object creation that involves business rules.
- **Repositories** defined as interfaces in domain, implemented in infrastructure (e.g., `LobbyRepository` + `InMemoryLobbyRepository`)
- DI tokens use `Symbol`: `export const LOBBY_REPOSITORY = Symbol('LobbyRepository')`

### Error Handling

- All domain errors extend `DomainError` (from `#common/domain/DomainError`)
- Domain errors represent business rule violations and bubble up to application/presentation layers
- Naming: `[Entity][Violation]Error` (e.g., `PlayerNotFoundInLobbyError`, `InvalidMinPlayersError`)
- Include relevant context as `public readonly` properties
- Slice-specific errors documented in MATCHMAKING_SKILL.md and GAME_SKILL.md

## Testing

- **Framework**: Vitest (configured in `vitest.config.ts`)
- **Location**: `/test` directory mirrors `/src` structure. Suffix: `.test.ts`
- **Pattern**: Arrange-Act-Assert with `describe`/`it` blocks
- **Object Mothers**: Factory classes in `/test` (e.g., `LobbyMother`, `PlayerMother`) with descriptive methods (`baseLobby()`, `readyToStartLobby()`)
- **Setup**: Use `beforeEach` for shared Arrange sections. Keep tests isolated — no shared mutable state.
- See MATCHMAKING_SKILL.md and GAME_SKILL.md for slice-specific testing patterns
- See [.claude/skills/testMother/SKILL.md](./.claude/skills/testMother/SKILL.md) for Object Mother patterns

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
- Additional test naming conventions in slice-specific SKILLs

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
- Object Mothers: `[Entity]Mother.ts`

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

## Commands

| Command                                       | Description                  |
| --------------------------------------------- | ---------------------------- |
| `npm run start:dev`                           | Dev server with watch mode   |
| `npm run test`                                | Run tests (Vitest)           |
| `npm run type:check`                          | TypeScript compilation check |
| `npm run lint:check` / `npm run lint:fix`     | ESLint                       |
| `npm run format:check` / `npm run format:fix` | Prettier                     |
| `npm run build`                               | Production build             |

## Code Quality

- ESLint + Prettier configured — run before committing
- Unused variables prefixed with `_` are allowed
- No floating promises — handle or explicitly void

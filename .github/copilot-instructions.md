# Copilot Instructions for Pioneer API

## Instructions

- Use **bullet points** for communication; keep responses concise
- Before considering a task done, always run the project validation skill defined in `.github/skills/validation/SKILL.md` ("Validate Project"). This runs type checks, lint, format, and tests, and summarizes results in a structured way.
- For multi-file changes, outline a brief plan before implementing
- When creating new files, check existing siblings for patterns to follow
- Use **named exports** — the project avoids `export default`

## Project Overview

Pioneer API is a Node.js 24 + TypeScript + NestJS backend for a multiplayer Catan-like game with matchmaking and hex-based gameplay.

## Architecture

General principles and layering are in [architecture.md](./architecture.md).

Slice-specific architecture details:

- **Matchmaking**: See [.github/skills/MATCHMAKING_SKILL.md](./.github/skills/MATCHMAKING_SKILL.md) for event-based aggregate pattern with state management
- **Game**: See [.github/skills/GAME_SKILL.md](./.github/skills/GAME_SKILL.md) for full event sourcing patterns

## Domain Rules

### Entities, Value Objects, and Factories

- Entities encapsulate invariants, but **domain business rules and validation for creation of aggregates, entities, and value objects are enforced in domain factories, not in constructors**. Constructors should assume valid input; factories are responsible for all validation and for throwing domain errors on violation.
- Private fields with public accessor methods — no bare setters
- **Value objects** are immutable with `equals()` for comparison (e.g., `PlayerId`, `LobbyId`, `HexCoordinate`)
- **Factories** encapsulate creation logic and enforce all invariants (e.g., `LobbyFactory`, `PlayerFactory`, `LobbyIdFactory`). Use factories for all aggregate/entity/value object creation that involves business rules.
- **Repositories** defined as interfaces in domain, implemented in infrastructure (e.g., `LobbyRepository` + `InMemoryLobbyRepository`)
- DI tokens use `Symbol`: `export const LOBBY_REPOSITORY = Symbol('LobbyRepository')`

### Error Handling

- All domain errors extend `DomainError` (from `#common/domain/DomainError`)
- Domain errors represent business rule violations and bubble up to application/presentation layers
- Naming: `[Entity][Violation]Error` (e.g., `PlayerNotFoundInLobbyError`, `InvalidMinPlayersError`)
- Include relevant context as `public readonly` properties
- Slice-specific errors documented in MATCHMAKING_SKILL.md and GAME_SKILL.md

## Testing Conventions

- **Framework**: Vitest (configured in `vitest.config.ts`). Use Vitest for all new tests.
- **Location**: `/test` directory mirrors `/src` structure. Suffix: `.test.ts`
- **Pattern**: Arrange-Act-Assert with `describe`/`it` blocks
- **Object Mothers**: Factory classes in `/test` (e.g., `LobbyMother`, `PlayerMother`) with descriptive methods (`baseLobby()`, `readyToStartLobby()`)
- **Setup**: Use `beforeEach` for shared Arrange sections. Keep tests isolated — no shared mutable state.
- See MATCHMAKING_SKILL.md and GAME_SKILL.md for slice-specific testing patterns and examples

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
- See MATCHMAKING_SKILL.md and GAME_SKILL.md for slice-specific examples

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

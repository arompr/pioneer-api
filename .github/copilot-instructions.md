# Copilot Instructions for Pioneer API

## Project Overview

Pioneer API is a Node.js 24 + TypeScript + NestJS backend for a multiplayer game with matchmaking and hex-based gameplay.

## Architecture

### Core Structure

- **Domain-Driven Design (DDD)**: The codebase follows DDD principles with a clear separation between domain logic and application/infrastructure layers
- **Module Organization**: Code is organized into feature modules (`matchmaking`, `game`, `common`)
- **Domain Layer**: Each module has a `domain/` directory containing pure business logic, entities, value objects, and domain services
- **Early Stage**: The project is young; `app.module.ts`, `app.controller.ts`, `app.controller.spec.ts`, and `app.service.ts` are NestJS boilerplate files present by default and not yet part of the actual architecture

### Directory Structure

```
src/
├── common/         # Shared domain concepts and utilities
│   └── domain/
├── matchmaking/    # Matchmaking lobby system
│   └── domain/
│       ├── lobby/  # Lobby aggregate and value objects
│       └── player/ # Player entities
└── game/           # Game mechanics
    └── domain/
        ├── board/      # Game board
        ├── coordinate/ # Hex coordinate system
        ├── distance/   # Distance calculations
        └── tile/       # Tile entities

test/
├── matchmaking/    # Matchmaking tests (mirrors src structure)
├── game/           # Game tests (mirrors src structure)
└── *.Mother.ts     # Object Mother test fixtures
```

### Import Aliases

The project uses import aliases defined in `package.json`:

- `#common/*` → `./src/common/*.ts`
- `#matchmaking/*` → `./src/matchmaking/*.ts`
- `#game/*` → `./src/game/*.ts`
- `#test/*` → `./test/*.ts`

**Always use these aliases** instead of relative imports (e.g., `import DomainError from '#common/domain/DomainError'`).

### State Pattern

Entities with complex lifecycle behavior use the **State Pattern**:

- Example: `Lobby` has multiple states (`WaitingForPlayersState`, `ReadyToStartState`, `InGameState`, `ClosedState`)
- Each state class extends an abstract base class (e.g., `LobbyState`)
- States handle state-specific behavior and transitions
- The context entity delegates behavior to its current state

## Domain Rules

### Error Handling

- **Domain Errors**: All domain errors extend `DomainError` (from `#common/domain/DomainError`)
- Domain errors represent business rule violations
- Domain errors are **not** caught at the domain layer—they bubble up to application/presentation layers
- Error naming convention: `[Entity][Violation]Error` (e.g., `PlayerNotFoundInLobbyError`, `InvalidMinPlayersError`)
- Errors should include relevant context as public readonly properties

Example:

```typescript
import DomainError from '#common/domain/DomainError';

export default class InvalidMinPlayersError extends DomainError {
    public readonly min: number;

    constructor(min: number) {
        super(`Minimum players must be at least 1 (given: ${min})`);
        this.min = min;
    }
}
```

### Entity Guidelines

- Entities should encapsulate their invariants and validate them in constructors
- Use **private fields** for internal state, expose through **public accessor methods**
- Methods should represent domain operations, not just getters/setters
- Use **value objects** for identifiers (e.g., `PlayerId`, `LobbyId`) instead of primitives
- Equality comparison should use value object methods (e.g., `playerId.equals(otherPlayerId)`)

### Value Objects

- Value objects are immutable
- Two value objects are equal if their values are equal
- Implement an `equals()` method for comparison
- Examples: `PlayerId`, `LobbyId`, `HexCoordinate`, `Distance`

### Aggregates

- `Lobby` is an aggregate root managing `LobbyPlayers` and containing `Player` references
- Aggregate roots maintain consistency boundaries
- External entities interact only through the aggregate root, not directly with internal entities

## Testing Conventions

### Test Framework

- **Primary**: Vitest (configured in `vitest.config.ts`)
- **Legacy**: Jest (available but prefer Vitest for new tests)
- Tests use the `.test.ts` suffix (e.g., `Lobby.test.ts`)

### Test Organization

- Tests are located in the `/test` directory, mirroring the structure of `/src`
- Test files use the `.test.ts` suffix (e.g., `Lobby.test.ts`)
- Test fixtures and helpers (Object Mothers) also live in `/test` directory
- Test structure follows Arrange-Act-Assert pattern
- Use `describe` and `it` blocks for test organization

### Object Mother Pattern

The codebase uses the **Object Mother** pattern for test data creation:

- Each domain entity has a corresponding "Mother" class in `/test` (e.g., `LobbyMother`, `PlayerMother`, `TileMother`)
- Mothers provide factory methods for creating test objects in various states
- Use descriptive method names (e.g., `baseLobby()`, `readyToStartLobby()`, `inGameLobby()`)
- Mothers encapsulate complex object creation logic

Example:

```typescript
export class PlayerMother {
    static anyPlayer(): Player {
        return this.create(1);
    }

    static create(index: string | number, ready = false): Player {
        return new Player(
            new PlayerId(`secret-${index}`),
            new PlayerId(`public-${index}`),
            `player-${index}`,
            ready ? PlayerStatus.Ready : PlayerStatus.Pending
        );
    }

    static createMany(count: number, readyCount = 0): Player[] {
        return Array.from({ length: count }, (_, i) => this.create(i + 1, i < readyCount));
    }
}
```

### Test Naming

- Describe blocks: Use entity/method names
- Inner describe blocks: Use "when" clauses to describe context
- It blocks: Use assertions starting with the expected outcome

Example:

```typescript
describe('Lobby', () => {
    describe('leave', () => {
        describe('when the player is in the lobby', () => {
            it('removes the player from the lobby', () => {
                lobby.leave(player1.id);
                expect(lobby.isEmpty()).toBe(true);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => lobby.leave(unknownPlayerId)).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });
});
```

### Test Setup

- Use `beforeEach` for test data initialization when multiple tests have the same Arrange section.
- Leverage Object Mothers for creating test fixtures
- Keep tests isolated—no shared mutable state between tests

## Code Style

### TypeScript

- **Strict mode** enabled: `strictNullChecks`, `noImplicitAny`, `strictBindCallApply`
- Use explicit types for public APIs (method parameters and return types)
- Prefer `type` over `interface` for simple type aliases
- Use `interface` for object shapes that may be extended

### Naming Conventions

- Classes: PascalCase (e.g., `Lobby`, `Player`, `DomainError`)
- Methods/functions: camelCase (e.g., `markAsReady()`, `canStart()`)
- Private fields: camelCase with `private` keyword (e.g., `private lobbyState`)
- Constants: SCREAMING_SNAKE_CASE for true constants, camelCase for readonly
- Files: Match the primary export (e.g., `Lobby.ts`, `LobbyState.ts`)
- Test files: `[Entity].test.ts`

### Comments

- Use JSDoc comments for public APIs (classes, methods)
- Include `@param` and `@returns` tags
- Avoid obvious comments—code should be self-documenting
- Comment only when clarification is needed for complex logic

Example:

```typescript
/**
 * Represents a matchmaking lobby.
 */
export class Lobby {
    /**
     * Removes a player from the lobby.
     *
     * @param {PlayerId} playerId - The ID of the player to remove.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    leave(playerId: PlayerId): void {
        // Implementation
    }
}
```

## NestJS Conventions

- Use dependency injection for services
- Controllers handle HTTP concerns
- Services contain application logic
- Domain layer is framework-agnostic (no NestJS imports in domain code)
- Use `@Module`, `@Controller`, `@Injectable` decorators appropriately
- Note: Root-level `app.module.ts`, `app.controller.ts`, `app.controller.spec.ts`, and `app.service.ts` are default boilerplate and not yet representing actual project structure

### Exception Filters

The project uses NestJS Exception Filters to translate domain errors into HTTP responses:

- **Location**: Exception filters are placed in `interface/http/{module}/filters/` directories
- **Naming**: `[DomainError]Filter.ts` (e.g., `UnsupportedGameModeErrorFilter.ts`)
- **Pattern**: Each filter catches a specific domain error and maps it to an appropriate HTTP response

#### Exception Filter Structure

```typescript
import { SomeDomainError } from '#module/domain/path/to/error';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(SomeDomainError)
export class SomeDomainErrorFilter implements ExceptionFilter<SomeDomainError> {
    readonly statusCode = 400; // Appropriate HTTP status
    readonly code: string = 'ERROR_CODE'; // Machine-readable error code

    catch(exception: SomeDomainError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: 'Human-readable error message',
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}
```

#### Applying Filters

- Use a **decorator function** to apply filters to controllers (e.g., `UseDomainExceptionFilters()`)
- The decorator uses `applyDecorators` and `UseFilters` from NestJS
- Apply the decorator at the controller class level

Example decorator (`UseDomainExceptionFilters.ts`):

```typescript
import { applyDecorators, UseFilters } from '@nestjs/common';
import { UnsupportedGameModeExceptionFilter } from './UnsupportedGameModeErrorFilter';

export function UseDomainExceptionFilters() {
    return applyDecorators(
        UseFilters(UnsupportedGameModeExceptionFilter)
        // Add more filters as needed
    );
}
```

Example usage in controller:

```typescript
@UseDomainExceptionFilters()
@Controller('lobby')
export class LobbyController {
    // Controller methods
}
```

#### Guidelines

- Each domain error that can be thrown from a controller should have a corresponding exception filter
- Status codes should match HTTP semantics (400 for client errors, 404 for not found, etc.)
- Error codes should be SCREAMING_SNAKE_CASE and descriptive (e.g., `UNSUPPORTED_GAME_MODE`)
- Error messages should be human-readable and may include context from the domain error
- Access domain error properties to provide detailed error information (e.g., `exception.mode` for `UnsupportedGameModeError`)

## Development Workflow

### Commands

- `npm run start:dev` - Start development server with watch mode
- `npm run test` - Run tests with Vitest
- `npm run lint:check` - Check for linting issues
- `npm run lint:fix` - Fix linting issues automatically
- npm run type:check - Check TypeScript compilation
- `npm run format:check` - Check code formatting
- `npm run format:fix` - Format code with Prettier
- `npm run build` - Build production bundle

### Code Quality

- ESLint and Prettier are configured—always run linters before committing
- Unused variables prefixed with `_` are allowed (e.g., `_unusedParam`)
- No floating promises—must be handled or explicitly voided
- End-of-line is auto-configured for cross-platform compatibility

## Key Patterns to Follow

1. **Domain Purity**: Keep domain logic free of framework dependencies
2. **Fail Fast**: Validate invariants in constructors and throw domain errors immediately
3. **Immutability**: Prefer immutable value objects and readonly fields
4. **Encapsulation**: Hide implementation details, expose behavior through methods
5. **Test First**: Write tests using Object Mothers for maintainable, readable tests
6. **State Pattern**: Use for complex lifecycle management (see `Lobby` states)
7. **DDD Ubiquitous Language**: Use domain terminology in code (e.g., "lobby", "player", "ready")

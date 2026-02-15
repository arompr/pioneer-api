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

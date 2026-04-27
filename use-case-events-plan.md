# Plan: Introduce Use Case Event Layer

## Problem

There are currently two event layers in the matchmaking slice:

1. **Domain Events** — emitted by aggregates (e.g. `PlayerLeftLobby`) and stored in the aggregate's internal event buffer via `record()`.
2. **InMemory / Outbox Events** — persisted as `OutboxMessage` records, then reconstructed back into domain events by `InMemoryOutboxMessageEventMapper` and published to the `EventBus`.

**The code smell:** `PlayerLeftLobby` carries `lobbyId` in its payload, even though it is emitted **by** the lobby itself. A lobby aggregate should not need to reference its own ID in its own events.

**Why it's forced:** `OutboxMessage` stores `aggregateId` (= `lobby.id.value`), but `InMemoryOutboxMessageEventMapper.toDomainEvent()` ignores `aggregateId` and only uses `eventPayload` when reconstructing. So when `PlayerLeftLobbyHandler` needs to call `GetLobbyUseCase`, it needs a `lobbyId` — and the only way to get it back is if it was baked into the domain event payload.

## Solution: Use Case Events

Introduce a **third event layer** — **Use Case Events** — that live in the use case layer and are enriched with typed aggregate context when the outbox-to-eventbus pipeline runs.

### Event Flow (before)
```
Lobby.leave() 
  → records PlayerLeftLobby({ lobbyId, playerId, wasHost })  ← lobbyId pollutes domain event
  → OutboxMessage(aggregateId=lobbyId, payload={lobbyId, playerId, wasHost})
  → InMemoryOutboxMessageEventMapper.toDomainEvent(message) → PlayerLeftLobby (domain event)
  → EventBus.publish(domainEvent)
  → PlayerLeftLobbyHandler.handle(event) → uses event.payload.lobbyId
```

### Event Flow (after)
```
Lobby.leave()
  → records PlayerLeftLobby({ playerId, wasHost })  ← clean domain event
  → OutboxMessage(aggregateId=lobbyId, payload={playerId, wasHost})
  → InMemoryOutboxMessageEventMapper.toUseCaseEvent(message) → PlayerLeftLobbyUseCaseEvent({ lobbyId, playerId, wasHost })
  → EventBus.publish(useCaseEvent)
  → PlayerLeftLobbyHandler.handle(event: PlayerLeftLobbyUseCaseEvent) → uses event.lobbyId
```

## Architecture

### `UseCaseEvent` type (`common/usecase/events/`)
```typescript
export type UseCaseEvent = DomainEvent;
```
Marker type alias — use case events are regular `DomainEvent`s that live in the use case layer. Each concrete use case event class carries only the typed fields relevant to it (e.g. `lobbyId: LobbyId`). No generic `aggregateId: string` is mandated on the type — handlers access typed properties directly.

> **Decision:** A type alias avoids the `@typescript-eslint/no-empty-object-type` lint error that an empty `interface UseCaseEvent extends DomainEvent {}` would trigger.

### Use case event classes (`matchmaking/usecase/events/`)
One class per lobby domain event, all satisfying `UseCaseEvent`. Each carries a typed `lobbyId: LobbyId` for aggregate context (populated from `message.aggregateId` in the mapper):
- `PlayerJoinedLobbyUseCaseEvent`
- `PlayerLeftLobbyUseCaseEvent` ← primary motivation; `lobbyId: LobbyId` used by handlers
- `LobbyClosedUseCaseEvent`
- `LobbyHostChangedUseCaseEvent`
- `LobbyStartedUseCaseEvent`
- `PlayerMarkedReadyUseCaseEvent`
- `PlayerMarkedPendingUseCaseEvent`

Creating all of them ensures consistency — all events published on the `EventBus` are use case events and carry typed aggregate context.

### Updated mapper
`InMemoryOutboxMessageEventMapper.toDomainEvent` renamed to `toUseCaseEvent(message): UseCaseEvent`. It constructs typed use case event instances (e.g. `PlayerLeftLobbyUseCaseEvent`) from the outbox message, using `new LobbyId(message.aggregateId)` to populate `lobbyId` and casting payload fields to their domain types.

`fromPayload` static methods on all domain events were removed as they are no longer needed.

### Cleaned domain event
`PlayerLeftLobby` drops `lobbyId` from its payload:
```typescript
// before
constructor(lobbyId: LobbyId, playerId: PlayerId, wasHost: boolean)
// after
constructor(playerId: PlayerId, wasHost: boolean)
```

`Lobby.leave()` no longer passes `this._id`:
```typescript
// before
this.record(new PlayerLeftLobby(this._id, playerId, wasHost));
// after
this.record(new PlayerLeftLobby(playerId, wasHost));
```

### Updated handlers
`PlayerLeftLobbyHandler` and `WsNotifyPlayerLeftLobbyHandler` both update their type parameter from `PlayerLeftLobby` (domain event) to `PlayerLeftLobbyUseCaseEvent`.

## Files

### New files
| File | Purpose |
|---|---|
| `src/common/usecase/events/UseCaseEvent.ts` | `UseCaseEvent` type alias |
| `src/matchmaking/usecase/events/PlayerJoinedLobbyUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/PlayerLeftLobbyUseCaseEvent.ts` | `lobbyId: LobbyId` used by handlers |
| `src/matchmaking/usecase/events/LobbyClosedUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/LobbyHostChangedUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/LobbyStartedUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/PlayerMarkedReadyUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/PlayerMarkedPendingUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/index.ts` | Barrel export |

### Modified files
| File | Change |
|---|---|
| `src/matchmaking/domain/lobby/events/PlayerLeftLobby.ts` | Remove `lobbyId` from payload and constructor; remove `fromPayload` |
| `src/matchmaking/domain/lobby/events/*.ts` | Remove `fromPayload` from all lobby domain event classes |
| `src/matchmaking/domain/lobby/Lobby.ts` | `leave()` no longer passes `this._id` to `PlayerLeftLobby` |
| `src/matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper.ts` | Rename `toDomainEvent` → `toUseCaseEvent`; produce typed use case events using `new LobbyId(message.aggregateId)` |
| `src/matchmaking/infrastructure/processors/OutboxProcessor.ts` | Call `toUseCaseEvent()` instead of `toDomainEvent()` |
| `src/matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler.ts` | Type param → `PlayerLeftLobbyUseCaseEvent`; use `event.lobbyId` instead of `event.payload.lobbyId` |
| `src/matchmaking/infrastructure/handlers/WsNotifyPlayerLeftLobbyHandler.ts` | Type param → `PlayerLeftLobbyUseCaseEvent` |

### Deleted files
| File | Reason |
|---|---|
| `src/matchmaking/infrastructure/processors/OutboxMessageDomainEventMapper.ts` | Dead code — unused duplicate of `InMemoryOutboxMessageEventMapper`; also used `fromPayload` |

### Test files updated
| File | Change |
|---|---|
| `test/matchmaking/domain/lobby/Lobby.test.ts` | No changes needed — only checks `instanceof PlayerLeftLobby`, no constructor args |
| `test/matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper.test.ts` | `toDomainEvent` → `toUseCaseEvent`; assert use case event instances and `lobbyId.value` |
| `test/matchmaking/infastructure/processors/OutboxProcessor.test.ts` | `expect.any(PlayerJoinedLobby/PlayerLeftLobby)` → use case event equivalents |
| `test/matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler.test.ts` | Construct `PlayerLeftLobbyUseCaseEvent` instead of `PlayerLeftLobby` |

## Decisions Made

- **`UseCaseEvent` is a type alias, not an interface** — avoids the `@typescript-eslint/no-empty-object-type` lint rule that an empty `extends` interface triggers.
- **No generic `aggregateId: string` on `UseCaseEvent`** — each use case event stores only typed fields it needs (e.g. `lobbyId: LobbyId`). Handlers access typed properties directly rather than reconstructing from a raw string. This keeps the interface clean and avoids redundant storage.
- **All 7 use case events include `lobbyId: LobbyId`** — for consistency; future handlers won't need to wonder whether aggregate context is available.


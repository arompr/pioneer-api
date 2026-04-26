# Plan: Introduce Use Case Event Layer

## Problem

There are currently two event layers in the matchmaking slice:

1. **Domain Events** — emitted by aggregates (e.g. `PlayerLeftLobby`) and stored in the aggregate's internal event buffer via `record()`.
2. **InMemory / Outbox Events** — persisted as `OutboxMessage` records, then reconstructed back into domain events by `InMemoryOutboxMessageEventMapper` and published to the `EventBus`.

**The code smell:** `PlayerLeftLobby` carries `lobbyId` in its payload, even though it is emitted **by** the lobby itself. A lobby aggregate should not need to reference its own ID in its own events.

**Why it's forced:** `OutboxMessage` stores `aggregateId` (= `lobby.id.value`), but `InMemoryOutboxMessageEventMapper.toDomainEvent()` ignores `aggregateId` and only uses `eventPayload` when reconstructing. So when `PlayerLeftLobbyHandler` needs to call `GetLobbyUseCase`, it needs a `lobbyId` — and the only way to get it back is if it was baked into the domain event payload.

## Proposed Solution: Use Case Events

Introduce a **third event layer** — **Use Case Events** — that live in the use case layer and are enriched with aggregate context (i.e. `aggregateId`) when the outbox-to-eventbus pipeline runs.

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

### New: `UseCaseEvent` interface (`common/usecase/events/`)
```typescript
export interface UseCaseEvent extends DomainEvent {
    readonly aggregateId: string;
}
```
Use case events implement `DomainEvent` so they remain compatible with the existing `EventBus` interface.

### New: Use case event classes (`matchmaking/usecase/events/`)
One class per lobby domain event, all implementing `UseCaseEvent`:
- `PlayerJoinedLobbyUseCaseEvent`
- `PlayerLeftLobbyUseCaseEvent` ← primary motivation; includes typed `lobbyId: LobbyId`
- `LobbyClosedUseCaseEvent`
- `LobbyHostChangedUseCaseEvent`
- `LobbyStartedUseCaseEvent`
- `PlayerMarkedReadyUseCaseEvent`
- `PlayerMarkedPendingUseCaseEvent`

Creating all of them ensures consistency — all events published on the `EventBus` are use case events and carry `aggregateId`. Future handlers don't need to wonder whether they have aggregate context.

### Updated mapper
`InMemoryOutboxMessageEventMapper` gains a new `toUseCaseEvent(message): UseCaseEvent` method (renaming `toDomainEvent`). It constructs typed use case event instances (e.g. `PlayerLeftLobbyUseCaseEvent`) from the outbox message, using `message.aggregateId` to populate `lobbyId`.

The `fromPayload` factory methods on domain events are no longer needed after this change and can be removed.

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
| `src/common/usecase/events/UseCaseEvent.ts` | `UseCaseEvent` interface |
| `src/matchmaking/usecase/events/PlayerJoinedLobbyUseCaseEvent.ts` | |
| `src/matchmaking/usecase/events/PlayerLeftLobbyUseCaseEvent.ts` | Includes `lobbyId: LobbyId` |
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
| `src/matchmaking/domain/lobby/Lobby.ts` | `leave()` no longer passes `this._id` to `PlayerLeftLobby` |
| `src/matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper.ts` | Rename `toDomainEvent` → `toUseCaseEvent`; produce typed use case events using `message.aggregateId`; remove domain event `fromPayload` usage |
| `src/matchmaking/infrastructure/processors/OutboxProcessor.ts` | Use `toUseCaseEvent()` |
| `src/matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler.ts` | Type param → `PlayerLeftLobbyUseCaseEvent`; use `event.lobbyId` instead of `event.payload.lobbyId` |
| `src/matchmaking/infrastructure/handlers/WsNotifyPlayerLeftLobbyHandler.ts` | Type param → `PlayerLeftLobbyUseCaseEvent` |

### Test files to update
| File | Change |
|---|---|
| `test/matchmaking/domain/lobby/Lobby.test.ts` | Remove `lobbyId` from `PlayerLeftLobby` constructor calls/assertions |
| `test/matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxMessageEventMapper.test.ts` | Update to assert use case event instances and `aggregateId` |
| `test/matchmaking/infastructure/processors/OutboxProcessor.test.ts` | Update `expect.any(PlayerLeftLobby)` → `expect.any(PlayerLeftLobbyUseCaseEvent)` |
| `test/matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler.test.ts` | Use `PlayerLeftLobbyUseCaseEvent` instead of `PlayerLeftLobby` |

## Considerations

- **`fromPayload` static methods on domain events**: Originally added to support reconstruction from outbox payloads. After this change, the mapper creates use case events directly — `fromPayload` is no longer needed on any domain event class and can be removed (cleanup).
- **EventBus type compatibility**: `UseCaseEvent extends DomainEvent`, so all existing `EventBus.publish()` and `EventBus.register()` signatures remain valid without modification.
- **Naming**: Use case events follow `[EventName]UseCaseEvent` to distinguish from domain events without ambiguity.
- **Future events**: Any future handler that needs aggregate context will get it automatically via `UseCaseEvent.aggregateId` or by accessing typed properties like `lobbyId`.

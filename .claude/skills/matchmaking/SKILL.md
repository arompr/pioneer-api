---
name: matchmaking
description: Guide for the matchmaking slice covering lobby lifecycle, state pattern, domain events, and architecture patterns. Use this when working with lobbies, players, matchmaking logic, or related domain logic.
---

# Matchmaking Slice

## Architecture Pattern

**State-based Aggregate with Domain Events**:

- `Lobby` extends `AggregateRoot` from `#common/domain/aggregate/AggregateRoot`
- Records events via `this.record(event)`, exposes via `pullDomainEvents()`
- Events stored within aggregate
- Events are NOT replayed for reconstruction
- State managed directly in aggregate using State Pattern

## Lobby Lifecycle (State Pattern)

States accessible via `Lobby.getLobbyState(): LobbyStateType`:

- `WaitingForPlayersState` → `ReadyToStartState` → `InGameState` → `ClosedState`

Each state class extends `LobbyState` and delegates behavior.

## Event Layers

There are three event layers:

1. **Domain Events** (`matchmaking/domain/lobby/events/`) — emitted by the `Lobby` aggregate via `this.record(event)`. These are clean aggregate-scoped events; they do NOT carry `lobbyId` in their payload since they are already owned by the lobby.
    - `PlayerJoinedLobby`, `PlayerLeftLobby`, `PlayerMarkedReady`, `PlayerMarkedPending`, `LobbyStarted`, `LobbyClosed`, `LobbyHostChanged`
    - Events represent business state changes but are NOT replayed to rebuild aggregates.

2. **Outbox Messages** (`OutboxMessage`) — persisted by the repository with `aggregateId` = `lobby.id.value` and the domain event payload.

3. **Use Case Events** (`matchmaking/usecase/events/`) — produced by `InMemoryOutboxMessageEventMapper.toUseCaseEvent()`. These implement `UseCaseEvent` (from `#common/usecase/events/UseCaseEvent`) and carry typed aggregate context (e.g. `lobbyId: LobbyId`). These are what the `EventBus` publishes; event handlers receive use case events, not domain events.
    - `PlayerJoinedLobbyUseCaseEvent`, `PlayerLeftLobbyUseCaseEvent`, `LobbyClosedUseCaseEvent`, `LobbyHostChangedUseCaseEvent`, `LobbyStartedUseCaseEvent`, `PlayerMarkedReadyUseCaseEvent`, `PlayerMarkedPendingUseCaseEvent`
    - Barrel export at `matchmaking/usecase/events/index.ts`

**Event flow:**

```
Lobby.leave() → records PlayerLeftLobby({ playerId, wasHost })
  → OutboxMessage(aggregateId=lobbyId, payload={playerId, wasHost})
  → InMemoryOutboxMessageEventMapper.toUseCaseEvent(message) → PlayerLeftLobbyUseCaseEvent({ lobbyId, playerId, wasHost })
  → EventBus.publish(useCaseEvent)
  → Handler.handle(event: PlayerLeftLobbyUseCaseEvent) → uses event.lobbyId
```

## Testing

Tests in `/test/matchmaking/`. Use Mother pattern for fixtures (see [testMother/SKILL.md](../testMother/SKILL.md)).

## Notable Errors

- `LobbyFullError`, `LobbyClosedError`, `PlayerNotFoundInLobbyError`
- `InvalidMinPlayersError`, `MinPlayersExceedsMaxPlayersError`

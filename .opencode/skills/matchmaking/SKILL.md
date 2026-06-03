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

2. **Outbox Messages** (`OutboxMessage`) — persisted by the repository with `aggregateId` and the serialized domain event payload.

3. **Use Case Events** (`UseCaseEvent<TEvent, TId>`) — generic wrapper produced by the `OutboxProcessor`. The processor uses `DomainEventDeserializer` to reconstruct the original domain event from the outbox payload, then wraps it with the aggregate identifier.
    - `UseCaseEvent<TEvent, TId>` (from `#common/usecase/events/UseCaseEvent`) has two properties:
        - `aggregateId: TId` — typed aggregate identifier (e.g., `LobbyId`)
        - `event: TEvent` — the reconstructed domain event instance
    - The `EventBus` publishes `UseCaseEvent<TEvent>`; event handlers receive the wrapper and access data via `event.event` and `event.aggregateId`.

**Event flow:**

```
Lobby.leave() → records PlayerLeftLobby({ playerId, wasHost })
  → OutboxMessage(aggregateId=lobbyId, payload={playerId, wasHost})
  → DomainEventDeserializer.deserialize(type, aggregateId, payload) → PlayerLeftLobby
  → UseCaseEvent<PlayerLeftLobby, LobbyId> { aggregateId: lobbyId, event: domainEvent }
  → EventBus.publish(useCaseEvent)
  → Handler.handle(event: UseCaseEvent<PlayerLeftLobby, LobbyId>) → uses event.aggregateId, event.event.playerId
```

**Adding a new event type requires:**

1. Domain event class in `matchmaking/domain/lobby/events/`
2. Entry in `LobbyEventType` constant
3. Serializer function in `LobbyDomainEventSerializer` (domain → primitive payload)
4. Deserializer function + Zod schema in `LobbyDomainEventDeserializer` (primitive payload → domain event)
5. Event handler implementing `EventHandler<TDomainEvent>` if external reaction is needed

## Testing

Tests in `/test/matchmaking/`. Use Mother pattern for fixtures (see [testMother/SKILL.md](../testMother/SKILL.md)).

## Notable Errors

- `LobbyFullError`, `LobbyClosedError`, `PlayerNotFoundInLobbyError`
- `InvalidMinPlayersError`, `MinPlayersExceedsMaxPlayersError`

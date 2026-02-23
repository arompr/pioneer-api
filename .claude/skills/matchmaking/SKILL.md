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

## Key Events

- `PlayerJoinedLobby`, `PlayerLeftLobby`
- `PlayerMarkedReady`, `PlayerMarkedPending`
- `LobbyStarted`, `LobbyClosed`, `LobbyHostChanged`

Events represent business state changes but are NOT replayed to rebuild aggregates.

## Testing

Tests in `/test/matchmaking/`. Use Mother pattern for fixtures (see [testMother/SKILL.md](../testMother/SKILL.md)).

## Notable Errors

- `LobbyFullError`, `LobbyClosedError`, `PlayerNotFoundInLobbyError`
- `InvalidMinPlayersError`, `MinPlayersExceedsMaxPlayersError`

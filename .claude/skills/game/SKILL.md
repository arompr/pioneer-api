---
name: game
description: Guide for the game slice covering event sourcing, hex coordinate system, and game state management. Use this when working with game logic, board generation, resource management, or event sourcing patterns.
---

# Game Slice

## Architecture Pattern

**Full Event Sourcing** (planned implementation):

- Events as single source of truth, persisted in `IEventStore`
- Aggregates reconstructed by replaying events via `applyEvent(event)`
- Optimistic concurrency control via `expectedVersion`
- Infrastructure exists (`InMemoryEventStore`, `InMemoryEventMapper`)
- **Note**: Game aggregate not yet implemented; only domain entities (Board, Tile, Player) exist

### Event Store

`InMemoryEventStore` implementation in `game/infra/inMemory/events/`:

```typescript
// Store with concurrency control
eventStore.append(gameId, newEvents, expectedVersion);
// Throws ConcurrencyError if version mismatch

// Retrieve & reconstruct
const events = eventStore.getEvents(gameId);
const game = Game.fromEvents(gameId, events);
```

## Event Sourcing Workflow

**Creating:**

```typescript
const game = new Game(gameId, config);
game['applyEvent'](initialEvent);
game.rollDice(playerId);
eventStore.append(gameId.value, game.pullDomainEvents());
```

**Reconstructing:**

```typescript
const events = eventStore.getEvents(gameId);
const game = new Game(gameId, config);
for (const event of events) {
    game['applyEvent'](event);
}
```

## Hex Coordinate System

**Cubic coordinates** (x + y + z = 0):

```typescript
new HexCoordinate(0, 0, 0); // Center
new HexCoordinate(1, 0, -1); // Adjacent

coord1.distanceTo(coord2); // Returns Distance value object
```

- `Direction` enum: NE, E, SE, SW, W, NW
- `Distance` value object for calculations

## Key Events

- `GameCreated`: Initialization with players and board
- `ResourcesProduced`: Dice roll resource generation
- `PlayerMovedSettlement`, `RoadBuilt`

Events are immutable history; aggregate state derived from replay.

## Testing

Tests in `/test/game/`. Use Mother pattern for fixtures (see [testMother/SKILL.md](../testMother/SKILL.md)).

## Notable Errors

- `InsufficientResourcesError`, `InvalidResourceQuantityError`
- `TileNotFoundError`, `TileAlreadyExistsError`
- `NegativeDistanceError`

## Infrastructure

`InMemoryEventMapper` converts domain events ↔ storage format. Internal `InMemoryEvent` includes `id`, `aggregateId`, `sequence`, `type`, `payload`.

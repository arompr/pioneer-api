# Pioneer API — Game Architecture Plan

## Problem Statement

Transform the Pioneer API into a full-featured Catan-like game backend. The game bounded context uses **event sourcing** as its core architectural pattern. The system supports real-time multiplayer gameplay via WebSockets, with in-memory persistence and extensibility for future expansions.

## Architectural Approach

### Core Principles

- **Event Sourcing**: Game state is derived entirely from replaying domain events. No separate state storage—only the event store is the source of truth.
- **CQRS**: Commands mutate state (via events), queries read from projections.
- **Single Aggregate**: The Game is one aggregate root. All game invariants are enforced within this consistency boundary.
- **Layered Architecture** (for the game bounded context): presentation → application → domain → infrastructure.
- **WebSocket Communication**: Real-time bidirectional communication using Socket.IO.

### Technology Stack

- **Framework**: NestJS with TypeScript
- **Real-time**: @nestjs/websockets + Socket.IO
- **Testing**: Vitest
- **Event Store**: In-memory event store with replay capability
- **Validation**: class-validator + class-transformer

---

## Architecture Evaluation: Vertical Slices vs Layered

### Why Vertical Slices Don't Fit the Game Context

The original plan organized the game bounded context into 8 vertical slices: setup, turns, resources, buildings, trading, robber, development-cards, victory. After analysis, this is **the wrong decomposition** for a game domain:

**1. The Game is a single aggregate.**
In Catan, nearly every player action touches multiple concerns simultaneously:

- Building a settlement requires: checking it's your turn (turns), deducting resources (resources), placing on the board (buildings), recalculating longest road (victory), and potentially updating victory points (victory).
- Rolling a 7 triggers: dice result (resources), robber activation (robber), discard phase (robber), all within one logical operation.

Slicing these into separate modules with their own domain layers creates artificial boundaries that the domain doesn't actually have. You'd end up with cross-slice dependencies everywhere, defeating the purpose of slicing.

**2. Slices become thin command wrappers.**
Since all slices operate on the same Game aggregate, each "slice" reduces to: a command DTO, a handler that loads the Game aggregate and calls a method, and a response DTO. The domain logic lives in the aggregate, not in the slice. The slice adds no encapsulation value.

**3. Shared `game/common/` grows to contain most of the domain.**
The Game aggregate, Player, Board, ResourceBundle, Building, etc. all end up in the shared area because every slice needs them. The slices themselves contain almost no domain code—just events, rules fragments, and commands that delegate to the shared aggregate.

**4. Event sourcing makes slices redundant.**
With event sourcing, the aggregate already organizes behavior around events. The event handlers (`onDiceRolled`, `onSettlementBuilt`, etc.) are the natural grouping. Adding a slice layer on top creates unnecessary indirection.

### Where Vertical Slices Excel

Vertical slices work well for:

- **CRUD-heavy** applications where features are truly independent (e-commerce: orders, products, reviews)
- **Microservice boundaries** where slices become independent deployables
- **Large teams** where slice ownership prevents merge conflicts

### The Chosen Approach: Layered Architecture with Event Sourcing

The game bounded context uses a **traditional layered architecture** because:

- The domain has a single natural aggregate (Game) with tightly coupled invariants
- Event sourcing already provides excellent organization via event handlers
- CQRS naturally separates read concerns (projections) from write concerns (commands)
- The domain layer organizes sub-concerns into folders (building/, trading/, robber/) without needing full slice infrastructure
- The lobby bounded context remains a single cohesive module (it's naturally one vertical slice already)

---

## Directory Structure

```
src/
├── common/                          # Shared kernel
│   ├── domain/
│   │   ├── DomainError.ts          # (existing)
│   │   ├── aggregate/
│   │   │   ├── AggregateRoot.ts    # (existing, will be enhanced for ES)
│   │   │   └── IEventSourcedAggregate.ts
│   │   └── events/
│   │       └── DomainEvent.ts      # (existing)
│   ├── infrastructure/
│   │   ├── EventStore.ts           # IEventStore interface
│   │   ├── InMemoryEventStore.ts   # In-memory implementation
│   │   └── EventBus.ts            # Pub-sub event bus
│   ├── websocket/                  # WebSocket infrastructure
│   │   └── BaseGateway.ts
│   └── types/                      # Shared types (Result<T,E>)
│
├── matchmaking/                     # BOUNDED CONTEXT: Lobby (unchanged)
│   └── domain/
│       ├── player/                 # (existing)
│       └── lobby/                  # (existing, state pattern)
│
└── game/                            # BOUNDED CONTEXT: Gameplay (event sourced)
    │
    ├── domain/                      # Domain layer (pure, no framework deps)
    │   │
    │   ├── Game.ts                 # *** AGGREGATE ROOT ***
    │   │                           # Single aggregate: all commands go through here.
    │   │                           # Contains apply() handlers for every event type.
    │   │                           # Enforces ALL game invariants.
    │   │
    │   ├── GamePhase.ts            # Enum: SETUP, PLAYING, FINISHED
    │   ├── TurnPhase.ts            # Enum: ROLL_DICE, ROBBER, DISCARD, TRADE, MAIN
    │   │
    │   ├── player/                 # Player within game context
    │   │   ├── GamePlayer.ts       # Entity: resources, buildings built, dev cards, VP
    │   │   ├── GamePlayerId.ts     # Value object
    │   │   ├── ResourceBundle.ts   # Value object: { wood: 2, brick: 1, ... }
    │   │   └── PlayerColor.ts      # Value object
    │   │
    │   ├── board/                  # Game board (existing, enhanced)
    │   │   ├── Board.ts            # (existing)
    │   │   ├── BoardTiles.ts       # (existing)
    │   │   ├── BoardFactory.ts     # (existing)
    │   │   └── errors/             # (existing)
    │   │
    │   ├── coordinate/             # (existing)
    │   │   └── HexCoordinate.ts
    │   │
    │   ├── tile/                   # (existing)
    │   │   ├── Tile.ts
    │   │   └── ResourceType.ts
    │   │
    │   ├── distance/               # (existing)
    │   │   ├── Distance.ts
    │   │   └── errors/
    │   │
    │   ├── Direction.ts            # (existing)
    │   │
    │   ├── building/               # Building sub-domain
    │   │   ├── Building.ts         # Value object: type + location + owner
    │   │   ├── BuildingType.ts     # Enum: SETTLEMENT, CITY, ROAD
    │   │   ├── BuildingCost.ts     # Value object: resource requirements per type
    │   │   └── PlacementRules.ts   # Domain service: distance rule, connectivity
    │   │
    │   ├── trading/                # Trading sub-domain
    │   │   ├── TradeOffer.ts       # Value object: offering + requesting
    │   │   ├── Port.ts             # Value object: port type + exchange rate
    │   │   └── TradeRules.ts       # Domain service: validation
    │   │
    │   ├── robber/                 # Robber sub-domain
    │   │   └── RobberRules.ts      # Domain service: discard threshold, stealing
    │   │
    │   ├── development-cards/      # Development card sub-domain
    │   │   ├── DevelopmentCard.ts   # Value object
    │   │   ├── DevelopmentCardType.ts # Enum: KNIGHT, VP, ROAD_BUILDING, YEAR_OF_PLENTY, MONOPOLY
    │   │   ├── CardDeck.ts          # Entity: shuffled deck with draw
    │   │   └── CardPlayRules.ts     # Domain service: play restrictions
    │   │
    │   ├── scoring/                # Victory/scoring sub-domain
    │   │   ├── LongestRoadCalculator.ts  # Domain service
    │   │   ├── LargestArmyTracker.ts     # Domain service
    │   │   └── VictoryRules.ts           # Win condition (10 VP)
    │   │
    │   ├── dice/                   # Dice sub-domain
    │   │   └── Dice.ts             # Value object: two dice, total 2-12
    │   │
    │   ├── events/                 # *** ALL game domain events ***
    │   │   ├── GameCreated.ts
    │   │   ├── SetupPhaseStarted.ts
    │   │   ├── InitialSettlementPlaced.ts
    │   │   ├── InitialRoadPlaced.ts
    │   │   ├── SetupPhaseCompleted.ts
    │   │   ├── TurnStarted.ts
    │   │   ├── TurnEnded.ts
    │   │   ├── DiceRolled.ts
    │   │   ├── ResourcesProduced.ts
    │   │   ├── SettlementBuilt.ts
    │   │   ├── CityUpgraded.ts
    │   │   ├── RoadBuilt.ts
    │   │   ├── TradeProposed.ts
    │   │   ├── TradeAccepted.ts
    │   │   ├── TradeRejected.ts
    │   │   ├── TradeExecuted.ts
    │   │   ├── RobberActivated.ts
    │   │   ├── CardsDiscarded.ts
    │   │   ├── RobberMoved.ts
    │   │   ├── ResourceStolen.ts
    │   │   ├── DevelopmentCardBought.ts
    │   │   ├── KnightPlayed.ts
    │   │   ├── RoadBuildingPlayed.ts
    │   │   ├── YearOfPlentyPlayed.ts
    │   │   ├── MonopolyPlayed.ts
    │   │   ├── LongestRoadChanged.ts
    │   │   ├── LargestArmyChanged.ts
    │   │   ├── GameWon.ts
    │   │   └── index.ts
    │   │
    │   └── errors/                 # Game domain errors
    │       ├── NotYourTurnError.ts
    │       ├── InvalidPhaseError.ts
    │       ├── InsufficientResourcesError.ts
    │       ├── InvalidPlacementError.ts
    │       ├── InvalidTradeError.ts
    │       └── ...
    │
    ├── application/                 # Application layer (CQRS)
    │   │
    │   ├── commands/                # Write side: all game commands
    │   │   ├── PlaceInitialSettlement.ts
    │   │   ├── PlaceInitialRoad.ts
    │   │   ├── RollDice.ts
    │   │   ├── BuildSettlement.ts
    │   │   ├── UpgradeToCity.ts
    │   │   ├── BuildRoad.ts
    │   │   ├── ProposeTrade.ts
    │   │   ├── AcceptTrade.ts
    │   │   ├── RejectTrade.ts
    │   │   ├── ExecuteBankTrade.ts
    │   │   ├── MoveRobber.ts
    │   │   ├── StealResource.ts
    │   │   ├── DiscardCards.ts
    │   │   ├── BuyDevelopmentCard.ts
    │   │   ├── PlayKnight.ts
    │   │   ├── PlayRoadBuilding.ts
    │   │   ├── PlayYearOfPlenty.ts
    │   │   ├── PlayMonopoly.ts
    │   │   └── EndTurn.ts
    │   │
    │   ├── handlers/                # Command handlers
    │   │   └── ... (one per command, loads Game from store, calls method, saves events)
    │   │
    │   ├── queries/                 # Read side: queries against projections
    │   │   ├── GetGameState.ts
    │   │   ├── GetPlayerHand.ts     # Private: only the requesting player's cards
    │   │   └── GetAvailableActions.ts
    │   │
    │   └── projections/             # Read models built from events
    │       ├── GameStateProjection.ts     # Full game state for broadcasting
    │       ├── VictoryPointProjection.ts  # VP leaderboard
    │       └── PlayerHandProjection.ts    # Per-player private state
    │
    ├── infrastructure/              # Infrastructure layer
    │   ├── GameEventStore.ts        # IEventStore implementation for games
    │   ├── GameRepository.ts        # Loads/saves Game aggregate via event store
    │   └── InMemoryProjectionStore.ts
    │
    └── presentation/                # Presentation/API layer
        ├── GameGateway.ts           # WebSocket gateway: receives commands, emits events
        └── dtos/                    # Request/response DTOs
            ├── commands/            # Incoming command DTOs (validated)
            └── responses/           # Outgoing state/event DTOs
```

---

## Event Sourcing Architecture

### How It Works

```
Client Command (WebSocket)
    │
    ▼
GameGateway (presentation)
    │ validates DTO, extracts command
    ▼
CommandHandler (application)
    │ loads Game aggregate from EventStore
    │ calls domain method on Game
    ▼
Game Aggregate (domain)
    │ validates invariants
    │ calls this.apply(new SomeEvent(...))
    │ apply() routes to internal on<EventName>() handler
    │ on<EventName>() mutates aggregate state
    │ event is recorded in uncommitted events list
    ▼
CommandHandler (application)
    │ pulls uncommitted events from aggregate
    │ appends to EventStore
    │ publishes events to EventBus
    ▼
Projections (application)                    GameGateway (presentation)
    │ update read models from events          │ broadcasts events to clients
    ▼                                         ▼
ProjectionStore (infrastructure)             WebSocket rooms
```

### AggregateRoot Enhancement

The existing `AggregateRoot` needs to be enhanced for true event sourcing:

```typescript
export abstract class AggregateRoot {
    private uncommittedEvents: DomainEvent[] = [];
    private version: number = 0;

    // Apply an event: mutate state + record as uncommitted
    protected apply(event: DomainEvent): void {
        this.route(event); // call the on<EventName> handler
        this.version++;
        this.uncommittedEvents.push(event);
    }

    // Reconstitute from history (no recording)
    public loadFromHistory(events: DomainEvent[]): void {
        for (const event of events) {
            this.route(event);
            this.version++;
        }
    }

    // Each aggregate implements routing to its on* handlers
    protected abstract route(event: DomainEvent): void;

    public pullUncommittedEvents(): DomainEvent[] {
        return this.uncommittedEvents.splice(0);
    }

    public getVersion(): number {
        return this.version;
    }
}
```

### Game Aggregate (Sketch)

```typescript
export class Game extends AggregateRoot {
    private phase: GamePhase;
    private board: Board;
    private players: GamePlayer[];
    private currentPlayerIndex: number;
    private turnPhase: TurnPhase;
    private robberPosition: HexCoordinate;
    private developmentCardDeck: CardDeck;
    // ... more state

    // === COMMANDS (produce events) ===

    rollDice(): void {
        this.assertPhase(GamePhase.PLAYING);
        this.assertTurnPhase(TurnPhase.ROLL_DICE);
        const result = Dice.roll();
        this.apply(new DiceRolled(this.id, result));

        if (result.total === 7) {
            this.apply(new RobberActivated(this.id));
        } else {
            const production = ResourceProductionService.calculate(
                this.board,
                this.players,
                result.total,
                this.robberPosition
            );
            for (const [playerId, resources] of production) {
                this.apply(new ResourcesProduced(this.id, playerId, resources));
            }
        }
    }

    buildSettlement(playerId: GamePlayerId, location: HexCoordinate): void {
        this.assertCurrentPlayer(playerId);
        this.assertTurnPhase(TurnPhase.MAIN);
        PlacementRules.validateSettlement(this.board, location, playerId);
        const player = this.getPlayer(playerId);
        player.assertHasResources(BuildingCost.SETTLEMENT);
        this.apply(new SettlementBuilt(this.id, playerId, location));
    }

    // === EVENT HANDLERS (mutate state) ===

    protected route(event: DomainEvent): void {
        // Route to the appropriate on* method based on event type
    }

    private onDiceRolled(event: DiceRolled): void {
        this.lastDiceResult = event.result;
        this.turnPhase = TurnPhase.MAIN;
    }

    private onSettlementBuilt(event: SettlementBuilt): void {
        const player = this.getPlayer(event.playerId);
        player.deductResources(BuildingCost.SETTLEMENT);
        this.board.placeBuilding(Building.settlement(event.location, event.playerId));
        player.addVictoryPoints(1);
    }

    // ... handlers for every event type

    // === RECONSTITUTION ===

    static create(id: GameId, players: GamePlayer[], board: Board): Game {
        const game = new Game();
        game.apply(new GameCreated(id, players, board));
        return game;
    }

    static fromHistory(events: DomainEvent[]): Game {
        const game = new Game();
        game.loadFromHistory(events);
        return game;
    }
}
```

### Event Store Interface

```typescript
interface IEventStore {
    append(aggregateId: string, events: DomainEvent[], expectedVersion: number): void;
    getEvents(aggregateId: string): DomainEvent[];
    getEventsAfterVersion(aggregateId: string, version: number): DomainEvent[];
}
```

### Projections

Projections are read models rebuilt from events. They subscribe to the EventBus and maintain materialized views:

- **GameStateProjection**: Full board state, player positions, current turn — broadcast to all players after each command.
- **VictoryPointProjection**: Listens to SettlementBuilt, CityUpgraded, LongestRoadChanged, etc. Recalculates VP. Checks win condition.
- **PlayerHandProjection**: Per-player private state (resource cards, development cards). Only sent to the owning player.

---

## Workplan

### Phase 1: Event Sourcing Foundation

- [ ] **Enhance AggregateRoot for Event Sourcing**
  - [ ] Add `apply(event)` with internal routing to `on*` handlers
  - [ ] Add `loadFromHistory(events[])` for reconstitution
  - [ ] Add version tracking for optimistic concurrency
  - [ ] Keep backward compatibility with existing Lobby aggregate

- [ ] **Event Store Infrastructure**
  - [ ] Define `IEventStore` interface in `common/infrastructure/`
  - [ ] Implement `InMemoryEventStore` with append/get/replay
  - [ ] Add optimistic concurrency (expected version check)
  - [ ] Add event versioning support for future schema evolution

- [ ] **Event Bus**
  - [ ] Create `EventBus` for pub-sub within the application
  - [ ] Support sync event handlers (projections)
  - [ ] Integrate with NestJS dependency injection

- [ ] **WebSocket Infrastructure**
  - [ ] Install @nestjs/websockets and @nestjs/platform-socket.io
  - [ ] Create base WebSocket gateway in `common/websocket/`
  - [ ] Implement room management (game rooms, lobby rooms)
  - [ ] Add connection/disconnection handling with reconnection logic

### Phase 2: Lobby Bounded Context

- [ ] **Lobby Application & Infrastructure**
  - [ ] Restructure existing `matchmaking/` into `lobby/` or keep as-is
  - [ ] Add command handlers (CreateLobby, JoinLobby, LeaveLobby, StartGame)
  - [ ] Add LobbyRepository (in-memory)
  - [ ] Integrate lobby events with EventBus

- [ ] **Lobby WebSocket Presentation**
  - [ ] LobbyGateway with Socket.IO
  - [ ] DTOs for all lobby commands and responses
  - [ ] Room-based broadcasting for lobby updates

### Phase 3: Game Domain Core

- [ ] **Game Aggregate Root** (`game/domain/Game.ts`)
  - [ ] Implement Game extending enhanced AggregateRoot
  - [ ] Game creation with players, board, initial state
  - [ ] Phase management (SETUP → PLAYING → FINISHED)
  - [ ] Turn management (current player, turn phases)
  - [ ] Event routing to `on*` handlers
  - [ ] `Game.create()` and `Game.fromHistory()` factory methods

- [ ] **Game Player** (`game/domain/player/`)
  - [ ] GamePlayer entity (resources, buildings count, dev cards, VP)
  - [ ] ResourceBundle value object with add/deduct/has operations
  - [ ] PlayerColor value object

- [ ] **Game Infrastructure**
  - [ ] GameRepository (loads/saves via EventStore)
  - [ ] GameEventStore (wraps InMemoryEventStore for game aggregate)

- [ ] **Game Presentation**
  - [ ] GameGateway WebSocket gateway
  - [ ] Command DTOs and response DTOs
  - [ ] Game room management and state broadcasting

### Phase 4: Setup Phase

- [ ] **Setup Domain Logic** (in Game aggregate)
  - [ ] Initial settlement + road placement commands
  - [ ] Snake-draft order (1→2→3→4→4→3→2→1)
  - [ ] Events: InitialSettlementPlaced, InitialRoadPlaced, SetupPhaseCompleted
  - [ ] Placement rules: valid hex positions, no adjacency conflicts

- [ ] **Setup Commands & Handlers**
  - [ ] PlaceInitialSettlement command + handler
  - [ ] PlaceInitialRoad command + handler

### Phase 5: Turn Flow & Dice

- [ ] **Turn Management** (in Game aggregate)
  - [ ] Turn start/end logic, player rotation
  - [ ] Turn phase transitions (ROLL_DICE → MAIN → end)
  - [ ] Events: TurnStarted, TurnEnded

- [ ] **Dice & Resource Production** (in Game aggregate)
  - [ ] Dice value object (two d6, total 2-12)
  - [ ] RollDice command: produce DiceRolled + ResourcesProduced events
  - [ ] Resource production calculation based on tile numbers + settlements/cities
  - [ ] Handle rolling 7 (robber activation)

### Phase 6: Building

- [ ] **Building Domain** (`game/domain/building/`)
  - [ ] Building value object (type, location, owner)
  - [ ] BuildingCost value object per type
  - [ ] PlacementRules domain service (distance rule, road connectivity)

- [ ] **Building Commands** (in Game aggregate)
  - [ ] BuildSettlement: validate placement + resources, emit SettlementBuilt
  - [ ] UpgradeToCity: validate existing settlement + resources, emit CityUpgraded
  - [ ] BuildRoad: validate connectivity + resources, emit RoadBuilt

### Phase 7: Trading

- [ ] **Trading Domain** (`game/domain/trading/`)
  - [ ] TradeOffer value object
  - [ ] Port value object (3:1 generic, 2:1 specific)
  - [ ] TradeRules domain service

- [ ] **Trading Commands** (in Game aggregate)
  - [ ] ProposeTrade, AcceptTrade, RejectTrade
  - [ ] ExecuteBankTrade (4:1 default)
  - [ ] ExecutePortTrade (3:1 or 2:1)

### Phase 8: Robber

- [ ] **Robber Logic** (in Game aggregate)
  - [ ] On rolling 7: players with >7 cards must discard half
  - [ ] Move robber to new tile, block production
  - [ ] Steal one random resource from adjacent player
  - [ ] Events: RobberActivated, CardsDiscarded, RobberMoved, ResourceStolen

- [ ] **Robber Commands**
  - [ ] DiscardCards, MoveRobber, StealResource

### Phase 9: Development Cards

- [ ] **Development Card Domain** (`game/domain/development-cards/`)
  - [ ] DevelopmentCardType enum (5 types)
  - [ ] CardDeck entity (shuffled, draw)
  - [ ] Play restrictions (can't play card bought this turn)

- [ ] **Development Card Commands** (in Game aggregate)
  - [ ] BuyDevelopmentCard
  - [ ] PlayKnight (move robber + steal)
  - [ ] PlayRoadBuilding (place 2 free roads)
  - [ ] PlayYearOfPlenty (take 2 resources from bank)
  - [ ] PlayMonopoly (take all of one resource type from all players)

### Phase 10: Scoring & Victory

- [ ] **Scoring Domain** (`game/domain/scoring/`)
  - [ ] LongestRoadCalculator (graph algorithm, minimum 5 roads)
  - [ ] LargestArmyTracker (minimum 3 knights)
  - [ ] VictoryRules (10 VP to win)

- [ ] **Projections**
  - [ ] VictoryPointProjection (reacts to events, recalculates VP)
  - [ ] GameStateProjection (materialized view of full game state)
  - [ ] PlayerHandProjection (private per-player state)

- [ ] **Win Condition**
  - [ ] Check after every VP-changing event
  - [ ] Emit GameWon event when a player reaches 10 VP

### Phase 11: Integration & Polish

- [ ] **Cross-Cutting Concerns**
  - [ ] Error handling: domain errors → WebSocket error responses
  - [ ] Reconnection: restore game state from event replay
  - [ ] Disconnect handling: pause timers, notify other players

- [ ] **Snapshot Support** (optimization)
  - [ ] Periodic game state snapshots to avoid full event replay
  - [ ] Load from snapshot + replay events after snapshot

- [ ] **Testing**
  - [ ] Unit tests: Game aggregate, all domain logic, value objects, rules
  - [ ] Integration tests: command → event store → projection round trips
  - [ ] Scenario tests: full game flows (setup through victory)
  - [ ] WebSocket integration tests

### Phase 12: Extensibility

- [ ] **Extension Points**
  - [ ] Board generation strategies (classic, random, custom)
  - [ ] Game variant configuration (player count, VP target)
  - [ ] Document how to add new event types and handlers

---

## Notes & Considerations

### Why One Game Aggregate?

A Catan game is a single consistency boundary. Every action requires checking:

- Is it this player's turn?
- Is the game in the right phase?
- Does the player have enough resources?
- Is the placement valid given the full board state?
- Does this action change victory points?

Splitting this into multiple aggregates would require distributed transactions or eventual consistency between aggregates that actually need immediate consistency. A single Game aggregate keeps invariants simple and transactional.

### Event Sourcing Benefits for This Domain

- **Perfect audit trail**: Every move is recorded. Replay any game.
- **Time travel debugging**: Reconstruct game state at any point.
- **Reconnection**: Replay events to restore a disconnected player's state.
- **Undo support** (future): Walk back events for house rules.
- **Analytics** (future): Mine event streams for game statistics.
- **Spectator mode** (future): Stream events in real-time to observers.

### Domain Sub-Folder Organization

The `game/domain/` layer uses folders (building/, trading/, robber/, etc.) to organize related value objects, domain services, and rules. These are **not** separate bounded contexts or slices — they're just file organization within a single domain. The Game aggregate imports from all of them.

### Event Naming Convention

- Past tense: `SettlementBuilt`, not `BuildSettlement`
- Prefixed with context when ambiguous: `ResourcesProduced`, not `Produced`
- Granular: one event per state change, not one event per command

### Projections vs Direct State

- **Commands** operate on the Game aggregate (write model). The aggregate is loaded from events.
- **Queries** read from projections (read models). Projections are updated asynchronously by subscribing to the EventBus.
- The GameGateway broadcasts projection data to clients, not raw aggregate state.

### Snapshot Strategy

For a typical Catan game (~200-400 events), full replay is fast enough in memory. Snapshots become useful if:

- Games grow very long (house rules, expansions)
- Server restarts need to be fast with many concurrent games
- Implemented as: serialize aggregate state at version N, load snapshot + replay events after N

### Security: Hidden Information

Some game state is private (your hand of cards). The presentation layer must:

- Send full game state (board, buildings, turn) to all players
- Send private state (resource cards, dev cards) only to the owning player
- Never leak card values through events (emit `DevelopmentCardBought` without card type to other players)

### WebSocket Event Format

```typescript
// Client → Server (command)
{ action: "rollDice", gameId: "...", playerId: "..." }
{ action: "buildSettlement", gameId: "...", playerId: "...", location: { q: 0, r: 1 } }

// Server → Client (game event broadcast)
{ event: "diceRolled", data: { result: 8, player: "..." } }
{ event: "resourcesProduced", data: { distributions: [...] } }

// Server → Client (private, to one player)
{ event: "yourHand", data: { resources: { wood: 3, ... }, cards: [...] } }

// Server → Client (state sync, on connect/reconnect)
{ event: "gameState", data: { /* full projected game state */ } }
```

### Performance Considerations

- In-memory event store: O(1) append, O(n) replay per game
- Projections avoid replaying on every query
- Typical game: ~200-400 events, negligible replay cost
- Snapshot optimization deferred until measured need

### Extension Examples (Future)

- **5-6 Player Extension**: Adjust player count in GameCreated, add special build phase
- **Cities & Knights**: New event types (BarbarianAttack, CommodityProduced), new card types
- **Seafarers**: New tile types, ship building events, island discovery events
- **Custom Scenarios**: Different board layouts via BoardFactory strategies

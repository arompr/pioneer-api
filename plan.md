# Pioneer API - Vertical Slice Architecture Plan

## Problem Statement

Transform the Pioneer API into a full-featured Catan-like game backend using vertical slice architecture. The system needs to support real-time multiplayer gameplay via WebSockets, event-driven architecture with in-memory persistence, and be extensible for future game expansions.

## Architectural Approach

### Core Principles

- **Vertical Slice Architecture**: Each feature is a self-contained slice with its own domain logic, handlers, and infrastructure
- **Event-Driven Design**: Game state changes are captured as events, enabling event sourcing patterns
- **In-Memory Persistence**: Fast game state access with event replay capability
- **Clean Architecture**: Domain-centric with clear boundaries between layers
- **WebSocket Communication**: Real-time bidirectional communication using Socket.IO

### Technology Stack

- **Framework**: NestJS with TypeScript
- **Real-time**: @nestjs/websockets + Socket.IO
- **Testing**: Vitest for unit tests, integration tests
- **Event Store**: In-memory event store with replay capability
- **Validation**: class-validator + class-transformer

---

## Architecture Overview

**Two Bounded Contexts with Vertical Slices:**

```
src/
├── shared/                      # Shared kernel (cross-cutting concerns)
│   ├── domain/                 # Base domain primitives (ValueObject, Entity, AggregateRoot)
│   ├── events/                 # Event infrastructure (EventStore, EventBus, DomainEvent)
│   ├── websocket/              # WebSocket infrastructure (Gateway base, DTOs)
│   └── types/                  # Common types (Result<T,E>, IDs)
│
├── lobby/                       # BOUNDED CONTEXT: Matchmaking & Lobby (vertical slice)
│   ├── domain/
│   │   ├── Lobby.ts            # Lobby aggregate
│   │   ├── LobbyPlayer.ts      # Player entity in lobby context
│   │   ├── LobbySettings.ts    # Value object
│   │   ├── events/             # LobbyEvents (PlayerJoined, GameStarted, etc.)
│   │   └── rules/              # Lobby business rules
│   ├── application/
│   │   ├── commands/           # CreateLobby, JoinLobby, StartGame
│   │   ├── handlers/           # Command handlers
│   │   └── services/           # Domain services
│   ├── infrastructure/
│   │   └── LobbyRepository.ts  # In-memory repository
│   └── presentation/
│       ├── LobbyGateway.ts     # WebSocket gateway
│       └── dtos/               # Request/response DTOs
│
└── game/                        # BOUNDED CONTEXT: Gameplay (contains multiple vertical slices)
    │
    ├── shared-domain/           # Shared within game context
    │   ├── board/              # Board, Tile, HexCoordinate (existing)
    │   ├── coordinate/         # (existing)
    │   ├── distance/           # (existing)
    │   ├── Direction.ts        # (existing)
    │   ├── Player.ts           # Player aggregate (resources, buildings, cards, VP)
    │   ├── Game.ts             # Game aggregate (root)
    │   └── GameState.ts        # Game state enum
    │
    ├── setup/                   # SLICE: Initial game setup
    │   ├── domain/
    │   │   ├── events/         # InitialSettlementPlaced, SetupPhaseCompleted
    │   │   ├── rules/          # Placement validation, setup order
    │   │   └── SetupPhase.ts   # Setup phase logic
    │   ├── application/
    │   │   ├── commands/       # PlaceInitialSettlement, PlaceInitialRoad
    │   │   └── handlers/
    │   └── presentation/
    │       └── dtos/
    │
    ├── turns/                   # SLICE: Turn management
    │   ├── domain/
    │   │   ├── Turn.ts         # Turn aggregate
    │   │   ├── TurnPhase.ts    # Enum: ROLL_DICE, MAIN_PHASE, etc.
    │   │   └── events/         # TurnStarted, TurnEnded, PhaseChanged
    │   ├── application/
    │   │   ├── commands/       # StartTurn, EndTurn
    │   │   └── handlers/
    │   └── presentation/
    │       └── dtos/
    │
    ├── resources/               # SLICE: Resource production (dice roll)
    │   ├── domain/
    │   │   ├── Dice.ts         # Value object
    │   │   ├── events/         # DiceRolled, ResourcesProduced
    │   │   └── rules/          # Production calculation rules
    │   ├── application/
    │   │   ├── commands/       # RollDice
    │   │   ├── handlers/
    │   │   └── services/       # ResourceProductionService
    │   └── presentation/
    │       └── dtos/
    │
    ├── buildings/               # SLICE: Building settlements, cities, roads
    │   ├── domain/
    │   │   ├── Building.ts     # Building entity
    │   │   ├── BuildingType.ts # Enum
    │   │   ├── BuildingCost.ts # Value object
    │   │   ├── events/         # SettlementBuilt, CityUpgraded, RoadBuilt
    │   │   └── rules/          # Placement validation
    │   ├── application/
    │   │   ├── commands/       # BuildSettlement, UpgradeCity, BuildRoad
    │   │   └── handlers/
    │   └── presentation/
    │       └── dtos/
    │
    ├── trading/                 # SLICE: Trading (player-to-player & bank)
    │   ├── domain/
    │   │   ├── Trade.ts        # Trade entity
    │   │   ├── TradeType.ts    # Enum
    │   │   ├── Port.ts         # Port entity
    │   │   ├── events/         # TradeProposed, TradeAccepted, TradeExecuted
    │   │   └── rules/          # Trade validation
    │   ├── application/
    │   │   ├── commands/       # ProposeTrade, AcceptTrade, ExecuteBankTrade
    │   │   └── handlers/
    │   └── presentation/
    │       └── dtos/
    │
    ├── robber/                  # SLICE: Robber mechanics
    │   ├── domain/
    │   │   ├── Robber.ts       # Robber entity
    │   │   ├── events/         # RobberMoved, CardStolen, CardsDiscarded
    │   │   └── rules/          # Stealing rules, discard rules
    │   ├── application/
    │   │   ├── commands/       # MoveRobber, StealCard, DiscardCards
    │   │   └── handlers/
    │   └── presentation/
    │       └── dtos/
    │
    ├── development-cards/       # SLICE: Development cards
    │   ├── domain/
    │   │   ├── DevelopmentCard.ts      # Card entity
    │   │   ├── DevelopmentCardType.ts  # Enum
    │   │   ├── CardDeck.ts             # Deck management
    │   │   ├── events/                 # CardBought, CardPlayed, LargestArmyChanged
    │   │   └── rules/                  # Play restrictions
    │   ├── application/
    │   │   ├── commands/       # BuyCard, PlayKnight, PlayRoadBuilding, etc.
    │   │   └── handlers/
    │   └── presentation/
    │       └── dtos/
    │
    ├── victory/                 # SLICE: Victory points & win conditions
    │   ├── domain/
    │   │   ├── VictoryPoints.ts        # VP calculation
    │   │   ├── LongestRoad.ts          # Longest road tracking
    │   │   ├── LargestArmy.ts          # Largest army tracking
    │   │   ├── events/                 # VictoryPointsChanged, GameWon
    │   │   └── rules/                  # Win condition (10 VP)
    │   ├── application/
    │   │   ├── queries/        # GetVictoryPoints
    │   │   └── services/       # VP calculation, longest road algorithm
    │   └── presentation/
    │       └── dtos/
    │
    ├── infrastructure/          # Game-wide infrastructure
    │   ├── GameRepository.ts   # In-memory game repository
    │   └── GameEventStore.ts   # Game-specific event store
    │
    └── presentation/            # Game-wide presentation layer
        ├── GameGateway.ts      # Main WebSocket gateway for gameplay
        └── dtos/               # Shared game DTOs
```

---

## Workplan

### Phase 1: Foundation & Infrastructure

- [ ] **Rename & Restructure Common**
  - [ ] Rename `common/` to `shared/`
  - [ ] Move existing common code to appropriate shared locations

- [ ] **Event Infrastructure**
  - [ ] Create base Event, DomainEvent interfaces in `shared/events/`
  - [ ] Implement in-memory EventStore with append/get/replay methods
  - [ ] Create EventBus for pub-sub within application
  - [ ] Add event versioning support for future schema evolution

- [ ] **WebSocket Infrastructure**
  - [ ] Install @nestjs/websockets and @nestjs/platform-socket.io
  - [ ] Create WebSocketGateway base class in `shared/websocket/`
  - [ ] Implement room management (game rooms, lobby rooms)
  - [ ] Add connection/disconnection handling with reconnection logic
  - [ ] Create base DTOs and validation decorators

- [ ] **Shared Domain Primitives**
  - [ ] Create base classes in `shared/domain/` (ValueObject, Entity, AggregateRoot)
  - [ ] Create ID value objects in `shared/types/` (PlayerId, GameId, LobbyId)
  - [ ] Add Result<T, E> type for error handling
  - [ ] Enhance AggregateRoot base class with event tracking

- [ ] **Restructure Existing Game Domain**
  - [ ] Move existing domain code to `game/shared-domain/`
  - [ ] Keep board/, coordinate/, distance/, tile/ structure
  - [ ] Extract Direction.ts to `game/shared-domain/`

- [ ] **Testing Infrastructure**
  - [ ] Set up test utilities for event store testing
  - [ ] Create WebSocket testing helpers
  - [ ] Add in-memory test doubles for repositories

### Phase 2: Lobby Bounded Context (Vertical Slice)

- [ ] **Lobby Domain** (`lobby/domain/`)
  - [ ] Lobby aggregate (id, players, settings, status)
  - [ ] LobbyPlayer entity
  - [ ] LobbySettings value object
  - [ ] Create `events/` with: PlayerJoined, PlayerLeft, LobbySettingsChanged, GameStartRequested
  - [ ] Create `rules/` for: max players validation, ready state logic, host privileges

- [ ] **Lobby Application Layer** (`lobby/application/`)
  - [ ] `commands/`: CreateLobby, JoinLobby, LeaveLobby, UpdateLobbySettings, StartGame
  - [ ] `handlers/`: Implement command handlers
  - [ ] Domain services for lobby orchestration

- [ ] **Lobby Infrastructure** (`lobby/infrastructure/`)
  - [ ] LobbyRepository with in-memory implementation
  - [ ] Lobby event persistence integration

- [ ] **Lobby WebSocket Presentation** (`lobby/presentation/`)
  - [ ] LobbyGateway with Socket.IO
  - [ ] Create `dtos/` for all lobby commands and responses
  - [ ] Room-based broadcasting for lobby updates
  - [ ] Handle lobby commands via WebSocket events
  - [ ] Emit lobby state changes to all players

### Phase 3: Game Shared Domain & Infrastructure

- [ ] **Game Aggregate** (`game/shared-domain/`)
  - [ ] Game aggregate (id, players, board, state, currentTurn)
  - [ ] Player entity (id, color, resources, buildings, cards, victoryPoints)
  - [ ] GameState enum (SETUP, INITIAL_PLACEMENT, PLAYING, FINISHED)
  - [ ] Core game events: GameCreated, GameStateChanged

- [ ] **Game Infrastructure** (`game/infrastructure/`)
  - [ ] GameRepository with in-memory implementation
  - [ ] GameEventStore for game-specific events
  - [ ] Game state reconstruction from events

- [ ] **Game WebSocket Gateway** (`game/presentation/`)
  - [ ] GameGateway for game-specific communication
  - [ ] Game room management
  - [ ] Base game state broadcasting

### Phase 4: Setup Slice

- [ ] **Setup Domain** (`game/setup/domain/`)
  - [ ] SetupPhase value object
  - [ ] Create `events/`: InitialSettlementPlaced, InitialRoadPlaced, SetupPhaseCompleted
  - [ ] Create `rules/`: placement order logic, initial placement validation

- [ ] **Setup Application** (`game/setup/application/`)
  - [ ] `commands/`: PlaceInitialSettlement, PlaceInitialRoad, CompleteSetupPhase
  - [ ] `handlers/`: Implement command handlers
  - [ ] Setup orchestration service

- [ ] **Setup Presentation** (`game/setup/presentation/`)
  - [ ] Create `dtos/` for placement commands
  - [ ] Wire up to GameGateway
  - [ ] Broadcast placement actions to all players

### Phase 5: Turns Slice

- [ ] **Turns Domain** (`game/turns/domain/`)
  - [ ] Turn aggregate with current player, phase, actions taken
  - [ ] TurnPhase enum (ROLL_DICE, MAIN_PHASE, DISCARD_PHASE)
  - [ ] Create `events/`: TurnStarted, PhaseChanged, TurnEnded
  - [ ] Turn transition rules

- [ ] **Turns Application** (`game/turns/application/`)
  - [ ] `commands/`: StartTurn, EndTurn, ChangePhase
  - [ ] `handlers/`: Implement command handlers
  - [ ] Automatic turn progression service

- [ ] **Turns Presentation** (`game/turns/presentation/`)
  - [ ] Create `dtos/` for turn commands
  - [ ] Emit turn change notifications
  - [ ] Broadcast current player and phase

### Phase 6: Resources Slice

- [ ] **Resources Domain** (`game/resources/domain/`)
  - [ ] Dice value object (validation 2-12)
  - [ ] ResourceType enum (already exists in shared-domain/tile/)
  - [ ] Create `events/`: DiceRolled, ResourcesProduced, SevenRolled
  - [ ] Create `rules/`: resource production calculation based on dice

- [ ] **Resources Application** (`game/resources/application/`)
  - [ ] `commands/`: RollDice
  - [ ] `handlers/`: Implement command handlers
  - [ ] `services/`: ResourceProductionService, DistributeResources

- [ ] **Resources Presentation** (`game/resources/presentation/`)
  - [ ] Create `dtos/` for dice roll
  - [ ] Emit dice roll results with animation data
  - [ ] Broadcast resource distribution

### Phase 7: Buildings Slice

- [ ] **Buildings Domain** (`game/buildings/domain/`)
  - [ ] Building entity with location, owner, type
  - [ ] BuildingType enum (SETTLEMENT, CITY, ROAD)
  - [ ] BuildingCost value object (resource requirements)
  - [ ] Create `events/`: SettlementBuilt, CityUpgraded, RoadBuilt
  - [ ] Create `rules/`: placement validation (distance rule, connectivity)

- [ ] **Buildings Application** (`game/buildings/application/`)
  - [ ] `commands/`: BuildSettlement, UpgradeToCity, BuildRoad
  - [ ] `handlers/`: Implement command handlers
  - [ ] `services/`: ValidatePlacementService, DeductResourcesService

- [ ] **Buildings Presentation** (`game/buildings/presentation/`)
  - [ ] Create `dtos/` for building commands
  - [ ] Emit building placement to all players
  - [ ] Update player resources and buildings state

### Phase 8: Trading Slice

- [ ] **Trading Domain** (`game/trading/domain/`)
  - [ ] Trade entity (proposer, receiver, offering, requesting)
  - [ ] TradeType enum (PLAYER_TRADE, BANK_TRADE, PORT_TRADE)
  - [ ] Port entity/value object (3:1, 2:1 specific)
  - [ ] Create `events/`: TradeProposed, TradeAccepted, TradeRejected, TradeExecuted
  - [ ] Create `rules/`: trade validation, port eligibility

- [ ] **Trading Application** (`game/trading/application/`)
  - [ ] `commands/`: ProposePlayerTrade, AcceptTrade, RejectTrade, ExecuteBankTrade, ExecutePortTrade
  - [ ] `handlers/`: Implement command handlers
  - [ ] Trade orchestration service

- [ ] **Trading Presentation** (`game/trading/presentation/`)
  - [ ] Create `dtos/` for trading commands
  - [ ] Broadcast trade proposals to all players
  - [ ] Emit trade acceptance/rejection
  - [ ] Update resource counts after trade

### Phase 9: Robber Slice

- [ ] **Robber Domain** (`game/robber/domain/`)
  - [ ] Robber entity with current position
  - [ ] Create `events/`: RobberMoved, CardStolen, CardsDiscarded
  - [ ] Create `rules/`: stealing rules (random from adjacent), discard rules (>7 cards when 7 rolled)

- [ ] **Robber Application** (`game/robber/application/`)
  - [ ] `commands/`: MoveRobber, StealCard, DiscardCards
  - [ ] `handlers/`: Implement command handlers
  - [ ] `services/`: CalculatePlayersToDiscard

- [ ] **Robber Presentation** (`game/robber/presentation/`)
  - [ ] Create `dtos/` for robber commands
  - [ ] Emit robber movement
  - [ ] Notify player of stolen card (privately)
  - [ ] Broadcast discard phase to affected players

### Phase 10: Development Cards Slice

- [ ] **Development Cards Domain** (`game/development-cards/domain/`)
  - [ ] DevelopmentCard entity
  - [ ] DevelopmentCardType enum (KNIGHT, VICTORY_POINT, ROAD_BUILDING, YEAR_OF_PLENTY, MONOPOLY)
  - [ ] CardDeck value object/entity for deck management
  - [ ] Create `events/`: CardBought, CardPlayed, KnightPlayed, LargestArmyChanged
  - [ ] Create `rules/`: play restrictions (can't play same turn bought)

- [ ] **Development Cards Application** (`game/development-cards/application/`)
  - [ ] `commands/`: BuyDevelopmentCard, PlayKnight, PlayRoadBuilding, PlayYearOfPlenty, PlayMonopoly
  - [ ] `handlers/`: Implement command handlers
  - [ ] `services/`: CalculateLargestArmy

- [ ] **Development Cards Presentation** (`game/development-cards/presentation/`)
  - [ ] Create `dtos/` for card commands
  - [ ] Broadcast card purchases (hide type from others)
  - [ ] Emit card play effects
  - [ ] Update largest army holder

### Phase 11: Victory Slice

- [ ] **Victory Domain** (`game/victory/domain/`)
  - [ ] VictoryPoints value object
  - [ ] LongestRoad value object/entity (tracking)
  - [ ] LargestArmy value object/entity (tracking)
  - [ ] Create `events/`: VictoryPointsChanged, LongestRoadChanged, LargestArmyChanged, GameWon
  - [ ] Create `rules/`: VP sources (settlements=1, cities=2, etc.), win condition (10 VP)

- [ ] **Victory Application** (`game/victory/application/`)
  - [ ] `queries/`: GetVictoryPoints (read model)
  - [ ] `services/`: CalculateVictoryPoints, CalculateLongestRoad, CheckWinCondition
  - [ ] Event handlers for VP changes

- [ ] **Victory Presentation** (`game/victory/presentation/`)
  - [ ] Create `dtos/` for victory point updates
  - [ ] Emit victory point updates
  - [ ] Broadcast longest road changes
  - [ ] Emit game won event with winner

### Phase 12: Integration & Polish

- [ ] **Cross-Slice Integration**
  - [ ] Wire up all event handlers across slices
  - [ ] Ensure event ordering and consistency
  - [ ] Test full game flow from lobby to win

- [ ] **Error Handling**
  - [ ] Create domain-specific error types
  - [ ] Add error responses to WebSocket messages
  - [ ] Implement graceful degradation for disconnections

- [ ] **Game State Queries**
  - [ ] Create read models for game state
  - [ ] Implement GetGameState query
  - [ ] Optimize for frequent client state requests

- [ ] **Reconnection Logic**
  - [ ] Handle player disconnects/reconnects
  - [ ] Restore game state for reconnecting players
  - [ ] Pause/resume game logic for disconnections

### Phase 13: Extensibility Preparation

- [ ] **Extension Points**
  - [ ] Create extension interfaces for new tile types
  - [ ] Design hook system for custom game rules
  - [ ] Document how to add new vertical slices
  - [ ] Create base classes for new building types

- [ ] **Configuration System**
  - [ ] Game variant configuration (base game, expansions)
  - [ ] Feature flags for different rule sets
  - [ ] Board generation strategies (classic, random, custom)

### Phase 14: Testing & Documentation

- [ ] **Unit Tests**
  - [ ] Test all domain logic (aggregates, value objects, rules)
  - [ ] Test all command handlers
  - [ ] Test all event handlers

- [ ] **Integration Tests**
  - [ ] Test WebSocket message flows
  - [ ] Test event store persistence and replay
  - [ ] Test full game scenarios

- [ ] **Documentation**
  - [ ] Architecture decision records (ADRs)
  - [ ] API documentation for WebSocket events
  - [ ] Game rules documentation
  - [ ] Developer onboarding guide

---

## Notes & Considerations

### Vertical Slice Structure

Each slice follows this consistent structure:

```
slice-name/
├── domain/              # Domain models, aggregates, events, rules
│   ├── events/          # Domain events for this slice
│   └── rules/           # Business rules & validations
├── application/         # Commands, queries, handlers, services
│   ├── commands/        # Command objects
│   ├── handlers/        # Command/event handlers
│   ├── queries/         # Query objects (if needed)
│   └── services/        # Application/domain services
├── infrastructure/      # Persistence, external integrations (when needed)
└── presentation/        # WebSocket handlers, DTOs, validation
    └── dtos/            # Data transfer objects
```

### Key Architectural Decisions

**1. Two Bounded Contexts:**

- **Lobby**: Everything before the game starts (matchmaking, player joining)
- **Game**: All gameplay mechanics (each feature is a vertical slice within this context)

**2. Shared Kernel:**

- `shared/`: Cross-cutting infrastructure used by both bounded contexts
- `game/shared-domain/`: Domain models shared across game slices (Player, Game, Board)

**3. Vertical Slices in Game Context:**

- Each gameplay feature (setup, turns, resources, etc.) is a self-contained slice
- Slices communicate via domain events through the EventBus
- Each slice owns its own domain logic and presentation layer

**4. No "slices" folder:**

- Lobby is a top-level bounded context (single vertical slice)
- Game slices are organized directly under `game/` by feature name
- More natural navigation: `game/buildings/` instead of `game/slices/building/`

### Event-Driven Considerations

- Events are immutable and represent facts
- Use past tense for event names (PlayerJoined, not JoinPlayer)
- Event store is append-only
- Game state is rebuilt from events on load
- Consider event snapshots for long games (future optimization)

### WebSocket Message Format

```typescript
{
  type: 'command' | 'event' | 'query',
  payload: { /* command/event/query specific data */ },
  gameId?: string,
  playerId?: string,
  timestamp: number
}
```

### Scalability Considerations

- In-memory design limits to single instance for now
- Future: Add Redis for distributed game state
- Future: Add message queue (RabbitMQ/Redis) for event distribution
- Future: Add database persistence for game history

### Security Considerations

- Validate all player actions (is it their turn, do they have resources, etc.)
- Prevent cheating via client manipulation
- Implement proper authentication/authorization
- Rate limiting on WebSocket commands

### Performance Considerations

- Optimize event replay for large event logs
- Use projection/read models for complex queries
- Batch resource distribution calculations
- Minimize WebSocket message frequency

### Extension Examples (Future)

- **5-6 Player Extension**: Add player slots in lobby, adjust resource distribution
- **Cities & Knights**: New vertical slices for barbarians, commodities, progress cards
- **Seafarers**: Extend board with sea tiles, ships, island discovery
- **Custom Scenarios**: Plugin system for special maps and rules

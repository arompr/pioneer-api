# Player Token Security Implementation Plan

## Problem

Players currently have two UUIDs: `id` (the "secret") and `publicKey`. The secret is sent in request bodies
as plaintext and stored as plaintext. If the DB is read, all player secrets are immediately usable. There is
no protection at rest and no meaningful distinction between "public" and "secret" in practice.

## Solution Overview

Replace the dual-UUID scheme with a single `id: PlayerId` (the public player identifier) and a new
`token: PlayerToken` value object (the authentication credential). The token is:

- Generated as 64 random hex chars (`crypto.randomBytes(32)`)
- Split into an 8-char **lookup prefix** (stored plaintext, used to locate the record) and the remaining
  **secret body**
- Hashed with `scryptSync` and a per-token random salt before storage
- Returned to the client **once** at player creation — never again

Verification: client sends the raw token → split into prefix + body → find player by prefix in lobby →
`scrypt(presented_token, stored_salt)` and compare to stored hash.

No token rotation. The token is valid for the lifetime of the lobby session.

No new npm dependencies — uses Node.js built-in `crypto`.

## Key Architectural Requirements

1. **Prefix, Hash → Value Objects**: `TokenPrefix`, `TokenHash`, and `PlayerToken` (composite VO)
2. **No Raw Values in Storage**: Hash and prefix are VOs, never raw strings in domain
3. **Hashing via Domain Interface**: `HashingService` interface in domain, implemented in infra
4. **Factory Returns Complete Result**: `PlayerTokenFactory.generate()` returns `PlayerToken` with all VOs populated
5. **One-time Return**: Client receives raw token only at creation; never again

## Terminology Changes

| Before                                            | After                                          |
| ------------------------------------------------- | ---------------------------------------------- |
| `publicKey` (exposed to others)                   | `id` (plain player identifier, already exists) |
| `secretKey` (authentication credential, raw UUID) | `token` (hashed credential, `PlayerToken`)     |
| `client.data.secretKey` (WS session)              | `client.data.playerToken`                      |

## Implementation Phases

### Phase 1: Domain Foundation (Value Objects, Factory, Errors, Interfaces)

Create the core domain model:

**IMPLEMENTED:**

- **PlayerTokenPrefix** VO: 8-char hex prefix, immutable, with `equals()` and `value` getter
  - `src/matchmaking/domain/player/token/PlayerTokenPrefix.ts`
- **PlayerTokenHash** VO: scrypt output format `"<salt>:<hash>"`, immutable, with `equals()` and `value` getter
  - `src/matchmaking/domain/player/token/PlayerTokenHash.ts`
- **PlayerToken** VO: composite containing `prefix: PlayerTokenPrefix`, `hash: PlayerTokenHash`
  - `src/matchmaking/domain/player/token/PlayerToken.ts`
  - **NOTE:** Missing `rawValue` field and `verify()` method (to be added)
- **RawPlayerToken** VO: wrapper for raw token string value (additional VO, not in original plan)
  - `src/matchmaking/domain/player/token/RawPlayerToken.ts`
- **PlayerTokenGenerator** interface: generates secure random tokens
  - `src/matchmaking/domain/player/token/PlayerTokenGenerator.ts`
- **HashingService** interface: domain-level contract for token operations
  - `src/matchmaking/domain/player/token/HashingService.ts`
  - Methods: `hash(value: RawPlayerToken): PlayerTokenHash` and `verify(rawToken: RawPlayerToken, hash: PlayerTokenHash): boolean`
  - **NOTE:** Implemented as synchronous methods (not async)
- **PlayerTokenFactory**: generates tokens via `HashingService`
  - `src/matchmaking/domain/player/token/PlayerTokenFactory.ts`
  - Method: `generate(): GeneratePlayerTokenResult` — returns `{ rawToken: RawPlayerToken, token: PlayerToken }`
- **InvalidPlayerTokenError**: domain error for verification failures
  - `src/matchmaking/domain/player/errors/InvalidPlayerTokenError.ts`
  - Property: `public readonly playerToken: string`
- **Player** entity: added `_token: PlayerToken`
  - `src/matchmaking/domain/player/Player.ts`
  - Constructor: `(id, publicKey, token, name, status)`
  - Added `get token(): PlayerToken` accessor
  - **NOTE:** Still has both `id` and `publicKey` - simplification to single `id` deferred

**WILL NOT be IMPLEMENTED:**

- **PlayerToken.verify()** method - needs to be added to `PlayerToken` VO

**Not yet IMPLEMENTED**

- **PlayerFactory** - currently accepts `PlayerToken` as parameter, should inject `PlayerTokenFactory` to generate tokens internally

### Phase 2: Use Cases & Domain Logic

Update aggregates and use cases to work with tokens:

- **Lobby aggregate**: add method to find players by token prefix
  - `src/matchmaking/domain/lobby/Lobby.ts`
  - New method: `findPlayerByTokenPrefix(prefix: string): Player | undefined`
- **LeaveLobbyUseCase**: accept rawToken in DTO, extract prefix, lookup player, verify token
  - `src/matchmaking/usecase/LeaveLobbyUseCase.ts`
  - Steps: extract prefix → find player → verify token → call `lobby.leave(player.id)`
- **MarkReadyUseCase**: same token verification flow
  - `src/matchmaking/usecase/MarkReadyUseCase.ts`
  - Steps: extract prefix → find player → verify token → call `lobby.markAsReady(player.id)`
- Update DTOs: replace `playerId` with `rawToken`
  - `src/matchmaking/usecase/dto/LeaveLobbyDto.ts`
  - `src/matchmaking/usecase/dto/MarkReadyDto.ts`

### Phase 3: HTTP Interface

Update controllers, mappers, and filters:

- Request DTOs: add `token` field
  - `src/matchmaking/interface/http/lobby/request/LeaveLobbyRequest.ts` — `secretKey` → `token`
- HTTP mappers: return token and id, no secretKey/publicKey
  - `src/matchmaking/interface/http/lobby/mapper/PrivatePlayerMapper.ts` — map `token.rawValue!` and `id`
  - `src/matchmaking/interface/http/lobby/mapper/LobbyMapper.ts` — map `id` (no publicKey)
- Response DTOs: id and token fields
  - `src/matchmaking/interface/http/lobby/response/player/PlayerResponse.ts` — add `id`, remove `publicKey`
  - `src/matchmaking/interface/http/lobby/response/player/PrivatePlayerResponse.ts` — add `token` and `id`, remove secretKey/publicKey
- Controller: pass token from request to DTO
  - `src/matchmaking/interface/http/lobby/lobby.controller.ts` — map `leaveRequest.token` to DTO
- HTTP filter: translate `InvalidPlayerTokenError` to 401 response
  - `src/matchmaking/interface/http/lobby/filters/domain/InvalidPlayerTokenErrorFilter.ts`

### Phase 4: WebSocket Interface

Update WS commands, handlers, and responses:

- SyncPlayerCommand: replace `secretKey` with `token` field
  - `src/matchmaking/interface/ws/command/SyncPlayerCommand.ts`
- SyncPlayerCommandHandler: extract prefix, lookup, verify, store in session
  - `src/matchmaking/interface/ws/handlers/SyncPlayerCommandHandler.ts`
  - Steps: extract prefix → find player → verify → store `client.data.playerToken = rawToken`
- MarkReadyCommandHandler: use stored token from session
  - `src/matchmaking/interface/ws/handlers/MarkReadyCommandHandler.ts`
  - Pass `client.data.playerToken` to DTO
- WS responses: id instead of publicKey
  - `src/matchmaking/interface/ws/response/PlayerWsResponse.ts` — add `id`, remove `publicKey`
  - `src/matchmaking/interface/ws/mapper/LobbyMapper.ts` — map `id`
- WS filter: InvalidPlayerTokenErrorFilter error response
  - `src/matchmaking/interface/ws/filters/domain/InvalidPlayerTokenErrorFilter.ts`

### Phase 5: Infrastructure

Implement storage and hashing:

- InMemoryPlayer: replace `publicKey` with token strings
  - `src/matchmaking/infrastructure/db/inMemory/player/InMemoryPlayer.ts`
  - Fields: `tokenPrefix: string`, `tokenHash: string` (instead of `publicKey: string`)
- InMemoryPlayerMapper: deserialize hash back into `TokenHash` VO
  - `src/matchmaking/infrastructure/db/inMemory/player/InMemoryPlayerMapper.ts`
  - Reconstruct `PlayerToken` with VOs but without `rawValue` on load
- InMemoryHashingServiceImpl: crypto.scryptSync implementation
  - `src/matchmaking/infrastructure/crypto/InMemoryHashingServiceImpl.ts`
  - Implements `HashingService` interface using Node.js built-in `crypto` module
  - `hash()`: generate random salt, scrypt, return `TokenHash("salt:hash")`
  - `verify()`: extract salt from stored hash, scrypt presented token, compare

### Phase 6: Testing

Update all tests to match new model:

- PlayerMother: generate tokens via `PlayerTokenFactory`
  - `test/matchmaking/domain/player/PlayerMother.ts`
  - Update factory method to build Player with token
- Entity tests: Player with tokens
  - `test/matchmaking/domain/player/Player.test.ts`
  - Construction and token assertions
- Use case tests: verify token parameter and verification behavior
  - `test/matchmaking/usecase/LeaveLobbyUseCase.test.ts` — pass rawToken, verify token verification
  - `test/matchmaking/usecase/MarkReadyUseCase.test.ts` — pass rawToken, verify token verification
- Mapper tests: token/id roundtrips
  - `test/matchmaking/interface/http/lobby/mapper/PrivatePlayerMapper.test.ts`
  - `test/matchmaking/interface/http/lobby/mapper/LobbyMapper.test.ts`
- Infrastructure tests: token storage/retrieval
  - `test/matchmaking/infrastructure/db/inMemory/lobby/InMemoryLobbyMapper.test.ts`

## Implementation Order

Respect dependency chain:

1. **Phase 1** (foundation): VOs → `HashingService` interface → factories → errors → update entities
2. **Phase 2** (domain logic): Lobby methods, UseCase updates
3. **Phase 3-4** (interfaces): HTTP and WS (can happen in parallel after Phase 2)
4. **Phase 5** (infra): Hasher implementation and storage mappers
5. **Phase 6** (tests): Update fixtures and test cases

All Phases 3-6 depend on completion of Phase 1.

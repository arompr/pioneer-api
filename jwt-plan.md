# JWT Auth Refactoring Plan

## Summary of Changes

- **Domain**: Remove `_publicKey` from `Player`; `Player.id` is the single identity. Add a `JwtTokenService` interface in the domain.
- **Use cases**: Use cases encode the JWT token via the domain `JwtTokenService` interface, returning it as part of their output DTOs.
- **HTTP**: `leave` reads `playerId` from the JWT in the `Authorization: Bearer` header and passes the raw token to the use case.
- **WebSocket**: `SYNC_PLAYER` payload is now just `{ token }` (lobbyId is decoded from the JWT); handler verifies JWT, stores typed `PlayerId` and `LobbyId` on `client.data`.
- **Infrastructure**: Implement `JwtTokenService` using `@nestjs/jwt` with a hardcoded secret.

---

## Detailed Steps

### 1. Install `@nestjs/jwt`

```
npm install @nestjs/jwt
```

### 2. Domain — `Player`

- `src/matchmaking/domain/player/Player.ts`: remove `_publicKey` field and `get publicKey()` accessor; simplify constructor to 3 params (`id`, `name`, `status`)
- `src/matchmaking/domain/player/PlayerFactory.ts`: remove the second `playerIdFactory.generate()` call

### 3. Domain — `JwtTokenService` interface

Create `src/matchmaking/domain/auth/JwtTokenService.ts`:

```ts
export interface JwtTokenService {
    encode(playerId: string, lobbyId: string): string;
    decode(token: string): { playerId: string; lobbyId: string };
}
export const JWT_TOKEN_SERVICE = Symbol('JwtTokenService');
```

### 4. Use cases — return token in output

- `src/matchmaking/usecase/CreateLobbyUseCase.ts`: inject `JwtTokenService`; call `jwtTokenService.encode(player.id.value, lobby.id.value)` and include `token: string` in the returned result
- `src/matchmaking/usecase/JoinLobbyUseCase.ts`: same — inject and encode, return `token: string`
- Output types for both use cases gain a `token` field

### 5. Use cases — `LeaveLobbyUseCase`

- `src/matchmaking/usecase/LeaveLobbyUseCase.ts`: inject `JwtTokenService`; accept `token: string` in DTO instead of `playerId: PlayerId`; call `jwtTokenService.decode(dto.token)` to get `playerId`; construct `new PlayerId(playerId)` internally
- `src/matchmaking/usecase/dto/LeaveLobbyDto.ts`: `playerId: PlayerId` → `token: string`

### 6. Infrastructure — `JwtTokenServiceImpl`

- Create `src/matchmaking/infrastructure/auth/JwtTokenServiceImpl.ts`: implements `JwtTokenService` using `@nestjs/jwt`'s `JwtService` with a hardcoded secret; no expiry set
- `src/matchmaking/interface/http/lobby/lobby.module.ts`: register `JwtModule.register({ secret: 'pioneer-secret' })`; bind `JWT_TOKEN_SERVICE` symbol to `JwtTokenServiceImpl`

### 7. Infrastructure — `InMemoryPlayer` / `InMemoryPlayerMapper`

- `src/matchmaking/infrastructure/db/inMemory/player/InMemoryPlayer.ts`: remove `publicKey` field
- `src/matchmaking/infrastructure/db/inMemory/player/InMemoryPlayerMapper.ts`: remove `publicKey` from `toInMemory` and `toDomain`

### 8. HTTP — response types & mappers

- `src/matchmaking/interface/http/lobby/response/player/PrivatePlayerResponse.ts`: `{ secretKey, publicKey, name, isHost }` → `{ token: string, id: string, name: string, isHost: boolean }`
- `src/matchmaking/interface/http/lobby/response/player/PlayerResponse.ts`: `publicKey: string` → `id: string`
- `src/matchmaking/interface/http/lobby/mapper/PrivatePlayerMapper.ts`: maps `player.id.value` → `id`; `token` comes from the use case output (add `token` param)
- `src/matchmaking/interface/http/lobby/mapper/LobbyMapper.ts`: `player.publicKey.value` → `player.id.value`; field `publicKey` → `id`
- `src/matchmaking/interface/ws/mapper/LobbyMapper.ts`: same rename
- `src/matchmaking/interface/ws/response/PlayerWsResponse.ts`: `publicKey` → `id`

### 9. HTTP — controller & request

- `src/matchmaking/interface/http/lobby/request/LeaveLobbyRequest.ts`: remove `secretKey` field entirely
- `src/matchmaking/interface/http/lobby/lobby.controller.ts`:
    - `create`: `token` is now in the use case output — pass it through to `PrivatePlayerMapper`; no JWT logic in controller
    - `join`: same
    - `leave`: extract `Authorization: Bearer <token>` header; pass raw token string to `LeaveLobbyUseCase` DTO

### 10. WebSocket — `SyncPlayerCommand` & handler

- `src/matchmaking/interface/ws/command/SyncPlayerCommand.ts`: `SyncPlayerCommandPayload` → `{ token: string }` only (lobbyId decoded from JWT)
- `src/matchmaking/interface/ws/handlers/SyncPlayerCommandHandler.ts`:
    - Inject `JwtTokenService`; call `jwtTokenService.decode(command.payload.token)`
    - Extract `playerId` and `lobbyId` from decoded payload
    - Leave previous room if `client.data.lobbyId` is set
    - Join `lobby-${lobbyId}` room
    - Store `client.data.playerId = new PlayerId(playerId)` and `client.data.lobbyId = new LobbyId(lobbyId)` (typed)
    - Remove the `lobby.findPlayer()` lookup — JWT verification is the auth check
- `src/matchmaking/interface/ws/handlers/MarkReadyCommandHandler.ts`: use `client.data.playerId` and `client.data.lobbyId` directly (already typed instances, no wrapping needed)
- `src/matchmaking/interface/ws/LobbyGatewayWs.ts` (`SocketData`): `{ lobbyId: string; secretKey: string }` → `{ lobbyId: LobbyId; playerId: PlayerId }`

---

## Files Affected (Summary)

| File                                                                            | Change                                                           |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/matchmaking/domain/player/Player.ts`                                       | Remove `_publicKey`, `get publicKey()`                           |
| `src/matchmaking/domain/player/PlayerFactory.ts`                                | Remove second `generate()` call                                  |
| `src/matchmaking/domain/auth/JwtTokenService.ts`                                | **New** — domain interface + DI token                            |
| `src/matchmaking/infrastructure/auth/JwtTokenServiceImpl.ts`                    | **New** — `@nestjs/jwt` implementation, hardcoded secret         |
| `src/matchmaking/infrastructure/db/inMemory/player/InMemoryPlayer.ts`           | Remove `publicKey` field                                         |
| `src/matchmaking/infrastructure/db/inMemory/player/InMemoryPlayerMapper.ts`     | Remove `publicKey` mapping                                       |
| `src/matchmaking/usecase/CreateLobbyUseCase.ts`                                 | Inject `JwtTokenService`, return `token`                         |
| `src/matchmaking/usecase/JoinLobbyUseCase.ts`                                   | Inject `JwtTokenService`, return `token`                         |
| `src/matchmaking/usecase/LeaveLobbyUseCase.ts`                                  | Inject `JwtTokenService`, decode token from DTO                  |
| `src/matchmaking/usecase/dto/LeaveLobbyDto.ts`                                  | `playerId: PlayerId` → `token: string`                           |
| `src/matchmaking/interface/http/lobby/lobby.module.ts`                          | Register `JwtModule`, bind `JwtTokenServiceImpl`                 |
| `src/matchmaking/interface/http/lobby/response/player/PrivatePlayerResponse.ts` | `secretKey`/`publicKey` → `token`/`id`                           |
| `src/matchmaking/interface/http/lobby/response/player/PlayerResponse.ts`        | `publicKey` → `id`                                               |
| `src/matchmaking/interface/http/lobby/mapper/PrivatePlayerMapper.ts`            | Use `id` + `token` from use case output                          |
| `src/matchmaking/interface/http/lobby/mapper/LobbyMapper.ts`                    | `player.publicKey.value` → `player.id.value`, `publicKey` → `id` |
| `src/matchmaking/interface/ws/mapper/LobbyMapper.ts`                            | `player.publicKey.value` → `player.id.value`, `publicKey` → `id` |
| `src/matchmaking/interface/ws/response/PlayerWsResponse.ts`                     | `publicKey` → `id`                                               |
| `src/matchmaking/interface/http/lobby/request/LeaveLobbyRequest.ts`             | Remove `secretKey` field                                         |
| `src/matchmaking/interface/http/lobby/lobby.controller.ts`                      | `leave`: extract Bearer token from header, pass to use case      |
| `src/matchmaking/interface/ws/command/SyncPlayerCommand.ts`                     | Payload: `{ token }` only                                        |
| `src/matchmaking/interface/ws/handlers/SyncPlayerCommandHandler.ts`             | JWT decode; store typed `PlayerId`/`LobbyId` in `client.data`    |
| `src/matchmaking/interface/ws/handlers/MarkReadyCommandHandler.ts`              | Use typed `client.data.playerId`/`client.data.lobbyId` directly  |
| `src/matchmaking/interface/ws/LobbyGatewayWs.ts`                                | `SocketData`: typed `PlayerId`/`LobbyId` fields                  |
| All affected tests                                                              | Update for new field names, JWT payloads, removed `publicKey`    |

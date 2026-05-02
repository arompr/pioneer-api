// import { beforeEach, describe, expect, it, vi } from 'vitest';
// import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
// import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
// import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
// import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
// import { CreateLobbyDto } from '#matchmaking/usecase/dto/CreateLobbyDto';
// import { GameMode } from '#game/domain/config/GameMode';
// import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
// import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
// import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
// import type { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
// import type { Player } from '#matchmaking/domain/player/Player';
//
// const PLAYER_NAME = 'hostName';
// const GAME_MODE = GameMode.BASE;
// const { lobby, players } = LobbyMother.baseLobby();
// const TOKEN = 'mock-jwt-token';
//
// const createdLobby = lobby;
// const createdPlayer = players[0];
//
// const mockPlayerFactory: Partial<PlayerFactory> = {
//     create: vi.fn().mockReturnValue(createdPlayer),
// };
// const mockLobbyRepository: Partial<LobbyRepository> = { save: vi.fn() };
// const mockOutboxService: Partial<OutboxService> = { publishEvents: vi.fn() };
// const mockJwtTokenService: Partial<JwtTokenService> = {
//     encode: vi.fn().mockReturnValue(TOKEN),
// };
//
// let useCase: CreateLobbyUseCase;
//
// describe('CreateLobbyUseCase', () => {
//     beforeEach(() => {
//         vi.clearAllMocks();
//         useCase = new CreateLobbyUseCase(
//             mockLobbyRepository as LobbyRepository,
//             mockLobbyFactory as LobbyFactory,
//             mockPlayerFactory as PlayerFactory,
//             mockOutboxService as OutboxService,
//             mockJwtTokenService as JwtTokenService
//         );
//     });
//
//     describe('execute', () => {
//         it('creates and saves the new lobby, and returns a token', () => {
//             const result = useCase.execute(new CreateLobbyDto(PLAYER_NAME, GAME_MODE));
//
//             expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
//             expect(mockLobbyFactoryCreate).toHaveBeenCalledOnce();
//             const callArgs = mockLobbyFactoryCreate.mock.calls[0] as [
//                 LobbyConfig,
//                 Player,
//                 string | undefined,
//             ];
//             const [lobbyConfig, player, gameConfigId] = callArgs;
//
//             expect(lobbyConfig.getGameMode()).toBe(GAME_MODE);
//             expect(lobbyConfig.getMinPlayers()).toBe(3);
//             expect(lobbyConfig.getMaxPlayers()).toBe(4);
//             expect(player).toBe(createdPlayer);
//             expect(gameConfigId).toBeUndefined();
//             expect(mockLobbyRepository.save).toHaveBeenCalledWith(createdLobby);
//             expect(mockJwtTokenService.encode).toHaveBeenCalledWith(
//                 createdPlayer.id,
//                 createdLobby.id
//             );
//             expect(result.createdLobby.id).toBe(lobby.id);
//             expect(result.createdHostPlayer.id).toBe(players[0].id);
//             expect(result.token).toBe(TOKEN);
//         });
//
//         it('passes gameConfigId to lobbyFactory when provided', () => {
//             const gameConfigId = 'test-config-id';
//             const result = useCase.execute(
//                 new CreateLobbyDto(PLAYER_NAME, GAME_MODE, gameConfigId)
//             );
//
//             expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
//             expect(mockLobbyFactoryCreate).toHaveBeenCalledOnce();
//             const callArgs = mockLobbyFactoryCreate.mock.calls[0] as [
//                 LobbyConfig,
//                 Player,
//                 string | undefined,
//             ];
//             const [lobbyConfig, player, passedGameConfigId] = callArgs;
//
//             expect(lobbyConfig.getGameMode()).toBe(GAME_MODE);
//             expect(lobbyConfig.getMinPlayers()).toBe(3);
//             expect(lobbyConfig.getMaxPlayers()).toBe(4);
//             expect(player).toBe(createdPlayer);
//             expect(passedGameConfigId).toBe(gameConfigId);
//             expect(mockLobbyRepository.save).toHaveBeenCalledWith(createdLobby);
//             expect(result.createdLobby.id).toBe(lobby.id);
//             expect(result.createdHostPlayer.id).toBe(players[0].id);
//             expect(result.token).toBe(TOKEN);
//         });
//     });
// });

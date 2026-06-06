import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { JoinLobbyDto } from '#matchmaking/usecase/dto/JoinLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import type { IGameGateway, MatchmakingGameConfig } from '#matchmaking/domain/gateway/GameGateway';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyValidator } from '#matchmaking/domain/lobby/services/LobbyValidator';
import { LobbyFullError } from '#matchmaking/domain/lobby/errors/LobbyFullError';

const PLAYER_NAME = 'newPlayer';
const TOKEN = 'mock-jwt-token';
const MATCHMAKING_GAME_CONFIG: MatchmakingGameConfig = { minPlayers: 2, maxPlayers: 4 };
const { lobby, players } = LobbyMother.baseLobby();
const playerToJoin = players[1];

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn().mockReturnValue(lobby),
    save: vi.fn(),
};
const mockPlayerFactory: Partial<PlayerFactory> = {
    create: vi.fn().mockReturnValue(playerToJoin),
};
const mockOutboxService: Partial<OutboxService> = {
    publishEvents: vi.fn(),
};
const mockJwtTokenService: Partial<JwtTokenService> = {
    encode: vi.fn().mockReturnValue(TOKEN),
};
const mockGameGateway: Partial<IGameGateway> = {
    getMatchmakingGameConfig: vi.fn().mockResolvedValue(MATCHMAKING_GAME_CONFIG),
};
const mockLobbyValidator: Partial<LobbyValidator> = {
    assertCanJoin: vi.fn(),
};

let useCase: JoinLobbyUseCase;

describe('JoinLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new JoinLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockPlayerFactory as PlayerFactory,
            mockOutboxService as OutboxService,
            mockJwtTokenService as JwtTokenService,
            mockGameGateway as IGameGateway,
            mockLobbyValidator as LobbyValidator
        );
        vi.clearAllMocks();
        mockLobbyRepository.findById = vi.fn().mockReturnValue(lobby);
        mockPlayerFactory.create = vi.fn().mockReturnValue(playerToJoin);
        mockOutboxService.publishEvents = vi.fn();
        mockJwtTokenService.encode = vi.fn().mockReturnValue(TOKEN);
        mockGameGateway.getMatchmakingGameConfig = vi
            .fn()
            .mockResolvedValue(MATCHMAKING_GAME_CONFIG);
        mockLobbyValidator.assertCanJoin = vi.fn();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            it('fetches config, validates capacity, adds player, saves, and returns a token', async () => {
                const dto = new JoinLobbyDto(lobby.id, PLAYER_NAME);

                const result = await useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockGameGateway.getMatchmakingGameConfig).toHaveBeenCalledWith(
                    new GameConfigId(lobby.gameConfigId.value)
                );
                expect(mockLobbyValidator.assertCanJoin).toHaveBeenCalledWith(
                    lobby,
                    MATCHMAKING_GAME_CONFIG
                );
                expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(mockJwtTokenService.encode).toHaveBeenCalledWith(playerToJoin.id, lobby.id);
                expect(result.lobby).toBe(lobby);
                expect(result.joinedPlayer).toBe(playerToJoin);
                expect(result.token).toBe(TOKEN);
            });
        });

        describe('when lobby is full', () => {
            it('re-throws LobbyFullError from the validator', async () => {
                mockLobbyValidator.assertCanJoin = vi.fn().mockImplementation(() => {
                    throw new LobbyFullError(lobby.id);
                });
                const dto = new JoinLobbyDto(lobby.id, PLAYER_NAME);

                await expect(useCase.execute(dto)).rejects.toThrow(LobbyFullError);
                expect(mockLobbyRepository.save).not.toHaveBeenCalled();
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', async () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new JoinLobbyDto(lobby.id, PLAYER_NAME);

                await expect(useCase.execute(dto)).rejects.toThrow(LobbyNotFoundError);
                expect(mockGameGateway.getMatchmakingGameConfig).not.toHaveBeenCalled();
                expect(mockLobbyValidator.assertCanJoin).not.toHaveBeenCalled();
            });
        });
    });
});

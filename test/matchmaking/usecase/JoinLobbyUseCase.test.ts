import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { JoinLobbyDto } from '#matchmaking/usecase/dto/JoinLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';

const PLAYER_NAME = 'newPlayer';
const TOKEN = 'mock-jwt-token';
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

let useCase: JoinLobbyUseCase;

describe('JoinLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new JoinLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockPlayerFactory as PlayerFactory,
            mockOutboxService as OutboxService,
            mockJwtTokenService as JwtTokenService
        );
        vi.clearAllMocks();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            it('should add player to lobby, save it, and return a token', () => {
                const dto = new JoinLobbyDto(lobby.id, PLAYER_NAME);

                const result = useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(mockJwtTokenService.encode).toHaveBeenCalledWith(playerToJoin.id, lobby.id);
                expect(result.lobby).toBe(lobby);
                expect(result.joinedPlayer).toBe(playerToJoin);
                expect(result.token).toBe(TOKEN);
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new JoinLobbyDto(lobby.id, PLAYER_NAME);

                expect(() => useCase.execute(dto)).toThrow(LobbyNotFoundError);
            });
        });
    });
});

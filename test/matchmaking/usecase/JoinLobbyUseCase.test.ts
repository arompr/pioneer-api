import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { JoinLobbyDto } from '#matchmaking/usecase/dto/JoinLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import LobbyNotFoundError from '#matchmaking/usecase/errors/LobbyNotFoundError';

const PLAYER_NAME = 'newPlayer';
const { lobby, players } = LobbyMother.baseLobby();
const playerToJoin = players[1];

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn().mockReturnValue(lobby),
    save: vi.fn(),
};
const mockPlayerFactory: Partial<PlayerFactory> = {
    create: vi.fn().mockReturnValue(playerToJoin),
};

let useCase: JoinLobbyUseCase;

describe('JoinLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new JoinLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockPlayerFactory as PlayerFactory
        );
        vi.clearAllMocks();
    });

    describe('execute()', () => {
        describe('when lobby exists', () => {
            it('should add player to lobby and save it', () => {
                const dto = new JoinLobbyDto(lobby.id, PLAYER_NAME);

                const result = useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockPlayerFactory.create).toHaveBeenCalledWith(PLAYER_NAME);
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(result.lobby).toBe(lobby);
                expect(result.joinedPlayer).toBe(playerToJoin);
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

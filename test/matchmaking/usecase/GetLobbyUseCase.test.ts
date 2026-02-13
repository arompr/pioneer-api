import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { GetLobbyDto } from '#matchmaking/usecase/dto/GetLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import LobbyNotFoundError from '#matchmaking/usecase/errors/LobbyNotFoundError';

const { lobby } = LobbyMother.baseLobby();

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn().mockReturnValue(lobby),
};

let useCase: GetLobbyUseCase;

describe('GetLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new GetLobbyUseCase(mockLobbyRepository as LobbyRepository);
        vi.clearAllMocks();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            it('should return the lobby', () => {
                const dto = new GetLobbyDto(lobby.id);

                const result = useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(result).toBe(lobby);
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new GetLobbyDto(lobby.id);

                expect(() => useCase.execute(dto)).toThrow(LobbyNotFoundError);
            });
        });
    });
});

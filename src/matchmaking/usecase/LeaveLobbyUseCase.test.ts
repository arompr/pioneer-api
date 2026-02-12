import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeaveLobbyUseCase } from './LeaveLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LeaveLobbyDto } from './dto/LeaveLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import LobbyNotFoundError from './errors/LobbyNotFoundError';

const { lobby, players } = LobbyMother.baseLobby();
const playerToRemove = players[0]; // The host

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn().mockReturnValue(lobby),
    save: vi.fn(),
};

let useCase: LeaveLobbyUseCase;

describe('LeaveLobbyUseCase', () => {
    beforeEach(() => {
        useCase = new LeaveLobbyUseCase(mockLobbyRepository as LobbyRepository);
        vi.clearAllMocks();
    });

    describe('execute()', () => {
        describe('when lobby exists', () => {
            it('should remove player from lobby and save it', () => {
                const dto = new LeaveLobbyDto(lobby.id, playerToRemove.id);

                const result = useCase.execute(dto);

                console.log(result);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(result.lobby).toBe(lobby);
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new LeaveLobbyDto(lobby.id, playerToRemove.id);

                expect(() => useCase.execute(dto)).toThrow(LobbyNotFoundError);
            });
        });
    });
});

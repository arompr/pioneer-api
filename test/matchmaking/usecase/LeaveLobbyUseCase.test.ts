import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LeaveLobbyDto } from '#matchmaking/usecase/dto/LeaveLobbyDto';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
};

const mockOutboxService: Partial<OutboxService> = {
    publishEvents: vi.fn(),
};

let useCase: LeaveLobbyUseCase;
let lobby: Lobby;
let playerToRemove: Player;

describe('LeaveLobbyUseCase', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.baseLobby();
        lobby = l;
        [playerToRemove] = players;

        mockLobbyRepository.findById = vi.fn().mockReturnValue(lobby);

        useCase = new LeaveLobbyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockOutboxService as OutboxService
        );
        vi.clearAllMocks();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            describe('when the lobby is empty after leaving', () => {
                it('should remove the player from lobby and delete the lobby', () => {
                    const dto = new LeaveLobbyDto(lobby.id, playerToRemove.id);

                    useCase.execute(dto);

                    expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                    expect(mockLobbyRepository.delete).toHaveBeenCalledWith(lobby.id);
                    expect(mockLobbyRepository.save).toHaveBeenCalledTimes(0);
                });
            });

            describe('when the lobby is not empty after leaving', () => {
                it('should remove the player from lobby and save it', () => {
                    lobby = LobbyMother.readyToStartLobby().lobby;
                    mockLobbyRepository.findById = vi.fn().mockReturnValue(lobby);
                    const dto = new LeaveLobbyDto(lobby.id, playerToRemove.id);

                    useCase.execute(dto);

                    expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                    expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                });
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

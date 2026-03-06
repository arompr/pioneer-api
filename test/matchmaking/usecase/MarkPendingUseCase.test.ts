import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';
import { MarkPendingDto } from '#matchmaking/usecase/dto/MarkPendingDto';

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
};

const mockOutboxService: Partial<OutboxService> = {
    publishEvents: vi.fn(),
};

let useCase: MarkPendingUseCase;
let lobby: Lobby;
let playerToMarkReady: Player;

describe('MarkPendingUseCase', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.readyToStartLobby();
        lobby = l;
        playerToMarkReady = players[0];

        mockLobbyRepository.findById = vi.fn().mockReturnValue(lobby);

        useCase = new MarkPendingUseCase(
            mockLobbyRepository as LobbyRepository,
            mockOutboxService as OutboxService
        );
        vi.clearAllMocks();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            it('should mark the player as pending', () => {
                const dto = new MarkPendingDto(lobby.id, playerToMarkReady.id);

                useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(mockOutboxService.publishEvents).toHaveBeenCalledWith(lobby);
                expect(lobby.allPlayers.at(0)?.status).toBe(PlayerStatus.Pending);
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new MarkPendingDto(lobby.id, playerToMarkReady.id);

                expect(() => useCase.execute(dto)).toThrow(LobbyNotFoundError);
            });
        });
    });
});

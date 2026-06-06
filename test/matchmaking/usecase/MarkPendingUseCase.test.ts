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
import type { IGameGateway, MatchmakingGameConfig } from '#matchmaking/domain/gateway/GameGateway';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';

const MATCHMAKING_GAME_CONFIG: MatchmakingGameConfig = { minPlayers: 2, maxPlayers: 4 };

const mockLobbyRepository: Partial<LobbyRepository> = {
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
};

const mockOutboxService: Partial<OutboxService> = {
    publishEvents: vi.fn(),
};

const mockGameGateway: Partial<IGameGateway> = {
    getMatchmakingGameConfig: vi.fn().mockResolvedValue(MATCHMAKING_GAME_CONFIG),
};

let useCase: MarkPendingUseCase;
let lobby: Lobby;
let playerToMarkPending: Player;

describe('MarkPendingUseCase', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.readyToStartLobby();
        lobby = l;
        playerToMarkPending = players[0];

        mockLobbyRepository.findById = vi.fn().mockReturnValue(lobby);

        useCase = new MarkPendingUseCase(
            mockLobbyRepository as LobbyRepository,
            mockOutboxService as OutboxService,
            mockGameGateway as IGameGateway
        );
        vi.clearAllMocks();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            it('should fetch config, mark the player as pending, and publish events', async () => {
                const dto = new MarkPendingDto(lobby.id, playerToMarkPending.id);

                await useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockGameGateway.getMatchmakingGameConfig).toHaveBeenCalledWith(
                    new GameConfigId(lobby.gameConfigId.value)
                );
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(mockOutboxService.publishEvents).toHaveBeenCalledWith(lobby);
                expect(lobby.allPlayers.at(0)?.status).toBe(PlayerStatus.Pending);
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', async () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new MarkPendingDto(lobby.id, playerToMarkPending.id);

                await expect(useCase.execute(dto)).rejects.toThrow(LobbyNotFoundError);
            });
        });
    });
});

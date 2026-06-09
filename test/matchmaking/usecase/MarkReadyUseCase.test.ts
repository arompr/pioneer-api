import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { Player } from '#matchmaking/domain/player/Player';
import { MarkReadyDto } from '#matchmaking/usecase/dto/MarkReadyDto';
import { PlayerStatus } from '#matchmaking/domain/player/PlayerStatus';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyGameConfig } from '#matchmaking/domain/lobby/LobbyGameConfig';

const MATCHMAKING_GAME_CONFIG = new LobbyGameConfig(2, 4);

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

let useCase: MarkReadyUseCase;
let lobby: Lobby;
let playerToMarkReady: Player;

describe('MarkReadyUseCase', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.baseLobby();
        lobby = l;
        playerToMarkReady = players[0];

        mockLobbyRepository.findById = vi.fn().mockReturnValue(lobby);

        useCase = new MarkReadyUseCase(
            mockLobbyRepository as LobbyRepository,
            mockOutboxService as OutboxService,
            mockGameGateway as IGameGateway
        );
        vi.clearAllMocks();
    });

    describe('execute', () => {
        describe('when lobby exists', () => {
            it('should fetch config, mark the player as ready, and publish events', async () => {
                const dto = new MarkReadyDto(lobby.id, playerToMarkReady.id);

                await useCase.execute(dto);

                expect(mockLobbyRepository.findById).toHaveBeenCalledWith(lobby.id);
                expect(mockGameGateway.getMatchmakingGameConfig).toHaveBeenCalledWith(
                    new GameConfigId(lobby.gameConfigId.value)
                );
                expect(mockLobbyRepository.save).toHaveBeenCalledWith(lobby);
                expect(mockOutboxService.publishEvents).toHaveBeenCalledWith(lobby);
                expect(lobby.allPlayers.at(0)?.status).toBe(PlayerStatus.Ready);
            });
        });

        describe('when lobby does not exist', () => {
            it('should throw LobbyNotFoundError', async () => {
                mockLobbyRepository.findById = vi.fn().mockReturnValue(null);
                const dto = new MarkReadyDto(lobby.id, playerToMarkReady.id);

                await expect(useCase.execute(dto)).rejects.toThrow(LobbyNotFoundError);
            });
        });
    });
});

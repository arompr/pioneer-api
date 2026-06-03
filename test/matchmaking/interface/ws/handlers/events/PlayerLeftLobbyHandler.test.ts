import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import { PlayerLeftLobbyHandler } from '#matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';

const { lobby } = LobbyMother.baseLobby();
const player = lobby.allPlayers[0];

const execute = vi.fn().mockReturnValue(lobby);
const mockUseCase: GetLobbyUseCase = {
    execute,
} as unknown as GetLobbyUseCase;

const notifyLobbyUpdated = vi.fn();
const mockNotifier = {
    notifyLobbyUpdated: notifyLobbyUpdated,
} as unknown as LobbyNotifier;

let playerLeftLobbyHandler: PlayerLeftLobbyHandler;

describe('PlayerLeftLobbyHandler', () => {
    beforeEach(() => {
        playerLeftLobbyHandler = new PlayerLeftLobbyHandler(mockNotifier, mockUseCase);
        vi.clearAllMocks();
    });

    describe('handle', () => {
        it('get the lobby and notify lobby', () => {
            const event: UseCaseEvent<PlayerLeftLobby, LobbyId> = {
                aggregateId: lobby.id,
                event: new PlayerLeftLobby(player.id, false),
            };

            playerLeftLobbyHandler.handle(event);

            expect(execute).toHaveBeenCalledWith({ lobbyId: event.aggregateId });
            expect(notifyLobbyUpdated).toHaveBeenCalledWith(lobby);
        });
    });
});

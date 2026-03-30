import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { PlayerLeftLobbyHandler } from '#matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { beforeEach, describe, expect, it, vi } from 'node_modules/vitest/dist';

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
            const playerLeftLobbyEvent = new PlayerLeftLobby(lobby.id, player.id, false);

            playerLeftLobbyHandler.handle(playerLeftLobbyEvent);

            expect(execute).toHaveBeenCalledWith({ lobbyId: lobby.id });
            expect(notifyLobbyUpdated).toHaveBeenCalledWith(lobby);
        });
    });
});

import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import { PlayerLeftLobbyUseCaseEvent } from '#matchmaking/usecase/events/PlayerLeftLobbyUseCaseEvent';
import { PlayerLeftLobbyHandler } from '#matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
            const playerLeftLobbyEvent = new PlayerLeftLobbyUseCaseEvent(
                lobby.id.value,
                player.id,
                false
            );

            playerLeftLobbyHandler.handle(playerLeftLobbyEvent);

            expect(execute).toHaveBeenCalledWith({ lobbyId: playerLeftLobbyEvent.lobbyId });
            expect(notifyLobbyUpdated).toHaveBeenCalledWith(lobby);
        });
    });
});

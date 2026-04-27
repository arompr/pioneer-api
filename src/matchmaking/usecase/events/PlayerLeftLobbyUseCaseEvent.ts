import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerLeftLobbyUseCasePayload = {
    playerId: PlayerId;
    wasHost: boolean;
};

export class PlayerLeftLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby.value;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerLeftLobbyUseCasePayload;

    constructor(lobbyId: LobbyId, playerId: PlayerId, wasHost: boolean) {
        this.lobbyId = lobbyId;
        this.payload = { playerId, wasHost };
    }
}

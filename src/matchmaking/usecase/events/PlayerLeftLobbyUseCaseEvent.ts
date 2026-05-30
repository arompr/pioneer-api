import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class PlayerLeftLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby;
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;
    public readonly wasHost: boolean;

    constructor(lobbyId: LobbyId, playerId: PlayerId, wasHost: boolean) {
        this.lobbyId = lobbyId;
        this.playerId = playerId;
        this.wasHost = wasHost;
    }
}

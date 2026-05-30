import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class PlayerJoinedLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerJoinedLobby;
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;

    constructor(lobbyId: LobbyId, playerId: PlayerId) {
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }
}

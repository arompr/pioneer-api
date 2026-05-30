import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class PlayerJoinedLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerJoinedLobby;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;

    constructor(aggregateId: string, lobbyId: LobbyId, playerId: PlayerId) {
        this.aggregateId = aggregateId;
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }
}

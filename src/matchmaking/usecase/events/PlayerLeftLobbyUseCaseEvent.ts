import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class PlayerLeftLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;
    public readonly wasHost: boolean;

    constructor(aggregateId: string, lobbyId: LobbyId, playerId: PlayerId, wasHost: boolean) {
        this.aggregateId = aggregateId;
        this.lobbyId = lobbyId;
        this.playerId = playerId;
        this.wasHost = wasHost;
    }
}

import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class LobbyHostChangedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyHostChanged;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly newHostId: PlayerId;

    constructor(aggregateId: string, lobbyId: LobbyId, newHostId: PlayerId) {
        this.aggregateId = aggregateId;
        this.lobbyId = lobbyId;
        this.newHostId = newHostId;
    }
}

import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export type LobbyHostChangedUseCasePayload = {
    newHostId: PlayerId;
};

export class LobbyHostChangedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyHostChanged.value;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly payload: LobbyHostChangedUseCasePayload;

    constructor(aggregateId: string, newHostId: PlayerId) {
        this.aggregateId = aggregateId;
        this.lobbyId = new LobbyId(aggregateId);
        this.payload = { newHostId };
    }
}

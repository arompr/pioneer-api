import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export type PlayerMarkedPendingUseCasePayload = {
    playerId: PlayerId;
};

export class PlayerMarkedPendingUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerMarkedPending.value;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerMarkedPendingUseCasePayload;

    constructor(aggregateId: string, playerId: PlayerId) {
        this.aggregateId = aggregateId;
        this.lobbyId = new LobbyId(aggregateId);
        this.payload = { playerId };
    }
}

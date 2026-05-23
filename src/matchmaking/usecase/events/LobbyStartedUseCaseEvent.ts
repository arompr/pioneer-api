import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export type LobbyStartedUseCasePayload = Record<string, never>;

export class LobbyStartedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyStarted.value;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly payload: LobbyStartedUseCasePayload = {};

    constructor(aggregateId: string) {
        this.aggregateId = aggregateId;
        this.lobbyId = new LobbyId(aggregateId);
    }
}

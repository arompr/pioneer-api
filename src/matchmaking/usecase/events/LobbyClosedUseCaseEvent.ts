import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export type LobbyClosedUseCasePayload = Record<string, never>;

export class LobbyClosedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyClosed.value;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly payload: LobbyClosedUseCasePayload = {};

    constructor(aggregateId: string) {
        this.aggregateId = aggregateId;
        this.lobbyId = new LobbyId(aggregateId);
    }
}

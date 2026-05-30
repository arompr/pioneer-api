import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class LobbyClosedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyClosed;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;

    constructor(aggregateId: string, lobbyId: LobbyId) {
        this.aggregateId = aggregateId;
        this.lobbyId = lobbyId;
    }
}

import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export class LobbyClosedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyClosed.value;
    public readonly lobbyId: LobbyId;
    public readonly payload: Record<string, never> = {};

    constructor(lobbyId: LobbyId) {
        this.lobbyId = lobbyId;
    }
}

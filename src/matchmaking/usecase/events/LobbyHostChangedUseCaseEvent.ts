import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type LobbyHostChangedUseCasePayload = {
    newHostId: PlayerId;
};

export class LobbyHostChangedUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.LobbyHostChanged.value;
    public readonly lobbyId: LobbyId;
    public readonly payload: LobbyHostChangedUseCasePayload;

    constructor(lobbyId: LobbyId, newHostId: PlayerId) {
        this.lobbyId = lobbyId;
        this.payload = { newHostId };
    }
}

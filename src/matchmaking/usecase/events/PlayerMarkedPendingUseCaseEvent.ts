import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerMarkedPendingUseCasePayload = {
    playerId: PlayerId;
};

export class PlayerMarkedPendingUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerMarkedPending.value;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerMarkedPendingUseCasePayload;

    constructor(lobbyId: LobbyId, playerId: PlayerId) {
        this.lobbyId = lobbyId;
        this.payload = { playerId };
    }
}

import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerMarkedReadyUseCasePayload = {
    playerId: PlayerId;
};

export class PlayerMarkedReadyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerMarkedReady.value;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerMarkedReadyUseCasePayload;

    constructor(lobbyId: LobbyId, playerId: PlayerId) {
        this.lobbyId = lobbyId;
        this.payload = { playerId };
    }
}

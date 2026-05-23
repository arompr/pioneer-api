import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export type PlayerLeftLobbyUseCasePayload = {
    playerId: PlayerId;
    wasHost: boolean;
};

export class PlayerLeftLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby.value;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerLeftLobbyUseCasePayload;

    constructor(aggregateId: string, playerId: PlayerId, wasHost: boolean) {
        this.aggregateId = aggregateId;
        this.lobbyId = new LobbyId(aggregateId);
        this.payload = { playerId, wasHost };
    }
}

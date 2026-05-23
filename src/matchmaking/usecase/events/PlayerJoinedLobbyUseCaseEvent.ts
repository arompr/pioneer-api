import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export type PlayerJoinedLobbyUseCasePayload = {
    playerId: PlayerId;
};

export class PlayerJoinedLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerJoinedLobby.value;
    public readonly aggregateId: string;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerJoinedLobbyUseCasePayload;

    constructor(aggregateId: string, playerId: PlayerId) {
        this.aggregateId = aggregateId;
        this.lobbyId = new LobbyId(aggregateId);
        this.payload = { playerId };
    }
}

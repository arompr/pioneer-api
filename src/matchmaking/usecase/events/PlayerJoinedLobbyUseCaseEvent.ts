import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerJoinedLobbyUseCasePayload = {
    playerId: PlayerId;
};

export class PlayerJoinedLobbyUseCaseEvent implements UseCaseEvent {
    public readonly type = LobbyEventType.PlayerJoinedLobby.value;
    public readonly lobbyId: LobbyId;
    public readonly payload: PlayerJoinedLobbyUseCasePayload;

    constructor(lobbyId: LobbyId, playerId: PlayerId) {
        this.lobbyId = lobbyId;
        this.payload = { playerId };
    }
}

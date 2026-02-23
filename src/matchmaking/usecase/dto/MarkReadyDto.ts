import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export class MarkReadyDto {
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;

    constructor(lobbyId: LobbyId, playerId: PlayerId) {
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }
}

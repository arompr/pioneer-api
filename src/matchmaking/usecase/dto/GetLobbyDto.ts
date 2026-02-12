import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';

export class GetLobbyDto {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        this.lobbyId = lobbyId;
    }
}

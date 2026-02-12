import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';

export class JoinLobbyDto {
    public readonly lobbyId: LobbyId;
    public readonly playerName: string;

    constructor(lobbyId: LobbyId, playerName: string) {
        this.lobbyId = lobbyId;
        this.playerName = playerName;
    }
}

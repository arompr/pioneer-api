import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';

export class CreateLobbyDto {
    public readonly hostName: string;
    public readonly gameMode: LobbyGameMode;

    constructor(hostName: string, gameMode: LobbyGameMode) {
        this.hostName = hostName;
        this.gameMode = gameMode;
    }
}

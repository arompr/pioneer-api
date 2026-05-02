import { GameMode } from '#game/domain/config/GameMode';

export class CreateLobbyDto {
    public readonly hostName: string;
    public readonly gameMode: GameMode;
    public readonly gameConfigId: string | undefined;

    constructor(hostName: string, gameMode: GameMode, gameConfigId: string | undefined) {
        this.hostName = hostName;
        this.gameMode = gameMode;
        this.gameConfigId = gameConfigId;
    }
}

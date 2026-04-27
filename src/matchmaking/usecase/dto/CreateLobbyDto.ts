import { GameMode } from '#game/domain/config/GameMode';

export class CreateLobbyDto {
    public readonly hostName: string;
    public readonly gameMode: GameMode;

    constructor(hostName: string, gameMode: GameMode) {
        this.hostName = hostName;
        this.gameMode = gameMode;
    }
}

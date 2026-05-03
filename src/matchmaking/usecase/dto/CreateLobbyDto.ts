export class CreateLobbyDto {
    public readonly hostName: string;
    public readonly gameConfigId: string | undefined;

    constructor(hostName: string, gameConfigId: string | undefined = undefined) {
        this.hostName = hostName;
        this.gameConfigId = gameConfigId;
    }
}

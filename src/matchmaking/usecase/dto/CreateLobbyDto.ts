export class CreateLobbyDto {
    public readonly hostName: string;

    constructor(hostName: string) {
        this.hostName = hostName;
    }
}

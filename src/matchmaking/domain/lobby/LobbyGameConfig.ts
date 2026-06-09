export class LobbyGameConfig {
    constructor(
        readonly minPlayers: number,
        readonly maxPlayers: number
    ) {}

    equals(other: LobbyGameConfig): boolean {
        return this.minPlayers === other.minPlayers && this.maxPlayers === other.maxPlayers;
    }
}

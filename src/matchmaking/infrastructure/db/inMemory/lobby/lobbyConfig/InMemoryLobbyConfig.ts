export class InMemoryLobbyConfig {
    constructor(
        public gameConfigId: string,
        public minPlayers: number,
        public maxPlayers: number
    ) {}
}

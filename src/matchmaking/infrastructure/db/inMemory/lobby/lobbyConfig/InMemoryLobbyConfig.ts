export class InMemoryLobbyConfig {
    constructor(
        public mode: string,
        public minPlayers: number,
        public maxPlayers: number
    ) {}
}

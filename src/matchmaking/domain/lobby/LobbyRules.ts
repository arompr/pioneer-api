export class LobbyStartRules {
    constructor(readonly minPlayers: number) {}

    equals(other: LobbyStartRules): boolean {
        return this.minPlayers === other.minPlayers;
    }
}

export class LobbyJoinRules extends LobbyStartRules {
    constructor(
        minPlayers: number,
        readonly maxPlayers: number
    ) {
        super(minPlayers);
    }

    equals(other: LobbyJoinRules): boolean {
        return super.equals(other) && this.maxPlayers === other.maxPlayers;
    }
}

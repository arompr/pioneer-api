/**
 * Value Object representing a unique Lobby identifier.
 */
export class LobbyId {
    /**
     * The unique identifier string.
     */
    private readonly id: string;

    /**
     * Creates a new LobbyId.
     *
     * @param {string} id - Unique identifier of the player.
     */
    constructor(id: string) {
        this.id = id;
    }

    /**
     * Returns the string value of the LobbyId.
     */
    toString(): string {
        return this.id;
    }
}

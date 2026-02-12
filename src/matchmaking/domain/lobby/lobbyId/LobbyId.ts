/**
 * Value Object representing a unique Lobby identifier.
 */
export class LobbyId {
    /**
     * The unique identifier string value.
     */
    private readonly _value: string;

    /**
     * Creates a new LobbyId.
     *
     * @param {string} id - Unique identifier of the player.
     */
    constructor(id: string) {
        this._value = id;
    }

    /**
     * Returns the string value of the LobbyId.
     */
    get value(): string {
        return this._value;
    }

    /**
     * Compares this LobbyId with another for equality.
     *
     * @param {LobbyId} other - The other ID to compare.
     * @returns {boolean} True if the IDs are identical.
     */
    equals(other: LobbyId): boolean {
        return this._value === other._value;
    }
}

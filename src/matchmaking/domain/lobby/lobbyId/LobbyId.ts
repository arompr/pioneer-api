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
     * @param {string} id - Unique identifier of the lobby.
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
     * Compares this LobbyId with another for value equality.
     *
     * @param {LobbyId} other - The LobbyId to compare against.
     * @returns {boolean} True if both LobbyId instances have the same value.
     */
    public equals(other: LobbyId): boolean {
        if (this === other) {
            return true;
        }

        if (!other) {
            return false;
        }

        return this._value === other._value;
    }
}

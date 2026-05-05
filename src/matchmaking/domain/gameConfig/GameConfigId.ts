/**
 * Value Object representing a unique Game Config identifier.
 */
export class GameConfigId {
    /**
     * The unique identifier string value.
     */
    private readonly _value: string;

    /**
     * Creates a new GameConfigId.
     *
     * @param {string} id - Unique identifier of the game configuration.
     */
    constructor(id: string) {
        this._value = id;
    }

    /**
     * Returns the string value of the GameConfigId.
     */
    get value(): string {
        return this._value;
    }

    /**
     * Compares this GameConfigId with another for equality.
     *
     * @param {GameConfigId} other - The other ID to compare.
     * @returns {boolean} True if the IDs are identical.
     */
    equals(other: GameConfigId | undefined): boolean {
        return this._value === other?._value;
    }
}

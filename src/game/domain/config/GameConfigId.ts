import { Identity } from '#common/domain/aggregate/AggregateRoot';

/**
 * Value Object representing a unique GameConfig identifier.
 */
export class GameConfigId implements Identity {
    /**
     * The unique identifier string.
     */
    private readonly _value: string;

    /**
     * Creates a new GameConfigId.
     *
     * @param {string} id - A valid string.
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
    equals(other: GameConfigId): boolean {
        return this._value === other._value;
    }

    /**
     * Returns a string representation of the GameConfigId for debugging.
     *
     * @returns {string} The ID value.
     */
    toString(): string {
        return this._value;
    }
}

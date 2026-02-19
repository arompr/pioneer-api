import { IAggregateId } from '#common/domain/aggregate/AggregateRoot';

/**
 * Value Object representing a unique Player identifier.
 */
export class PlayerId implements IAggregateId {
    /**
     * The unique identifier string.
     */
    private readonly _value: string;

    /**
     * Creates a new PlayerId.
     *
     * @param {string} id - A valid string.
     */
    constructor(id: string) {
        this._value = id;
    }

    /**
     * Returns the string value of the PlayerId.
     */
    get value(): string {
        return this._value;
    }

    /**
     * Compares this PlayerId with another for equality.
     *
     * @param {PlayerId} other - The other ID to compare.
     * @returns {boolean} True if the IDs are identical.
     */
    equals(other: PlayerId): boolean {
        return this._value === other._value;
    }
}

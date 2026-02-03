/**
 * Value Object representing a unique Player identifier.
 */
export class PlayerId {
    /**
     * The unique identifier string.
     */
    private readonly id: string;

    /**
     * Creates a new PlayerId.
     *
     * @param {string} id - A valid UUID string.
     */
    constructor(id: string) {
        this.id = id;
    }

    /**
     * Returns the string value of the PlayerId.
     */
    toString(): string {
        return this.id;
    }

    /**
     * Compares this PlayerId with another for equality.
     *
     * @param {PlayerId} other - The other ID to compare.
     * @returns {boolean} True if the IDs are identical.
     */
    equals(other: PlayerId): boolean {
        return this.id === other.toString();
    }
}

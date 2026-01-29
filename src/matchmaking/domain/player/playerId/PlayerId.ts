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
}

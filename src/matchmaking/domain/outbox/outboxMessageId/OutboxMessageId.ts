import { Identity } from '#common/domain/aggregate/AggregateRoot';

/**
 * Value Object representing a unique OutboxMessage identifier.
 */
export class OutboxMessageId implements Identity {
    /**
     * The unique identifier string value.
     */
    private readonly _value: string;

    /**
     * Creates a new OutboxMessageId.
     *
     * @param {string} id - Unique identifier of the outbox message.
     */
    constructor(id: string) {
        this._value = id;
    }

    /**
     * Returns the string value of the OutboxMessageId.
     */
    get value(): string {
        return this._value;
    }

    /**
     * Compares this OutboxMessageId with another for equality.
     *
     * @param {OutboxMessageId} other - The other ID to compare.
     * @returns {boolean} True if the IDs are identical.
     */
    equals(other: OutboxMessageId): boolean {
        return this._value === other._value;
    }
}

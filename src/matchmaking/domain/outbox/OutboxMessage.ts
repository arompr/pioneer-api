import { Identity } from '#common/domain/aggregate/AggregateRoot';
import { EventPayload } from '#common/domain/events/DomainEvent';
import { OutboxMessageId } from './outboxMessageId/OutboxMessageId';

/**
 * Aggregate representing a domain event stored in the outbox.
 * Represents an event waiting to be published.
 */
export class OutboxMessage {
    /**
     * Unique identifier for this outbox message.
     */
    private readonly _id: OutboxMessageId;

    /**
     * The type of the domain event (e.g., 'PlayerJoinedLobby').
     */
    private readonly _eventType: string;

    /**
     * The serialized payload of the domain event.
     */
    private readonly _eventPayload: EventPayload;

    /**
     * Timestamp when the message was created.
     */
    private readonly _createdAt: Date;

    /**
     * Identifier of the aggregate that generated the event.
     */
    private readonly _aggregateId: Identity;

    /**
     * Creates a new OutboxMessage.
     *
     * @param {OutboxMessageId} id - Unique identifier for the message
     * @param {string} eventType - The type of the domain event
     * @param {EventPayload} eventPayload - The serialized event payload
     * @param {Date} createdAt - When the message was created
     * @param {string} aggregateId - Identifier of the aggregate that generated the event
     */
    constructor(
        id: OutboxMessageId,
        eventType: string,
        eventPayload: EventPayload,
        createdAt: Date,
        aggregateId: Identity
    ) {
        this._id = id;
        this._eventType = eventType;
        this._eventPayload = eventPayload;
        this._createdAt = createdAt;
        this._aggregateId = aggregateId;
    }

    /**
     * Returns the unique identifier of this message.
     */
    get id(): OutboxMessageId {
        return this._id;
    }

    /**
     * Returns the event type.
     */
    get eventType(): string {
        return this._eventType;
    }

    /**
     * Returns the event payload.
     */
    get eventPayload(): EventPayload {
        return this._eventPayload;
    }

    /**
     * Returns the creation timestamp.
     */
    get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * Returns the aggregate identifier.
     */
    get aggregateId(): Identity {
        return this._aggregateId;
    }

    /**
     * Compares this OutboxMessage with another for equality.
     *
     * @param {OutboxMessage} other - The other message to compare.
     * @returns {boolean} True if the messages are identical.
     */
    equals(other: OutboxMessage): boolean {
        return this._id.equals(other._id);
    }
}

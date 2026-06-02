import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { EventPayload } from '#common/domain/events/DomainEvent';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { Identity } from '#common/domain/aggregate/AggregateRoot';

/**
 * Test builder for OutboxMessage domain objects.
 */
export class TestOutboxMessageBuilder {
    private _id: OutboxMessageId = new OutboxMessageId('01JH9ABCDEFGHIJK');
    private _eventType: string = 'PlayerJoinedLobby';
    private _eventPayload: EventPayload = { lobbyId: 'lobby-123' };
    private _createdAt: Date = new Date('2024-01-01T00:00:00Z');
    private _aggregateId: Identity = { value: 'lobby-123' };

    /**
     * Override the id of the OutboxMessage.
     */
    public withId(id: OutboxMessageId): TestOutboxMessageBuilder {
        this._id = id;
        return this;
    }

    /**
     * Override the event type.
     */
    public withEventType(eventType: string): TestOutboxMessageBuilder {
        this._eventType = eventType;
        return this;
    }

    /**
     * Override the event payload.
     */
    public withEventPayload(eventPayload: EventPayload): TestOutboxMessageBuilder {
        this._eventPayload = eventPayload;
        return this;
    }

    /**
     * Override the createdAt timestamp.
     */
    public withCreatedAt(createdAt: Date): TestOutboxMessageBuilder {
        this._createdAt = createdAt;
        return this;
    }

    /**
     * Override the aggregateId.
     */
    public withAggregateId(aggregateId: string): TestOutboxMessageBuilder {
        this._aggregateId = { value: aggregateId };
        return this;
    }

    /**
     * Builds a new OutboxMessage instance with the configured properties.
     */
    public build(): OutboxMessage {
        return new OutboxMessage(
            this._id,
            this._eventType,
            this._eventPayload,
            this._createdAt,
            this._aggregateId
        );
    }
}

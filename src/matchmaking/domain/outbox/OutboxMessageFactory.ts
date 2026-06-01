import { Identity } from '#common/domain/aggregate/AggregateRoot';
import { EventPayload } from '#common/domain/events/DomainEvent';
import { OutboxMessage } from './OutboxMessage';
import { OutboxMessageId } from './outboxMessageId/OutboxMessageId';
import { OutboxMessageIdFactory } from './outboxMessageId/OutboxMessageIdFactory';

/**
 * Factory responsible for creating OutboxMessage instances.
 */
export class OutboxMessageFactory {
    private readonly outboxMessageIdFactory: OutboxMessageIdFactory;

    constructor(outboxMessageIdFactory: OutboxMessageIdFactory) {
        this.outboxMessageIdFactory = outboxMessageIdFactory;
    }

    /**
     * Creates an OutboxMessage from a serialized event.
     *
     * @param {string} eventType - The type identifier of the domain event
     * @param {string} aggregateId - The ID of the aggregate that generated the event
     * @param {EventPayload} payload - The serialized primitive payload
     * @returns {OutboxMessage} A new OutboxMessage instance
     */
    create(eventType: string, aggregateId: Identity, payload: EventPayload): OutboxMessage {
        const id: OutboxMessageId = this.outboxMessageIdFactory.generate();
        const createdAt = new Date();

        return new OutboxMessage(id, eventType, payload, createdAt, aggregateId);
    }
}

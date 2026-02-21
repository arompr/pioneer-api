import { DomainEvent } from '#common/domain/events/DomainEvent';
import { OutboxMessage } from './OutboxMessage';
import { OutboxMessageId } from './outboxMessageId/OutboxMessageId';
import { OutboxMessageIdFactory } from './outboxMessageId/OutboxMessageIdFactory';

/**
 * Factory responsible for creating OutboxMessage instances from domain events.
 */
export class OutboxMessageFactory {
    private readonly outboxMessageIdFactory: OutboxMessageIdFactory;

    constructor(outboxMessageIdFactory: OutboxMessageIdFactory) {
        this.outboxMessageIdFactory = outboxMessageIdFactory;
    }

    /**
     * Creates an OutboxMessage from a domain event.
     *
     * @param {DomainEvent} event - The domain event to convert
     * @param {string} aggregateId - The ID of the aggregate that generated the event
     * @returns {OutboxMessage} A new OutboxMessage instance
     */
    fromDomainEvent(event: DomainEvent, aggregateId: string): OutboxMessage {
        const id: OutboxMessageId = this.outboxMessageIdFactory.generate();
        const createdAt = new Date();

        return new OutboxMessage(id, event.type, event.payload, createdAt, aggregateId);
    }
}

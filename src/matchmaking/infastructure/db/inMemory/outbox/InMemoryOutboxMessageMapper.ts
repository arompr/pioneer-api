import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { InMemoryOutboxMessage } from './InMemoryOutboxMessage';

/**
 * Mapper for converting between OutboxMessage domain entity and InMemoryOutboxMessage storage model.
 */
export class InMemoryOutboxMessageMapper {
    /**
     * Converts a domain OutboxMessage to an in-memory storage model.
     *
     * @param {OutboxMessage} message - The domain message to convert
     * @returns {InMemoryOutboxMessage} The in-memory representation
     */
    static toInMemory(message: OutboxMessage): InMemoryOutboxMessage {
        return new InMemoryOutboxMessage(
            message.id.value,
            message.eventType,
            message.eventPayload,
            message.createdAt,
            message.aggregateId
        );
    }

    /**
     * Converts an in-memory storage model to a domain OutboxMessage.
     *
     * @param {InMemoryOutboxMessage} imMessage - The in-memory message to convert
     * @returns {OutboxMessage} The domain entity
     */
    static toDomain(imMessage: InMemoryOutboxMessage): OutboxMessage {
        return new OutboxMessage(
            new OutboxMessageId(imMessage.id),
            imMessage.eventType,
            imMessage.eventPayload,
            imMessage.createdAt,
            imMessage.aggregateId
        );
    }
}

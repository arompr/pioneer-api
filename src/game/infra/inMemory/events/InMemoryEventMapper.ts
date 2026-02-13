import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { InMemoryEvent } from './InMemoryEvent';

/**
 * Maps between domain events and persisted InMemoryEvent format.
 */
export class InMemoryEventMapper {
    // Temporary. Upgrade to a SchemaRegistry if we update schemas once in production using a reald DB.
    private static readonly SCHEMA_VERSION = 1;

    /**
     * Converts a domain event to an InMemoryEvent for persistence.
     *
     * @param {DomainEvent<EventPayload>} event - The domain event to convert.
     * @param {string} aggregateId - The aggregate root identifier.
     * @param {number} sequence - The sequence number of this event in the aggregate's stream.
     * @returns {InMemoryEvent} The persisted event representation.
     */
    static toInMemoryEvent(
        eventId: string,
        event: DomainEvent<EventPayload>,
        aggregateId: string,
        sequence: number
    ): InMemoryEvent {
        return new InMemoryEvent(
            eventId,
            aggregateId,
            sequence,
            this.SCHEMA_VERSION,
            event.type,
            event.payload
        );
    }
}

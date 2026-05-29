import { PayloadDomainEvent, EventPayload } from '#common/domain/events/DomainEvent';

export interface IEventStore {
    /**
     * Appends events to the store for a given aggregate.
     * @param aggregateId The aggregate root identifier.
     * @param events The domain events to append.
     * @param expectedVersion Optional expected version for optimistic concurrency.
     * @throws {ConcurrencyError} if version mismatch.
     */
    append(
        aggregateId: string,
        events: PayloadDomainEvent<EventPayload>[],
        expectedVersion?: number
    ): void;

    /**
     * Gets all events for a given aggregate.
     * @param aggregateId The aggregate root identifier.
     * @returns Array of domain events.
     */
    getEvents(aggregateId: string): PayloadDomainEvent<EventPayload>[];
}

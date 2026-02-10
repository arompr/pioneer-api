export interface IEventStore {
    /**
     * Appends events to the store for a given aggregate.
     * @param aggregateId The aggregate root identifier.
     * @param events The domain events to append.
     * @param expectedVersion Optional expected version for optimistic concurrency.
     * @throws {ConcurrencyError} if version mismatch.
     */
    append(aggregateId: string, events: DomainEvent[], expectedVersion?: number): void;

    /**
     * Gets all events for a given aggregate.
     * @param aggregateId The aggregate root identifier.
     * @returns Array of domain events.
     */
    getEvents(aggregateId: string): DomainEvent[];

    /**
     * Replays all events in the store.
     * @returns Array of all domain events.
     */
    replay(): DomainEvent[];
}

import { DomainEvent } from '#common/domain/events/DomainEvent';

export class ConcurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConcurrencyError';
    }
}

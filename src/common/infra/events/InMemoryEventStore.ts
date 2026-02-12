import { DomainEvent } from '#common/domain/events/DomainEvent';
import { ConcurrencyError } from './ConcurrencyError';
import { IEventStore } from './IEventStore';

/**
 * In-memory implementation of IEventStore.
 */
export class InMemoryEventStore implements IEventStore {
    private readonly store: Map<string, { events: DomainEvent[]; version: number }> = new Map();

    append(aggregateId: string, events: DomainEvent[], expectedVersion?: number): void {
        const entry = this.store.get(aggregateId);
        const currentVersion = entry ? entry.version : 0;

        if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
            throw new ConcurrencyError(
                `Expected version ${expectedVersion}, got ${currentVersion}`
            );
        }

        if (!entry) {
            this.store.set(aggregateId, { events: [...events], version: events.length });
        } else {
            entry.events.push(...events);
            entry.version += events.length;
        }
    }

    getEvents(aggregateId: string): DomainEvent[] {
        const entry = this.store.get(aggregateId);
        return entry ? [...entry.events] : [];
    }
}

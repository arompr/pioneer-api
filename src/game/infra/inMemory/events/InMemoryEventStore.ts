import { DomainEvent } from '#common/domain/events/DomainEvent';
import { IEventStore } from '#common/infra/events/IEventStore';
import { InMemoryEvent } from './InMemoryEvent';
import { DomainEventMapper } from './DomainEventMapper';
import { ConcurrencyError } from './ConcurrencyError';

/**
 * In-memory implementation of IEventStore.
 */
export class InMemoryEventStore implements IEventStore {
    private readonly store: Map<string, { events: InMemoryEvent[]; version: number }> = new Map();

    append(aggregateId: string, events: DomainEvent[], expectedVersion?: number): void {
        const entry = this.store.get(aggregateId);
        const currentVersion = entry ? entry.version : 0;

        if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
            throw new ConcurrencyError(
                `Expected version ${expectedVersion}, got ${currentVersion}`
            );
        }

        const inMemoryEvents = events.map((event, index) => {
            const sequence = currentVersion + index + 1;
            return DomainEventMapper.toInMemoryEvent(event, aggregateId, sequence);
        });

        if (!entry) {
            this.store.set(aggregateId, { events: [...inMemoryEvents], version: events.length });
        } else {
            entry.events.push(...inMemoryEvents);
            entry.version += events.length;
        }
    }

    getEvents(aggregateId: string): DomainEvent[] {
        const entry = this.store.get(aggregateId);
        return entry ? [...entry.events] : [];
    }

    getInMemoryEvents(aggregateId: string): InMemoryEvent[] {
        const entry = this.store.get(aggregateId);
        return entry ? [...entry.events] : [];
    }
}

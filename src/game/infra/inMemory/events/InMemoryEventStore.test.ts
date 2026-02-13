import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventStore } from './InMemoryEventStore';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { ConcurrencyError } from './ConcurrencyError';

// Test event implementation
class TestEvent implements DomainEvent<{ data: string }> {
    public readonly type = 'TestEvent';
    payload: { data: string };

    constructor(data: string = 'test') {
        this.payload = { data };
    }
}

describe('InMemoryEventStore', () => {
    let eventStore: InMemoryEventStore;
    let aggregateId: string;

    beforeEach(() => {
        eventStore = new InMemoryEventStore();
        aggregateId = 'test-aggregate-1';
    });

    describe('append', () => {
        describe('when appending events to a new aggregate', () => {
            it('stores the events', () => {
                const events = [new TestEvent('event1')];

                eventStore.append(aggregateId, events);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved).toHaveLength(1);
                expect(retrieved[0].type).toBe('TestEvent');
                expect(retrieved[0].payload.data).toBe('event1');
            });

            it('sets the version to the number of events', () => {
                const events = [new TestEvent('event1'), new TestEvent('event2')];

                eventStore.append(aggregateId, events);

                expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(2);
            });

            it('accepts undefined expectedVersion', () => {
                const events = [new TestEvent('event1')];
                expect(() => eventStore.append(aggregateId, events, undefined)).not.toThrow();
                expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(1);
            });

            it('succeeds when expectedVersion is 0', () => {
                const events = [new TestEvent('event1')];
                expect(() => eventStore.append(aggregateId, events, 0)).not.toThrow();
                expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(1);
            });

            it('assigns unique event IDs', () => {
                const events = [new TestEvent('event1'), new TestEvent('event2')];

                eventStore.append(aggregateId, events);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved[0].eventId).toBeDefined();
                expect(retrieved[1].eventId).toBeDefined();
                expect(retrieved[0].eventId).not.toBe(retrieved[1].eventId);
            });

            it('sets the aggregateId on each event', () => {
                const events = [new TestEvent('event1')];

                eventStore.append(aggregateId, events);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved[0].aggregateId).toBe(aggregateId);
            });

            it('sets sequential sequence numbers starting at 1', () => {
                const events = [new TestEvent('event1'), new TestEvent('event2')];

                eventStore.append(aggregateId, events);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved[0].sequence).toBe(1);
                expect(retrieved[1].sequence).toBe(2);
            });

            it('sets the schema version', () => {
                const events = [new TestEvent('event1')];

                eventStore.append(aggregateId, events);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved[0].schemaVersion).toBe(1);
            });
        });

        describe('when appending events to an existing aggregate', () => {
            beforeEach(() => {
                const initialEvents = [new TestEvent('event1'), new TestEvent('event2')];
                eventStore.append(aggregateId, initialEvents);
            });

            it('appends new events to the existing events', () => {
                const newEvents = [new TestEvent('event3')];

                eventStore.append(aggregateId, newEvents);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved).toHaveLength(3);
                expect(retrieved[2].payload.data).toBe('event3');
            });

            it('increments the version', () => {
                const newEvents = [new TestEvent('event3')];

                eventStore.append(aggregateId, newEvents);

                expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(3);
            });

            it('appends multiple events at once', () => {
                const newEvents = [new TestEvent('event3'), new TestEvent('event4')];

                eventStore.append(aggregateId, newEvents);

                expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(4);
            });

            it('appends empty event list without error', () => {
                const initialCount = eventStore.getInMemoryEvents(aggregateId).length;

                eventStore.append(aggregateId, []);

                expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(initialCount);
            });

            it('continues sequence numbers from previous events', () => {
                const newEvents = [new TestEvent('event3'), new TestEvent('event4')];

                eventStore.append(aggregateId, newEvents);

                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved[2].sequence).toBe(3);
                expect(retrieved[3].sequence).toBe(4);
            });
        });

        describe('when using expectedVersion for optimistic concurrency', () => {
            it('throws ConcurrencyError when expected version does not match', () => {
                const events = [new TestEvent('event1')];
                eventStore.append(aggregateId, events);

                const newEvents = [new TestEvent('event2')];
                expect(() => eventStore.append(aggregateId, newEvents, 0)).toThrow(
                    ConcurrencyError
                );
            });

            it('succeeds when expected version matches current version', () => {
                const events = [new TestEvent('event1')];
                eventStore.append(aggregateId, events);

                const newEvents = [new TestEvent('event2')];
                expect(() => eventStore.append(aggregateId, newEvents, 1)).not.toThrow();
            });

            it('allows version 0 for new aggregates', () => {
                const events = [new TestEvent('event1')];
                expect(() => eventStore.append(aggregateId, events, 0)).not.toThrow();
            });

            it('rejects wrong expected version after multiple appends', () => {
                eventStore.append(aggregateId, [new TestEvent('event1')]);
                eventStore.append(aggregateId, [new TestEvent('event2')], 1);
                eventStore.append(aggregateId, [new TestEvent('event3')], 2);

                expect(() => eventStore.append(aggregateId, [new TestEvent('event4')], 2)).toThrow(
                    ConcurrencyError
                );
            });
        });
    });

    describe('getInMemoryEvents', () => {
        describe('when aggregate has no events', () => {
            it('returns an empty array', () => {
                const retrieved = eventStore.getInMemoryEvents(aggregateId);
                expect(retrieved).toEqual([]);
            });
        });

        describe('when aggregate has events', () => {
            beforeEach(() => {
                const events = [new TestEvent('event1'), new TestEvent('event2')];
                eventStore.append(aggregateId, events);
            });

            it('returns all events in order', () => {
                const retrieved = eventStore.getInMemoryEvents(aggregateId);

                expect(retrieved).toHaveLength(2);
                expect(retrieved[0].payload.data).toBe('event1');
                expect(retrieved[1].payload.data).toBe('event2');
            });

            it('returns a copy of the events array', () => {
                const retrieved1 = eventStore.getInMemoryEvents(aggregateId);
                const retrieved2 = eventStore.getInMemoryEvents(aggregateId);

                expect(retrieved1).not.toBe(retrieved2);
                expect(retrieved1).toEqual(retrieved2);
            });
        });

        describe('when getting events for different aggregates', () => {
            it('isolates events by aggregate ID', () => {
                const aggregateId2 = 'test-aggregate-2';

                eventStore.append(aggregateId, [new TestEvent('event1')]);
                eventStore.append(aggregateId2, [new TestEvent('event2')]);

                const events1 = eventStore.getInMemoryEvents(aggregateId);
                const events2 = eventStore.getInMemoryEvents(aggregateId2);

                expect(events1).toHaveLength(1);
                expect(events2).toHaveLength(1);
                expect(events1[0].aggregateId).toBe(aggregateId);
                expect(events2[0].aggregateId).toBe(aggregateId2);
            });
        });
    });

    describe('multiple aggregates', () => {
        it('maintains separate event streams per aggregate', () => {
            const aggregateId2 = 'test-aggregate-2';

            eventStore.append(aggregateId, [new TestEvent('event1'), new TestEvent('event2')]);
            eventStore.append(aggregateId2, [
                new TestEvent('event3'),
                new TestEvent('event4'),
                new TestEvent('event5'),
            ]);

            expect(eventStore.getInMemoryEvents(aggregateId)).toHaveLength(2);
            expect(eventStore.getInMemoryEvents(aggregateId2)).toHaveLength(3);
        });
    });
});

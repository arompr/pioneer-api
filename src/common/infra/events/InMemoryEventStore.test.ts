import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventStore } from './InMemoryEventStore';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { ConcurrencyError } from './ConcurrencyError';

// Test event implementation
class TestEvent extends DomainEvent {
    constructor(
        aggregateId: string,
        public readonly data: string = 'test'
    ) {
        super(aggregateId, 1);
    }
}

describe('InMemoryEventStore', () => {
    let eventStore: InMemoryEventStore;
    let aggregateId: string;

    beforeEach(() => {
        eventStore = new InMemoryEventStore();
        aggregateId = 'test-aggregate-1';
    });

    describe('append()', () => {
        describe('when appending events to a new aggregate', () => {
            it('stores the events', () => {
                const events = [new TestEvent(aggregateId, 'event1')];

                eventStore.append(aggregateId, events);

                const retrieved = eventStore.getEvents(aggregateId);
                expect(retrieved).toHaveLength(1);
                expect(retrieved[0]).toEqual(events[0]);
            });

            it('sets the version to the number of events', () => {
                const events = [
                    new TestEvent(aggregateId, 'event1'),
                    new TestEvent(aggregateId, 'event2'),
                ];

                eventStore.append(aggregateId, events);

                expect(eventStore.getEvents(aggregateId)).toHaveLength(2);
            });

            it('accepts undefined expectedVersion', () => {
                const events = [new TestEvent(aggregateId, 'event1')];
                expect(() => eventStore.append(aggregateId, events, undefined)).not.toThrow();
                expect(eventStore.getEvents(aggregateId)).toHaveLength(1);
            });

            it('succeeds when expectedVersion is 0', () => {
                const events = [new TestEvent(aggregateId, 'event1')];
                expect(() => eventStore.append(aggregateId, events, 0)).not.toThrow();
                expect(eventStore.getEvents(aggregateId)).toHaveLength(1);
            });
        });

        describe('when appending events to an existing aggregate', () => {
            beforeEach(() => {
                const initialEvents = [
                    new TestEvent(aggregateId, 'event1'),
                    new TestEvent(aggregateId, 'event2'),
                ];
                eventStore.append(aggregateId, initialEvents);
            });

            it('appends new events to the existing events', () => {
                const newEvents = [new TestEvent(aggregateId, 'event3')];

                eventStore.append(aggregateId, newEvents);

                const retrieved = eventStore.getEvents(aggregateId);
                expect(retrieved).toHaveLength(3);
                expect((retrieved[2] as TestEvent).data).toBe('event3');
            });

            it('increments the version', () => {
                const newEvents = [new TestEvent(aggregateId, 'event3')];

                eventStore.append(aggregateId, newEvents);

                expect(eventStore.getEvents(aggregateId)).toHaveLength(3);
            });

            it('appends multiple events at once', () => {
                const newEvents = [
                    new TestEvent(aggregateId, 'event3'),
                    new TestEvent(aggregateId, 'event4'),
                ];

                eventStore.append(aggregateId, newEvents);

                expect(eventStore.getEvents(aggregateId)).toHaveLength(4);
            });

            it('appends empty event list without error', () => {
                const initialCount = eventStore.getEvents(aggregateId).length;

                eventStore.append(aggregateId, []);

                expect(eventStore.getEvents(aggregateId)).toHaveLength(initialCount);
            });
        });

        describe('when using expectedVersion for optimistic concurrency', () => {
            it('throws ConcurrencyError when expected version does not match', () => {
                const events = [new TestEvent(aggregateId, 'event1')];
                eventStore.append(aggregateId, events);

                const newEvents = [new TestEvent(aggregateId, 'event2')];
                expect(() => eventStore.append(aggregateId, newEvents, 0)).toThrow(
                    ConcurrencyError
                );
            });

            it('succeeds when expected version matches current version', () => {
                const events = [new TestEvent(aggregateId, 'event1')];
                eventStore.append(aggregateId, events);

                const newEvents = [new TestEvent(aggregateId, 'event2')];
                expect(() => eventStore.append(aggregateId, newEvents, 1)).not.toThrow();
            });

            it('allows version 0 for new aggregates', () => {
                const events = [new TestEvent(aggregateId, 'event1')];
                expect(() => eventStore.append(aggregateId, events, 0)).not.toThrow();
            });

            it('rejects wrong expected version after multiple appends', () => {
                eventStore.append(aggregateId, [new TestEvent(aggregateId, 'event1')]);
                eventStore.append(aggregateId, [new TestEvent(aggregateId, 'event2')], 1);
                eventStore.append(aggregateId, [new TestEvent(aggregateId, 'event3')], 2);

                expect(() =>
                    eventStore.append(aggregateId, [new TestEvent(aggregateId, 'event4')], 2)
                ).toThrow(ConcurrencyError);
            });
        });
    });

    describe('getEvents()', () => {
        describe('when aggregate has no events', () => {
            it('returns an empty array', () => {
                const retrieved = eventStore.getEvents(aggregateId);
                expect(retrieved).toEqual([]);
            });
        });

        describe('when aggregate has events', () => {
            beforeEach(() => {
                const events = [
                    new TestEvent(aggregateId, 'event1'),
                    new TestEvent(aggregateId, 'event2'),
                ];
                eventStore.append(aggregateId, events);
            });

            it('returns all events in order', () => {
                const retrieved = eventStore.getEvents(aggregateId);

                expect(retrieved).toHaveLength(2);
                expect((retrieved[0] as TestEvent).data).toBe('event1');
                expect((retrieved[1] as TestEvent).data).toBe('event2');
            });

            it('returns a copy of the events array', () => {
                const retrieved1 = eventStore.getEvents(aggregateId);
                const retrieved2 = eventStore.getEvents(aggregateId);

                expect(retrieved1).not.toBe(retrieved2);
                expect(retrieved1).toEqual(retrieved2);
            });
        });

        describe('when getting events for different aggregates', () => {
            it('isolates events by aggregate ID', () => {
                const aggregateId2 = 'test-aggregate-2';

                eventStore.append(aggregateId, [new TestEvent(aggregateId, 'event1')]);
                eventStore.append(aggregateId2, [new TestEvent(aggregateId2, 'event2')]);

                const events1 = eventStore.getEvents(aggregateId);
                const events2 = eventStore.getEvents(aggregateId2);

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

            eventStore.append(aggregateId, [
                new TestEvent(aggregateId, 'event1'),
                new TestEvent(aggregateId, 'event2'),
            ]);
            eventStore.append(aggregateId2, [
                new TestEvent(aggregateId2, 'event3'),
                new TestEvent(aggregateId2, 'event4'),
                new TestEvent(aggregateId2, 'event5'),
            ]);

            expect(eventStore.getEvents(aggregateId)).toHaveLength(2);
            expect(eventStore.getEvents(aggregateId2)).toHaveLength(3);
        });
    });
});

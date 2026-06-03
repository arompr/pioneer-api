import { describe, it, expect } from 'vitest';
import { InMemoryEventMapper } from './InMemoryEventMapper';
import { PayloadDomainEvent } from '#common/domain/events/DomainEvent';

class SimpleEvent implements PayloadDomainEvent<{ value: string }> {
    public readonly type = 'SimpleEvent';
    public readonly payload: { value: string };

    constructor(value: string) {
        this.payload = { value };
    }
}

class EmptyPayloadEvent implements PayloadDomainEvent<Record<string, never>> {
    public readonly type = 'EmptyPayloadEvent';
    public readonly payload: Record<string, never> = {};
}

describe('InMemoryEventMapper', () => {
    describe('toInMemoryEvent', () => {
        describe('when converting a simple domain event', () => {
            it('creates an InMemoryEvent with the correct eventId', () => {
                const eventId = 'event-id-123';
                const domainEvent = new SimpleEvent('test-value');
                const aggregateId = 'aggregate-1';
                const sequence = 5;

                const inMemoryEvent = InMemoryEventMapper.toInMemoryEvent(
                    eventId,
                    domainEvent,
                    aggregateId,
                    sequence
                );

                expect(inMemoryEvent.eventId).toBe('event-id-123');
                expect(inMemoryEvent.type).toBe('SimpleEvent');
                expect(inMemoryEvent.aggregateId).toBe('aggregate-1');
                expect(inMemoryEvent.sequence).toBe(5);
                expect(inMemoryEvent.payload).toEqual({ value: 'test-value' });
                expect(inMemoryEvent.schemaVersion).toBe(1);
            });
        });

        describe('when converting an event with empty payload', () => {
            it('creates an InMemoryEvent with empty payload', () => {
                const eventId = 'event-id-123';
                const domainEvent = new EmptyPayloadEvent();
                const aggregateId = 'aggregate-1';
                const sequence = 1;

                const inMemoryEvent = InMemoryEventMapper.toInMemoryEvent(
                    eventId,
                    domainEvent,
                    aggregateId,
                    sequence
                );

                expect(inMemoryEvent.payload).toEqual({});
            });
        });
    });
});

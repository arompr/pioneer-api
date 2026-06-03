import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { Identity } from '#common/domain/aggregate/AggregateRoot';

/**
 * Deserializes a primitive event payload back into a typed domain event instance.
 * Mirror of DomainEventSerializer — used by the outbox processor to reconstruct
 * domain events before wrapping them in UseCaseEvent for publication.
 */
export interface DomainEventDeserializer {
    deserialize(eventType: string, aggregateId: Identity, payload: EventPayload): DomainEvent;
}

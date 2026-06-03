import { DomainEvent } from '#common/domain/events/DomainEvent';
import { EventPayload } from '#common/domain/events/DomainEvent';

/**
 * Serializes a domain event into a plain primitive payload for outbox persistence.
 */
export interface DomainEventSerializer {
    serialize(event: DomainEvent): EventPayload;
}

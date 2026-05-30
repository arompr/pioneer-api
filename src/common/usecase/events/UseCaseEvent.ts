import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Marker interface for all use case events.
 * Use case events are produced by the outbox-to-eventbus pipeline
 * and carry the aggregate identifier they originated from.
 */
export interface UseCaseEvent extends DomainEvent {
    readonly aggregateId: string;
}

import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Extends DomainEvent with aggregate context.
 * Use case events are produced by the outbox-to-eventbus pipeline and carry
 * the aggregateId that was stored alongside the domain event payload.
 */
export interface UseCaseEvent extends DomainEvent {
    readonly aggregateId: string;
}

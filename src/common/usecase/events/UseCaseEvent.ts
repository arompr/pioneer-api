import { DomainEvent } from '#common/domain/events/DomainEvent';
import { Identity } from '#common/domain/aggregate/AggregateRoot';

/**
 * Wrapper that enriches a domain event with its aggregate identifier for external publication.
 * Produced by the outbox-to-eventbus pipeline.
 */
export interface UseCaseEvent<
    TEvent extends DomainEvent = DomainEvent,
    TId extends Identity = Identity,
> {
    readonly aggregateId: TId;
    readonly event: TEvent;
}

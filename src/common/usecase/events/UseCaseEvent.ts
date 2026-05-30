import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Use case events share the DomainEvent shape but are conceptually distinct
 * from pure domain events. Defining it as an interface enforces a clearer
 * separation and allows future extensions without conflating with DomainEvent.
 */
export interface UseCaseEvent extends DomainEvent {}

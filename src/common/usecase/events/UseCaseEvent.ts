import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Marker interface for all use case events.
 * Use case events are produced by the outbox-to-eventbus pipeline.
 * Each concrete event carries its own typed aggregate identifier (e.g. lobbyId).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseCaseEvent extends DomainEvent {}

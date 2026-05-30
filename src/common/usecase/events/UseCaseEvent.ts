import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Marker type for all use case events.
 * Use case events are produced by the outbox-to-eventbus pipeline.
 * Each concrete event carries its own typed aggregate identifier (e.g. lobbyId).
 */
export type UseCaseEvent = DomainEvent;

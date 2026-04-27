import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Marker type for use case layer events.
 * Use case events are DomainEvents enriched with typed aggregate context
 * (e.g. lobbyId: LobbyId) as fields relevant to each concrete event.
 */
export type UseCaseEvent = DomainEvent;

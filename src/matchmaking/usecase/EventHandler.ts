import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';

export interface EventHandler<T extends DomainEvent<EventPayload>> {
    handle(event: T): void;
}

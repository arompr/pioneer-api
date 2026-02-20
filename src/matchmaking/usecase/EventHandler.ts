import { DomainEvent } from '#common/domain/events/DomainEvent';

export interface EventHandler<T extends DomainEvent> {
    handle(event: T): void;
}

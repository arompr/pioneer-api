import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { EventHandler } from './EventHandler';

export type EventConstructor<T extends DomainEvent<EventPayload>> = new (...args: any[]) => T;

export interface EventBus {
    publish<T extends DomainEvent<EventPayload>>(event: T): void;
    register<T extends DomainEvent<EventPayload>>(
        eventType: EventConstructor<T>,
        handler: EventHandler<T>
    ): void;
}

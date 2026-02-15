import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { EventBus, EventConstructor } from '#matchmaking/usecase/EventBus';
import { EventHandler } from '#matchmaking/usecase/EventHandler';

export class InMemoryEventBus implements EventBus {
    private handlers = new Map<string, EventHandler<DomainEvent<EventPayload>>[]>();

    publish<T extends DomainEvent<EventPayload>>(event: T): void {
        const eventName = event.constructor.name;
        const eventHandlers = this.handlers.get(eventName);

        eventHandlers?.forEach((handler) => handler.handle(event));
    }

    register<T extends DomainEvent<EventPayload>>(
        eventClass: EventConstructor<T>,
        handler: EventHandler<T>
    ): void {
        const eventName = eventClass.name;
        const current = this.handlers.get(eventName) ?? [];
        this.handlers.set(eventName, [...current, handler]);
    }
}

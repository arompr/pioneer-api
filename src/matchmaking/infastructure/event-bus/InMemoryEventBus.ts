import { DomainEvent } from '#common/domain/events/DomainEvent';
import { EventType } from '#common/domain/events/EventType';
import { EventBus } from '#common/usecase/EventBus';
import { EventHandler } from '#common/usecase/EventHandler';

export class InMemoryEventBus implements EventBus {
    private handlers = new Map<string, EventHandler<DomainEvent>[]>();

    publish<T extends DomainEvent>(event: T): void {
        const eventHandlers = this.handlers.get(event.type);

        eventHandlers?.forEach((handler) => handler.handle(event));
    }

    register<T extends DomainEvent>(eventType: EventType, handler: EventHandler<T>): void {
        const key = eventType.value;
        const current = this.handlers.get(key) ?? [];
        this.handlers.set(key, [...current, handler]);
    }
}

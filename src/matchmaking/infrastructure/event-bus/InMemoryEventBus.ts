import { DomainEvent } from '#common/domain/events/DomainEvent';
import { EventBus } from '#common/usecase/EventBus';
import { EventHandler } from '#common/usecase/EventHandler';

export class InMemoryEventBus implements EventBus {
    private handlers = new Map<string, EventHandler<DomainEvent>[]>();

    publish<T extends DomainEvent>(event: T): void {
        const eventHandlers = this.handlers.get(event.type);

        eventHandlers?.forEach((handler) => handler.handle(event));
    }

    register<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
        const current = this.handlers.get(eventType) ?? [];
        this.handlers.set(eventType, [...current, handler]);
    }
}

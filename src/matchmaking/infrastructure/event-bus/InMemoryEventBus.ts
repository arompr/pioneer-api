import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { EventBus } from '#common/usecase/EventBus';
import { EventHandler } from '#common/usecase/EventHandler';
import { DomainEvent } from '#common/domain/events/DomainEvent';

export class InMemoryEventBus implements EventBus {
    private handlers = new Map<string, EventHandler<DomainEvent>[]>();

    publish<TEvent extends DomainEvent>(event: UseCaseEvent<TEvent>): void {
        const eventHandlers = this.handlers.get(event.event.type);

        eventHandlers?.forEach((handler) => handler.handle(event));
    }

    register<TEvent extends DomainEvent>(eventType: string, handler: EventHandler<TEvent>): void {
        const current = this.handlers.get(eventType) ?? [];
        this.handlers.set(eventType, [...current, handler]);
    }
}

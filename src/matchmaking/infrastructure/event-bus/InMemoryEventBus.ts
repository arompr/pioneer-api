import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { EventBus } from '#common/usecase/EventBus';
import { EventHandler } from '#common/usecase/EventHandler';

export class InMemoryEventBus implements EventBus {
    private handlers = new Map<string, EventHandler<UseCaseEvent>[]>();

    publish<T extends UseCaseEvent>(event: T): void {
        const eventHandlers = this.handlers.get(event.type);

        eventHandlers?.forEach((handler) => handler.handle(event));
    }

    register<T extends UseCaseEvent>(eventType: string, handler: EventHandler<T>): void {
        const current = this.handlers.get(eventType) ?? [];
        this.handlers.set(eventType, [...current, handler]);
    }
}

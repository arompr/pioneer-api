import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { EventBus } from '#matchmaking/usecase/EventBus';
import { EventHandler } from '#matchmaking/usecase/EventHandler';

export class InMemoryEventBus implements EventBus {
    private handlers = new Map<string, EventHandler<DomainEvent>[]>();

    publish<T extends DomainEvent>(event: T): void {
        const eventHandlers = this.handlers.get(event.type);

        eventHandlers?.forEach((handler) => handler.handle(event));
    }

    register<T extends DomainEvent>(eventType: LobbyEventType, handler: EventHandler<T>): void {
        const key = eventType.value;
        const current = this.handlers.get(key) ?? [];
        this.handlers.set(key, [...current, handler]);
    }
}

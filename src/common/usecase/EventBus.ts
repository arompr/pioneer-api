import { DomainEvent } from '#common/domain/events/DomainEvent';
import { EventType } from '#common/domain/events/EventType';
import { EventHandler } from './EventHandler';

export interface EventBus {
    publish<T extends DomainEvent>(event: T): void;
    register<T extends DomainEvent>(eventType: EventType, handler: EventHandler<T>): void;
}

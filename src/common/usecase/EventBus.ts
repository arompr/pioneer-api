import { DomainEvent } from '#common/domain/events/DomainEvent';
import { EventHandler } from './EventHandler';

export interface EventBus {
    publish<T extends DomainEvent>(event: T): void;
    register<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void;
}

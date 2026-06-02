import { UseCaseEvent } from './events/UseCaseEvent';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { EventHandler } from './EventHandler';

export interface EventBus {
    publish<TEvent extends DomainEvent>(event: UseCaseEvent<TEvent>): void;
    register<TEvent extends DomainEvent>(eventType: string, handler: EventHandler<TEvent>): void;
}

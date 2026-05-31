import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { EventHandler } from './EventHandler';

export interface EventBus {
    publish<T extends UseCaseEvent>(event: T): void;
    register<T extends UseCaseEvent>(eventType: string, handler: EventHandler<T>): void;
}

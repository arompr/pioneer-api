import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';

export interface EventHandler<T extends UseCaseEvent> {
    handle(event: T): void;
}

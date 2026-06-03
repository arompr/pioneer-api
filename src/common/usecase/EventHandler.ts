import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { DomainEvent } from '#common/domain/events/DomainEvent';

export interface EventHandler<TEvent extends DomainEvent> {
    handle(event: UseCaseEvent<TEvent>): void;
}

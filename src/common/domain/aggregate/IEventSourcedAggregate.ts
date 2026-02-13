import { DomainEvent, EventPayload } from '../events/DomainEvent';

export interface IEventSourcedAggregate {
    pullDomainEvents(): DomainEvent<EventPayload>[];
}

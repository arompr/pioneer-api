import DomainEvent from '../events/DomainEvent';

export interface IEventSourcedAggregate {
    pullDomainEvents(): DomainEvent[];
}

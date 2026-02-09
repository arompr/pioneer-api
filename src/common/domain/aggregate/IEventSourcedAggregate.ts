import DomainEvent from './DomainEvent';

export interface IEventSourcedAggregate {
    pullDomainEvents(): DomainEvent[];
}

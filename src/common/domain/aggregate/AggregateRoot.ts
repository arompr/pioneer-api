import { DomainEvent } from '../events/DomainEvent';
import { IEventSourcedAggregate } from './IEventSourcedAggregate';

export abstract class AggregateRoot implements IEventSourcedAggregate {
    private domainEvents: DomainEvent[] = [];

    protected record(event: DomainEvent): void {
        this.domainEvents.push(event);
    }

    public pullDomainEvents(): DomainEvent[] {
        return this.domainEvents.splice(0, this.domainEvents.length);
    }
}

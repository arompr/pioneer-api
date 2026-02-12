import { DomainEvent } from '../events/DomainEvent';
import { IEventSourcedAggregate } from './IEventSourcedAggregate';

export abstract class AggregateRoot implements IEventSourcedAggregate {
    private _version = 0;
    private _domainEvents: DomainEvent[] = [];

    protected record(event: DomainEvent): void {
        this._domainEvents.push(event);
        this._version++;
    }

    public pullDomainEvents(): DomainEvent[] {
        return this._domainEvents.splice(0, this._domainEvents.length);
    }

    get version(): number {
        return this._version;
    }
}

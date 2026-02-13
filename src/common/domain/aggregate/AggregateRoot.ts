import { DomainEvent, EventPayload } from '../events/DomainEvent';
import { IEventSourcedAggregate } from './IEventSourcedAggregate';

export abstract class AggregateRoot implements IEventSourcedAggregate {
    private _version = 0;
    private _domainEvents: DomainEvent<EventPayload>[] = [];

    protected record(event: DomainEvent<EventPayload>): void {
        this._domainEvents.push(event);
        this._version++;
    }

    public pullDomainEvents(): DomainEvent<EventPayload>[] {
        return this._domainEvents.splice(0, this._domainEvents.length);
    }

    get version(): number {
        return this._version;
    }
}

import { DomainEvent } from '../events/DomainEvent';
import { IEventSourcedAggregate } from './IEventSourcedAggregate';

/**
 * Interface for domain identifiers.
 * All IDs must have a string value property.
 */
export interface Identity {
    readonly value: string;
}

export abstract class AggregateRoot implements IEventSourcedAggregate {
    private _version = 0;
    private _domainEvents: DomainEvent[] = [];

    /**
     * The unique identifier of the aggregate.
     */
    abstract get id(): Identity;

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

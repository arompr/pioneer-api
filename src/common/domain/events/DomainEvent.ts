/**
 * Base class for all domain events.
 */
export abstract class DomainEvent {
    /**
     * Aggregate root identifier.
     */
    public readonly aggregateId: string;

    /**
     * Event schema version for evolution.
     */
    public readonly schemaVersion: number;

    /**
     * Timestamp of event occurrence.
     */
    public readonly occurredAt: Date;

    constructor(aggregateId: string, schemaVersion: number, occurredAt?: Date) {
        this.aggregateId = aggregateId;
        this.schemaVersion = schemaVersion;
        this.occurredAt = occurredAt ?? new Date();
    }
}

/**
 * Represents a persisted event in the event store.
 * This is an infrastructure concern that wraps domain events with metadata.
 */
export class InMemoryEvent {
    /**
     * Unique identifier for this event.
     */
    public readonly eventId: string;

    /**
     * The aggregate root identifier.
     */
    public readonly aggregateId: string;

    /**
     * The sequence number of this event within the aggregate's event stream.
     */
    public readonly sequence: number;

    /**
     * Event schema version for evolution.
     */
    public readonly schemaVersion: number;

    /**
     * The type of the domain event.
     */
    public readonly type: string;

    /**
     * The serialized event data.
     */
    public readonly payload: Record<string, unknown>;

    constructor(
        eventId: string,
        aggregateId: string,
        sequence: number,
        schemaVersion: number,
        type: string,
        payload: Record<string, unknown>
    ) {
        this.eventId = eventId;
        this.aggregateId = aggregateId;
        this.sequence = sequence;
        this.schemaVersion = schemaVersion;
        this.type = type;
        this.payload = payload;
    }
}

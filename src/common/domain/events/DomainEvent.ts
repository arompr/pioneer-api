export type EventPayload = Record<string, unknown>;

/**
 * Base interface for all domain events.
 */
export interface DomainEvent {
    /**
     * The type of the event.
     * Each domain event must define its own type.
     */
    readonly type: string;
}

/**
 * Domain event that carries a serializable payload.
 * Used by slices that need full event sourcing (e.g., game slice).
 */
export interface PayloadDomainEvent<
    TPayload extends EventPayload = EventPayload,
> extends DomainEvent {
    readonly payload: TPayload;
}

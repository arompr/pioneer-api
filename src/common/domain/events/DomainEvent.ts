/**
 * Base class for all domain events.
 */
export interface DomainEvent<TPayload> {
    /**
     * The type of the event.
     * Each domain event must define its own type.
     */
    readonly type: string;

    readonly payload: TPayload;
}

/**
 * Base class for all domain events.
 */
export interface DomainEvent {
    /**
     * The type of the event.
     * Each domain event must define its own type.
     */
    readonly type: string;
}

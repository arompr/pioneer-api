export type EventPayload = Record<string, unknown>;

/**
 * Base class for all domain events.
 */
export interface DomainEvent<TPayload extends EventPayload = EventPayload> {
    /**
     * The type of the event.
     * Each domain event must define its own type.
     */
    readonly type: string;

    readonly payload: TPayload;
}

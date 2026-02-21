/**
 * Value Object interface for domain event types.
 * Each bounded context defines its own EventType implementation.
 */
export interface EventType {
    readonly value: string;
}

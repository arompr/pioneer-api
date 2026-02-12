import { ulid } from 'ulid';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { InMemoryEvent } from './InMemoryEvent';

/**
 * Maps between DomainEvents and InMemoryEvents.
 */
export class DomainEventMapper {
    /**
     * Converts a DomainEvent to an InMemoryEvent for persistence.
     *
     * @param event The domain event to convert.
     * @param aggregateId The aggregate root identifier.
     * @param sequence The sequence number of this event within the aggregate.
     * @returns An InMemoryEvent ready for persistence.
     */
    static toInMemoryEvent(
        event: DomainEvent,
        aggregateId: string,
        sequence: number
    ): InMemoryEvent {
        const payload = this.extractPayload(event);

        return new InMemoryEvent(
            ulid(),
            aggregateId,
            sequence,
            1, // Default schema version
            event.type,
            payload
        );
    }

    /**
     * Extracts the payload from a domain event.
     * This serializes all properties except the type.
     */
    private static extractPayload(event: DomainEvent): Record<string, unknown> {
        const payload: Record<string, unknown> = {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const proto = Object.getPrototypeOf(event);
        const descriptors = Object.getOwnPropertyDescriptors(proto);

        // Get properties from the instance
        for (const key of Object.keys(event)) {
            if (key !== 'type') {
                payload[key] = (event as unknown as Record<string, unknown>)[key];
            }
        }

        // Get properties from getters
        for (const [key, descriptor] of Object.entries(descriptors)) {
            if (descriptor.get && key !== 'type') {
                payload[key] = (event as unknown as Record<string, unknown>)[key];
            }
        }

        return payload;
    }
}

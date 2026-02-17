import { ulid } from 'ulid';
import { OutboxMessageId } from './OutboxMessageId';

/**
 * Factory responsible for generating OutboxMessageId instances.
 */
export class OutboxMessageIdFactory {
    /**
     * Generates a new unique OutboxMessageId.
     *
     * @returns {OutboxMessageId} A new OutboxMessageId instance
     */
    generate(): OutboxMessageId {
        return new OutboxMessageId(ulid());
    }
}

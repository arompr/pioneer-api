import { OutboxMessage } from './OutboxMessage';
import { OutboxMessageId } from './outboxMessageId/OutboxMessageId';

export const OUTBOX_REPOSITORY = Symbol('OutboxRepository');

/**
 * Repository for managing outbox messages.
 */
export interface OutboxRepository {
    /**
     * Saves an outbox message to the repository.
     *
     * @param {OutboxMessage} message - The message to save
     */
    save(message: OutboxMessage): void;

    /**
     * Saves all outbox messages to the repository.
     *
     * @param {OutboxMessage[]} messages - The messages to save
     */
    saveAll(messages: OutboxMessage[]): void;

    /**
     * Finds all unprocessed messages in the outbox.
     *
     * @returns {OutboxMessage[]} Array of unprocessed messages
     */
    findUnprocessed(): OutboxMessage[];

    /**
     * Deletes a message from the outbox by its ID.
     *
     * @param {OutboxMessageId} id - The ID of the message to delete
     */
    delete(id: OutboxMessageId): void;
}

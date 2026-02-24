import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { OutboxObserver } from '#matchmaking/domain/outbox/OutboxObserver';
import { OutboxRepository } from '#matchmaking/domain/outbox/OutboxRepository';
import { InMemoryOutboxMessage } from './InMemoryOutboxMessage';
import { InMemoryOutboxMessageMapper } from './InMemoryOutboxMessageMapper';

/**
 * In-memory implementation of the OutboxRepository with observer pattern support.
 */
export class InMemoryOutboxRepository implements OutboxRepository {
    private _messages = new Map<string, InMemoryOutboxMessage>();
    private observers: OutboxObserver[] = [];

    /**
     * Registers an observer to be notified when messages are added.
     *
     * @param {OutboxObserver} observer - The observer to register
     */
    registerObserver(observer: OutboxObserver): void {
        this.observers.push(observer);
    }

    /**
     * Saves an outbox message to the repository and notifies observers.
     *
     * @param {OutboxMessage} message - The message to save
     */
    save(message: OutboxMessage): void {
        this._messages.set(message.id.value, InMemoryOutboxMessageMapper.toInMemory(message));
        this.notifyObservers();
    }

    /**
     * Saves all outbox messages to the repository and notifies observers.
     * Does nothing if the messages array is empty.
     *
     * @param {OutboxMessage[]} messages - The messages to save
     */
    saveAll(messages: OutboxMessage[]): void {
        if (messages.length === 0) return;

        for (const message of messages) {
            this._messages.set(message.id.value, InMemoryOutboxMessageMapper.toInMemory(message));
        }

        this.notifyObservers();
    }

    /**
     * Finds and removes all unprocessed messages in the outbox.
     *
     * @returns {OutboxMessage[]} Array of previously unprocessed messages
     */
    findUnprocessed(): OutboxMessage[] {
        if (this._messages.size === 0) {
            return [];
        }

        const messagesSnapshot = Array.from(this._messages.values());

        this._messages.clear();

        return messagesSnapshot.map((imMessage) => InMemoryOutboxMessageMapper.toDomain(imMessage));
    }

    /**
     * Deletes a message from the outbox by its ID.
     *
     * @param {OutboxMessageId} id - The ID of the message to delete
     */
    delete(id: OutboxMessageId): void {
        this._messages.delete(id.value);
    }

    /**
     * Notifies all registered observers that messages have been added.
     */
    private notifyObservers(): void {
        this.observers.forEach((observer) => {
            observer.onMessagesAdded();
        });
    }
}

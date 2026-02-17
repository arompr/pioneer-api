/**
 * Observer interface for outbox message notifications.
 */
export interface OutboxObserver {
    /**
     * Called when new messages are added to the outbox.
     */
    onMessagesAdded(): void;
}

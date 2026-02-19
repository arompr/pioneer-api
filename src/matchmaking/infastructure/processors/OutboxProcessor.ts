import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxObserver } from '#matchmaking/domain/outbox/OutboxObserver';
import { OutboxRepository } from '#matchmaking/domain/outbox/OutboxRepository';
import { EventBus } from '#matchmaking/usecase/EventBus';

/**
 * Processor that asynchronously handles outbox messages.
 * Implements the observer pattern to be notified when new messages are added.
 *
 * Incoming messages are appended to an in-memory queue, and a single
 * processing loop drains that queue by publishing each message to the
 * EventBus and then removing it from the repository. New messages arriving
 * during processing are queued and picked up before the processor becomes idle.
 */
export class OutboxProcessor implements OutboxObserver {
    private isProcessing = false;
    private queue: OutboxMessage[] = [];

    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly eventBus: EventBus
    ) {}

    /**
     * Called when new messages are added to the outbox.
     * We fetch them and append them to the in-memory queue.
     */
    onMessagesAdded(): void {
        const newMessages = this.outboxRepository.findUnprocessed();
        this.queue.push(...newMessages);

        if (!this.isProcessing) {
            this.isProcessing = true;
            this.processQueue();
        }
    }

    /**
     * Processes messages from the in-memory queue until empty.
     * If new messages arrive during processing, they will be appended
     * and naturally picked up before the loop ends.
     */
    private processQueue(): void {
        while (this.queue.length > 0) {
            const message = this.queue.shift()!;

            try {
                const event = this.toDomainEvent(message);
                this.eventBus.publish(event);
            } catch (err) {
                console.error(`Failed to process outbox message ${message.id.value}:`, err);
            }
        }

        this.isProcessing = false;
    }

    private toDomainEvent(message: OutboxMessage): DomainEvent<EventPayload> {
        return {
            type: message.eventType,
            payload: message.eventPayload,
        };
    }
}

import { AggregateRoot } from '#common/domain/aggregate/AggregateRoot';
import { OutboxMessageFactory } from './OutboxMessageFactory';
import { OutboxRepository } from './OutboxRepository';

/**
 * Domain service that handles the process of pulling domain events from
 * an aggregate and persisting them to the outbox repository.
 */
export class OutboxService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly outboxMessageFactory: OutboxMessageFactory
    ) {}

    /**
     * Pulls domain events from an aggregate and saves them to the outbox.
     *
     * @param {AggregateRoot} aggregate - The aggregate to pull events from
     */
    publishEvents(aggregate: AggregateRoot): void {
        const events = aggregate.pullDomainEvents();
        const aggregateId: string = aggregate.id.value;

        const messages = events.map((event) =>
            this.outboxMessageFactory.fromDomainEvent(event, aggregateId)
        );

        this.outboxRepository.saveAll(messages);
    }
}

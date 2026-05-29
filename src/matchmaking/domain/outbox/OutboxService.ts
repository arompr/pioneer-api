import { AggregateRoot } from '#common/domain/aggregate/AggregateRoot';
import { OutboxMessageFactory } from './OutboxMessageFactory';
import { OutboxRepository } from './OutboxRepository';
import { DomainEventSerializer } from './DomainEventSerializer';

/**
 * Domain service that handles the process of pulling domain events from
 * an aggregate and persisting them to the outbox repository.
 */
export class OutboxService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly outboxMessageFactory: OutboxMessageFactory,
        private readonly serializer: DomainEventSerializer
    ) {}

    /**
     * Pulls domain events from an aggregate and saves them to the outbox.
     *
     * @param {AggregateRoot} aggregate - The aggregate to pull events from
     */
    publishEvents(aggregate: AggregateRoot): void {
        const events = aggregate.pullDomainEvents();
        const aggregateId: string = aggregate.id.value;

        const messages = events.map((event) => {
            const payload = this.serializer.serialize(event);
            return this.outboxMessageFactory.create(event.type, aggregateId, payload);
        });

        this.outboxRepository.saveAll(messages);
    }
}

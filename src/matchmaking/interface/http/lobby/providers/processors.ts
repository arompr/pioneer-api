import { Provider } from '@nestjs/common';
import { OUTBOX_REPOSITORY } from '#matchmaking/domain/outbox/OutboxRepository';
import { EVENT_BUS } from './eventBus';
import { OutboxProcessor } from '#matchmaking/infrastructure/processors/OutboxProcessor';
import { InMemoryOutboxRepository } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { EventBus } from '#common/usecase/EventBus';
import { DOMAIN_EVENT_DESERIALIZER } from './deserializer';
import { DomainEventDeserializer } from '#matchmaking/domain/outbox/DomainEventDeserializer';

export const OUTBOX_PROCESSOR = 'OUTBOX_PROCESSOR';

export const processorProviders: Provider[] = [
    {
        provide: OUTBOX_PROCESSOR,
        useFactory: (
            outboxRepository: InMemoryOutboxRepository,
            eventBus: EventBus,
            deserializer: DomainEventDeserializer
        ): OutboxProcessor => {
            const processor = new OutboxProcessor(outboxRepository, eventBus, deserializer);
            outboxRepository.registerObserver(processor);
            return processor;
        },
        inject: [OUTBOX_REPOSITORY, EVENT_BUS, DOMAIN_EVENT_DESERIALIZER],
    },
];

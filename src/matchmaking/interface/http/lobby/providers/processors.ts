import { Provider } from '@nestjs/common';
import { OUTBOX_REPOSITORY } from '#matchmaking/domain/outbox/OutboxRepository';
import { EVENT_BUS } from './eventBus';
import { OutboxProcessor } from '#matchmaking/infastructure/processors/OutboxProcessor';
import { InMemoryOutboxRepository } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { InMemoryEventBus } from '#matchmaking/infastructure/event-bus/InMemoryEventBus';

export const OUTBOX_PROCESSOR = 'OUTBOX_PROCESSOR';

export const processorProviders: Provider[] = [
    {
        provide: OUTBOX_PROCESSOR,
        useFactory: (
            outboxRepository: InMemoryOutboxRepository,
            eventBus: InMemoryEventBus
        ): OutboxProcessor => {
            const processor = new OutboxProcessor(outboxRepository, eventBus);
            outboxRepository.registerObserver(processor);
            return processor;
        },
        inject: [OUTBOX_REPOSITORY, EVENT_BUS],
    },
];

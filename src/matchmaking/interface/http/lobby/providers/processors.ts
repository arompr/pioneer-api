import { Provider } from '@nestjs/common';
import { OUTBOX_REPOSITORY } from '#matchmaking/domain/outbox/OutboxRepository';
import { EVENT_BUS } from './eventBus';
import { OutboxProcessor } from '#matchmaking/infastructure/processors/OutboxProcessor';
import { EventBus } from '#matchmaking/usecase/EventBus';
import { InMemoryOutboxRepository } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxRepository';

export const OUTBOX_PROCESSOR = 'OUTBOX_PROCESSOR';

export const processorProviders: Provider[] = [
    {
        provide: OUTBOX_PROCESSOR,
        useFactory: (
            outboxRepository: InMemoryOutboxRepository,
            eventBus: EventBus
        ): OutboxProcessor => {
            const processor = new OutboxProcessor(outboxRepository, eventBus);
            outboxRepository.registerObserver(processor);
            return processor;
        },
        inject: [OUTBOX_REPOSITORY, EVENT_BUS],
    },
];

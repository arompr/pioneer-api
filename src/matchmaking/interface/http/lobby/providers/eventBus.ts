import { Provider } from '@nestjs/common';
import { InMemoryEventBus } from '#matchmaking/infastructure/event-bus/InMemoryEventBus';
import { registerHandlers } from '#bootstrap/handlers';
import { EventBus } from '#common/usecase/EventBus';

export const EVENT_BUS = 'EVENT_BUS';
export const eventBusProviders: Provider[] = [
    {
        provide: EVENT_BUS,
        useFactory: (): EventBus => {
            const bus = new InMemoryEventBus();
            registerHandlers(bus);
            return bus;
        },
    },
];

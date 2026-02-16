import { Provider } from '@nestjs/common';
import { InMemoryEventBus } from '#matchmaking/infastructure/event-bus/InMemoryEventBus';
import { EventBus } from '#matchmaking/usecase/EventBus';
import { registerHandlers } from '#bootstrap/handlers';

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

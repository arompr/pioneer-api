import { Provider } from '@nestjs/common';
import { InMemoryEventBus } from '#matchmaking/infrastructure/event-bus/InMemoryEventBus';
import { registerHandlers } from '#bootstrap/handlers';
import { EventBus } from '#common/usecase/EventBus';
import { LobbyGateway } from '#matchmaking/interface/ws/LobbyGatewayWs';

export const EVENT_BUS = 'EVENT_BUS';
export const eventBusProviders: Provider[] = [
    {
        provide: EVENT_BUS,
        useFactory: (lobbyGateway: LobbyGateway): EventBus => {
            const bus = new InMemoryEventBus();
            registerHandlers(bus, lobbyGateway);
            return bus;
        },
        inject: [LobbyGateway],
    },
];

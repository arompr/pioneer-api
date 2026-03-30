import { Provider } from '@nestjs/common';
import { InMemoryEventBus } from '#matchmaking/infrastructure/event-bus/InMemoryEventBus';
import { registerHandlers } from '#bootstrap/handlers';
import { EventBus } from '#common/usecase/EventBus';
import { LobbyGateway } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { WsLobbyNotifier } from '#matchmaking/interface/ws/notifier/WsLobbyNotifier';

export const EVENT_BUS = 'EVENT_BUS';
export const eventBusProviders: Provider[] = [
    {
        provide: EVENT_BUS,
        useFactory: (lobbyGateway: LobbyGateway, getLobbyUseCase: GetLobbyUseCase): EventBus => {
            const bus = new InMemoryEventBus();
            const notifier = new WsLobbyNotifier(lobbyGateway);
            registerHandlers(bus, notifier, getLobbyUseCase);
            return bus;
        },
        inject: [LobbyGateway, GetLobbyUseCase],
    },
];

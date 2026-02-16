import { EventBus } from '#matchmaking/usecase/EventBus';
import { WsNotifyPlayerLeftLobbyHandler } from '#matchmaking/infastructure/handlers/WsNotifyPlayerLeftLobbyHandler';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';

export function registerHandlers(bus: EventBus): void {
    bus.register(PlayerLeftLobby, new WsNotifyPlayerLeftLobbyHandler());
}

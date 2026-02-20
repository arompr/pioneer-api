import { EventBus } from '#matchmaking/usecase/EventBus';
import { WsNotifyPlayerLeftLobbyHandler } from '#matchmaking/infastructure/handlers/WsNotifyPlayerLeftLobbyHandler';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';

export function registerHandlers(bus: EventBus): void {
    bus.register(LobbyEventType.PlayerLeftLobby, new WsNotifyPlayerLeftLobbyHandler());
}

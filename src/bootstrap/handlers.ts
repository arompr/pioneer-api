import { WsNotifyPlayerLeftLobbyHandler } from '#matchmaking/infastructure/handlers/WsNotifyPlayerLeftLobbyHandler';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { EventBus } from '#common/usecase/EventBus';

export function registerHandlers(bus: EventBus): void {
    bus.register(LobbyEventType.PlayerLeftLobby, new WsNotifyPlayerLeftLobbyHandler());
}

import { WsNotifyPlayerLeftLobbyHandler } from '#matchmaking/infrastructure/handlers/WsNotifyPlayerLeftLobbyHandler';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { EventBus } from '#common/usecase/EventBus';

export function registerHandlers(bus: EventBus): void {
    bus.register(LobbyEventType.PlayerLeftLobby, new WsNotifyPlayerLeftLobbyHandler());
}

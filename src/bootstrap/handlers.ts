import { WsNotifyPlayerLeftLobbyHandler } from '#matchmaking/infrastructure/handlers/WsNotifyPlayerLeftLobbyHandler';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { EventBus } from '#common/usecase/EventBus';
import { PlayerLeftLobbyHandler } from '#matchmaking/interface/ws/handlers/events/PlayerLeftLobbyHandler';
import { LobbyGateway } from '#matchmaking/interface/ws/LobbyGatewayWs';

export function registerHandlers(bus: EventBus, lobbyGateway: LobbyGateway): void {
    bus.register(LobbyEventType.PlayerLeftLobby, new WsNotifyPlayerLeftLobbyHandler());
    bus.register(LobbyEventType.PlayerLeftLobby, new PlayerLeftLobbyHandler(lobbyGateway));
}

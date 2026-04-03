import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import type { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyGateway } from '../LobbyGatewayWs';
import { WsEvents } from '../WsEventsType';

export class WsLobbyNotifier implements LobbyNotifier {
    constructor(private readonly gateway: LobbyGateway) {}

    notifyLobbyUpdated(lobby: LobbyAggregate): void {
        this.gateway.notifyLobby(WsEvents.LOBBY_UPDATED, lobby);
    }
}

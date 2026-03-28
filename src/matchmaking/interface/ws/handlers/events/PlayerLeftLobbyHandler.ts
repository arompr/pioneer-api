import { EventHandler } from '#common/usecase/EventHandler';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyGateway } from '../../LobbyGatewayWs';

export class PlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobby> {
    constructor(private readonly gateway: LobbyGateway) {}

    handle(event: PlayerLeftLobby): void {
        console.log(`Player ${event.payload.playerId.value} left lobby`);
    }
}

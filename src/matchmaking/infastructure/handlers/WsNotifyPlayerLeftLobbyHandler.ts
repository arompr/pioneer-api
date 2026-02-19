import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { EventHandler } from '../../usecase/EventHandler';

export class WsNotifyPlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobby> {
    handle(event: PlayerLeftLobby): void {
        console.log(`Player ${event.payload.playerId.value} left lobby`);
    }
}

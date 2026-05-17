import { EventHandler } from '#common/usecase/EventHandler';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';

export class WsNotifyPlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobby> {
    handle(event: PlayerLeftLobby): void {
        console.log(`Player ${event.payload.playerId.value} left lobby`);
    }
}

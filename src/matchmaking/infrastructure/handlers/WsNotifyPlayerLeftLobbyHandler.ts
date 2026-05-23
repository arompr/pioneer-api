import { EventHandler } from '#common/usecase/EventHandler';
import { PlayerLeftLobbyUseCaseEvent } from '#matchmaking/usecase/events/PlayerLeftLobbyUseCaseEvent';

export class WsNotifyPlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobbyUseCaseEvent> {
    handle(event: PlayerLeftLobbyUseCaseEvent): void {
        console.log(`Player ${event.payload.playerId.value} left lobby`);
    }
}

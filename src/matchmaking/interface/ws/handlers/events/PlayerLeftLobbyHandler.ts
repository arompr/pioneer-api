import { EventHandler } from '#common/usecase/EventHandler';
import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';

export class PlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobby> {
    constructor(
        private readonly notifier: LobbyNotifier,
        private readonly useCase: GetLobbyUseCase
    ) {}

    handle(event: PlayerLeftLobby): void {
        const lobby = this.useCase.execute({ lobbyId: event.payload.lobbyId });

        this.notifier.notifyLobbyUpdated(lobby);
    }
}

import { EventHandler } from '#common/usecase/EventHandler';
import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import { PlayerLeftLobbyUseCaseEvent } from '#matchmaking/usecase/events/PlayerLeftLobbyUseCaseEvent';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';

export class PlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobbyUseCaseEvent> {
    constructor(
        private readonly notifier: LobbyNotifier,
        private readonly useCase: GetLobbyUseCase
    ) {}

    handle(event: PlayerLeftLobbyUseCaseEvent): void {
        const lobby = this.useCase.execute({ lobbyId: event.lobbyId });

        this.notifier.notifyLobbyUpdated(lobby);
    }
}

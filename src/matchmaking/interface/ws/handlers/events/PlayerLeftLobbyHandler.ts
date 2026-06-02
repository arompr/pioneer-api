import { EventHandler } from '#common/usecase/EventHandler';
import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { LobbyNotifier } from '#common/usecase/LobbyNotifier';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';

export class PlayerLeftLobbyHandler implements EventHandler<PlayerLeftLobby> {
    constructor(
        private readonly notifier: LobbyNotifier,
        private readonly useCase: GetLobbyUseCase
    ) {}

    handle(event: UseCaseEvent<PlayerLeftLobby, LobbyId>): void {
        const lobby = this.useCase.execute({ lobbyId: event.aggregateId });

        this.notifier.notifyLobbyUpdated(lobby);
    }
}

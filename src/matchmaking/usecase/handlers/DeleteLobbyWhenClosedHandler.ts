import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { EventHandler } from '../EventHandler';

export class DeleteLobbyWhenClosedHandler implements EventHandler<LobbyClosed> {
    constructor(private readonly lobbyRepo: LobbyRepository) {}

    handle(event: LobbyClosed): void {
        this.lobbyRepo.delete(event.payload.lobbyId);
    }
}

import { DomainError } from '#common/domain/DomainError';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyAlreadyInGameError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby ${lobbyId.value} is already in game.`);
        this.lobbyId = lobbyId;
    }
}

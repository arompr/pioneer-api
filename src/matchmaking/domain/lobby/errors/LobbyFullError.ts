import { DomainError } from '#common/domain/DomainError';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyFullError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby ${lobbyId.toString()} has reached its capacity.`);
        this.lobbyId = lobbyId;
    }
}

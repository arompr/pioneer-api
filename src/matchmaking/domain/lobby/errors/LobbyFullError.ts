import { DomainError } from '#common/domain/DomainError.ts';
import type { LobbyId } from '../lobbyId/LobbyId.ts';

export class LobbyFullError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby ${lobbyId.toString()} has reached its capacity.`);
        this.lobbyId = lobbyId;
    }
}

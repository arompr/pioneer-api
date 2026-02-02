import { DomainError } from '#common/domain/DomainError.ts';
import type { LobbyId } from '../lobbyId/LobbyId.ts';

export class LobbyAlreadyInGameError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby ${lobbyId.toString()} is already in game.`);
        this.lobbyId = lobbyId;
    }
}

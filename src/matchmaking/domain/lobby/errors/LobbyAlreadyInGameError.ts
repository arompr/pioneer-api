import DomainError from '#common/domain/DomainError';
import { LobbyId } from '../lobbyId/LobbyId';

export default class LobbyAlreadyInGameError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby ${lobbyId.toString()} is already in game.`);
        this.lobbyId = lobbyId;
    }
}

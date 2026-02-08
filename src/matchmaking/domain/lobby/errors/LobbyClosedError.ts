import DomainError from '#common/domain/DomainError';
import { LobbyId } from '../lobbyId/LobbyId';

export default class LobbyClosedError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby ${lobbyId.toString()} is closed and cannot accept this action.`);
        this.lobbyId = lobbyId;
    }
}

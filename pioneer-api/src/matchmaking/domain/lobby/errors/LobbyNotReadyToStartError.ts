import { DomainError } from '#common/domain/DomainError';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyNotReadyToStartError extends DomainError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(
            `Lobby ${lobbyId.toString()} is not ready to start. Check player count and ready status.`
        );
        this.lobbyId = lobbyId;
    }
}

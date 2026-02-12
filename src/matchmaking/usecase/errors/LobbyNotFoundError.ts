import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { UseCaseError } from '#common/usecase/errors/UseCaseError';

export default class LobbyNotFoundError extends UseCaseError {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super(`Lobby with id ${lobbyId.value} not found`);
        this.lobbyId = lobbyId;
    }
}

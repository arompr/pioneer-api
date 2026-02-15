import { DomainError } from '#common/domain/DomainError';
import type { PlayerId } from '#common/domain/player/playerId/PlayerId';
import type { LobbyId } from '../lobbyId/LobbyId';

export class PlayerIsNotHostError extends DomainError {
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;

    constructor(playerId: PlayerId, lobbyId: LobbyId) {
        super(
            `Player with ID ${playerId.toString()} is not the host of lobby ${lobbyId.value} and cannot perform this action.`
        );
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }
}

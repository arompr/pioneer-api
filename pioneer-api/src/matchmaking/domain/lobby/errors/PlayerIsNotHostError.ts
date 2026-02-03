import { DomainError } from '#common/domain/DomainError';
import { LobbyId } from '../lobbyId/LobbyId';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class PlayerIsNotHostError extends DomainError {
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;

    constructor(playerId: PlayerId, lobbyId: LobbyId) {
        super(
            `Player with ID ${playerId.toString()} is not the host of lobby ${lobbyId.toString()} and cannot perform this action.`
        );
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }
}

import DomainEvent from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyId } from '../lobbyId/LobbyId';

export class PlayerMarkedPending extends DomainEvent {
    public readonly lobbyId: LobbyId;
    public readonly playerId: PlayerId;

    constructor(lobbyId: LobbyId, playerId: PlayerId) {
        super();
        this.lobbyId = lobbyId;
        this.playerId = playerId;
    }
}

import DomainEvent from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyHostChanged extends DomainEvent {
    public readonly lobbyId: LobbyId;
    public readonly newHostId: PlayerId;

    constructor(lobbyId: LobbyId, newHostId: PlayerId) {
        super();
        this.lobbyId = lobbyId;
        this.newHostId = newHostId;
    }
}

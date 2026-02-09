import DomainEvent from '#common/domain/events/DomainEvent';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyClosed extends DomainEvent {
    public readonly lobbyId: LobbyId;

    constructor(lobbyId: LobbyId) {
        super();
        this.lobbyId = lobbyId;
    }
}

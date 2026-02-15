import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyId } from '../lobbyId/LobbyId';

export type LobbyClosedPayload = { lobbyId: LobbyId };

export class LobbyClosed implements DomainEvent<LobbyClosedPayload> {
    public readonly type = 'LobbyClosed';
    public readonly payload: LobbyClosedPayload;

    constructor(lobbyId: LobbyId) {
        this.payload = { lobbyId };
    }
}

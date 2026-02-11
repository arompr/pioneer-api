import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyClosed extends DomainEvent {
    constructor(lobbyId: LobbyId, schemaVersion = 1, occurredAt?: Date) {
        super(lobbyId.value, schemaVersion, occurredAt);
    }
}

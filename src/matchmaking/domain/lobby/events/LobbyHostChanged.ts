import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyId } from '../lobbyId/LobbyId';

export class LobbyHostChanged extends DomainEvent {
    public readonly newHostId: PlayerId;

    constructor(lobbyId: LobbyId, newHostId: PlayerId, schemaVersion = 1, occurredAt?: Date) {
        super(lobbyId.value, schemaVersion, occurredAt);
        this.newHostId = newHostId;
    }
}

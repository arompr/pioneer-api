import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyId } from '../lobbyId/LobbyId';

export class PlayerMarkedReady extends DomainEvent {
    public readonly playerId: PlayerId;

    constructor(lobbyId: LobbyId, playerId: PlayerId, schemaVersion = 1, occurredAt?: Date) {
        super(lobbyId.value, schemaVersion, occurredAt);
        this.playerId = playerId;
    }
}

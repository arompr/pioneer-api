import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyId } from '../lobbyId/LobbyId';

export class PlayerLeftLobby extends DomainEvent {
    public readonly playerId: PlayerId;
    public readonly wasHost: boolean;

    constructor(
        lobbyId: LobbyId,
        playerId: PlayerId,
        wasHost: boolean,
        schemaVersion = 1,
        occurredAt?: Date
    ) {
        super(lobbyId.value, schemaVersion, occurredAt);
        this.playerId = playerId;
        this.wasHost = wasHost;
    }
}

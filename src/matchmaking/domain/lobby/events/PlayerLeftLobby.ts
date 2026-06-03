import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export class PlayerLeftLobby implements DomainEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby;
    public readonly playerId: PlayerId;
    public readonly wasHost: boolean;

    constructor(playerId: PlayerId, wasHost: boolean) {
        this.playerId = playerId;
        this.wasHost = wasHost;
    }
}

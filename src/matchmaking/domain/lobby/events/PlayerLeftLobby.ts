import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class PlayerLeftLobby implements DomainEvent {
    public readonly type = 'PlayerLeftLobby';
    public readonly playerId: PlayerId;
    public readonly wasHost: boolean;

    constructor(playerId: PlayerId, wasHost: boolean) {
        this.playerId = playerId;
        this.wasHost = wasHost;
    }
}

import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class PlayerJoinedLobby implements DomainEvent {
    public readonly type = 'PlayerJoinedLobby';
    public readonly playerId: PlayerId;

    constructor(playerId: PlayerId) {
        this.playerId = playerId;
    }
}

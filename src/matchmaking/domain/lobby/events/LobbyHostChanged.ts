import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class LobbyHostChanged implements DomainEvent {
    public readonly type = 'LobbyHostChanged';
    public readonly newHostId: PlayerId;

    constructor(newHostId: PlayerId) {
        this.newHostId = newHostId;
    }
}

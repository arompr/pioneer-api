import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export class LobbyHostChanged implements DomainEvent {
    public readonly type = LobbyEventType.LobbyHostChanged;
    public readonly newHostId: PlayerId;

    constructor(newHostId: PlayerId) {
        this.newHostId = newHostId;
    }
}

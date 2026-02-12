import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class PlayerMarkedReady implements DomainEvent {
    public readonly type = 'PlayerMarkedReady';
    public readonly playerId: PlayerId;

    constructor(playerId: PlayerId) {
        this.playerId = playerId;
    }
}

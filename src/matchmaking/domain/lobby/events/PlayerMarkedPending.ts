import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export class PlayerMarkedPending implements DomainEvent {
    public readonly type = 'PlayerMarkedPending';
    public readonly playerId: PlayerId;

    constructor(playerId: PlayerId) {
        this.playerId = playerId;
    }
}

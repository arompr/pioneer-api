import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerMarkedPendingPayload = {
    playerId: PlayerId;
};

export class PlayerMarkedPending implements DomainEvent<PlayerMarkedPendingPayload> {
    public readonly type = 'PlayerMarkedPending';
    public readonly payload: PlayerMarkedPendingPayload;

    constructor(playerId: PlayerId) {
        this.payload = { playerId };
    }
}

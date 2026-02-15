import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerMarkedReadyPayload = {
    playerId: PlayerId;
};

export class PlayerMarkedReady implements DomainEvent<PlayerMarkedReadyPayload> {
    public readonly type = 'PlayerMarkedReady';
    public readonly payload: PlayerMarkedReadyPayload;

    constructor(playerId: PlayerId) {
        this.payload = { playerId };
    }
}

import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export type PlayerMarkedReadyPayload = {
    playerId: PlayerId;
};

export class PlayerMarkedReady implements DomainEvent {
    public readonly type = LobbyEventType.PlayerMarkedReady.value;
    public readonly payload: PlayerMarkedReadyPayload;

    constructor(playerId: PlayerId) {
        this.payload = { playerId };
    }
}

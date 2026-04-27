import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export type PlayerMarkedPendingPayload = {
    playerId: PlayerId;
};

export class PlayerMarkedPending implements DomainEvent {
    public readonly type = LobbyEventType.PlayerMarkedPending.value;
    public readonly payload: PlayerMarkedPendingPayload;

    constructor(playerId: PlayerId) {
        this.payload = { playerId };
    }
}

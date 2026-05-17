import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export type LobbyHostChangedPayload = {
    newHostId: PlayerId;
};

export class LobbyHostChanged implements DomainEvent {
    public readonly type = LobbyEventType.LobbyHostChanged.value;
    public readonly payload: LobbyHostChangedPayload;

    constructor(newHostId: PlayerId) {
        this.payload = { newHostId };
    }

    static fromPayload(payload: EventPayload): LobbyHostChanged {
        const { newHostId } = payload as LobbyHostChangedPayload;
        return new LobbyHostChanged(newHostId);
    }
}

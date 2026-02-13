import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export type LobbyHostChangedPayload = {
    newHostId: PlayerId;
};

export class LobbyHostChanged implements DomainEvent<LobbyHostChangedPayload> {
    public readonly type = 'LobbyHostChanged';
    public readonly payload: LobbyHostChangedPayload;

    constructor(newHostId: PlayerId) {
        this.payload = { newHostId };
    }
}

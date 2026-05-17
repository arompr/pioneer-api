import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export type PlayerJoinedLobbyPayload = {
    playerId: PlayerId;
};

export class PlayerJoinedLobby implements DomainEvent {
    public readonly type = LobbyEventType.PlayerJoinedLobby.value;
    public readonly payload: PlayerJoinedLobbyPayload;

    constructor(playerId: PlayerId) {
        this.payload = { playerId };
    }

    static fromPayload(payload: EventPayload): PlayerJoinedLobby {
        const { playerId } = payload as PlayerJoinedLobbyPayload;
        return new PlayerJoinedLobby(playerId);
    }
}

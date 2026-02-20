import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export type PlayerLeftLobbyPayload = {
    playerId: PlayerId;
    wasHost: boolean;
};

export class PlayerLeftLobby implements DomainEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby.value;
    public readonly payload: PlayerLeftLobbyPayload;

    constructor(playerId: PlayerId, wasHost: boolean) {
        this.payload = { playerId, wasHost };
    }

    static fromPayload(payload: EventPayload): PlayerLeftLobby {
        return new PlayerLeftLobby(payload.playerId as PlayerId, payload.wasHost as boolean);
    }
}

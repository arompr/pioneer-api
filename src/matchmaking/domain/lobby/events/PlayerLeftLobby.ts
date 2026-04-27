import { DomainEvent } from '#common/domain/events/DomainEvent';
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
}

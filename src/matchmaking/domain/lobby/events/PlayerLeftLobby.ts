import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerLeftLobbyPayload = {
    playerId: PlayerId;
    wasHost: boolean;
};

export class PlayerLeftLobby implements DomainEvent<PlayerLeftLobbyPayload> {
    public readonly type = 'PlayerLeftLobby';
    public readonly payload: PlayerLeftLobbyPayload;

    constructor(playerId: PlayerId, wasHost: boolean) {
        this.payload = { playerId, wasHost };
    }
}

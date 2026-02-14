import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

export type PlayerJoinedLobbyPayload = {
    playerId: PlayerId;
};

export class PlayerJoinedLobby implements DomainEvent<PlayerJoinedLobbyPayload> {
    public readonly type = 'PlayerJoinedLobby';
    public readonly payload: PlayerJoinedLobbyPayload;

    constructor(playerId: PlayerId) {
        this.payload = { playerId };
    }
}

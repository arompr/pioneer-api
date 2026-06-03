import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyEventType } from './LobbyEventType';

export class PlayerJoinedLobby implements DomainEvent {
    public readonly type = LobbyEventType.PlayerJoinedLobby;
    public readonly playerId: PlayerId;

    constructor(playerId: PlayerId) {
        this.playerId = playerId;
    }
}

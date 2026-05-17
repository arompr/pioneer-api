import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '../lobbyId/LobbyId';
import { LobbyEventType } from './LobbyEventType';

export type PlayerLeftLobbyPayload = {
    lobbyId: LobbyId;
    playerId: PlayerId;
    wasHost: boolean;
};

export class PlayerLeftLobby implements DomainEvent {
    public readonly type = LobbyEventType.PlayerLeftLobby.value;
    public readonly payload: PlayerLeftLobbyPayload;

    constructor(lobbyId: LobbyId, playerId: PlayerId, wasHost: boolean) {
        this.payload = { lobbyId, playerId, wasHost };
    }

    static fromPayload(payload: EventPayload): PlayerLeftLobby {
        const { lobbyId, playerId, wasHost } = payload as PlayerLeftLobbyPayload;
        return new PlayerLeftLobby(lobbyId, playerId, wasHost);
    }
}

import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyClosedError } from '../errors/LobbyClosedError';
import { Lobby } from '../Lobby';
import { LobbyState } from './LobbyState';

export class ClosedState implements LobbyState {
    private lobby: Lobby;

    constructor(lobby: Lobby) {
        this.lobby = lobby;
    }

    join(_player: Player): void {
        this.notAllowed();
    }

    start(_playerId: PlayerId): void {
        this.notAllowed();
    }

    markAsReady(_playerId: PlayerId): void {
        this.notAllowed();
    }

    markAsPending(_playerId: PlayerId): void {
        this.notAllowed();
    }

    private notAllowed(): void {
        throw new LobbyClosedError(this.lobby.getId());
    }
}

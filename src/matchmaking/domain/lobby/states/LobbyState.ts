import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { Lobby } from '../Lobby';

export abstract class LobbyState {
    protected lobby!: Lobby;

    public setLobby(lobby: Lobby) {
        this.lobby = lobby;
    }

    abstract join(player: Player): void;
    abstract start(playerId: PlayerId): void;
    abstract markAsReady(playerId: PlayerId): void;
    abstract markAsPending(playerId: PlayerId): void;
    abstract canStart(): boolean;
}

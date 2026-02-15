import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Lobby } from '../Lobby';
import { LobbyStateType } from './LobbyStateType';

export abstract class LobbyState {
    public abstract readonly stateType: LobbyStateType;
    protected lobby!: Lobby;

    public setLobby(lobby: Lobby): void {
        this.lobby = lobby;
    }

    abstract join(player: Player): void;
    abstract start(playerId: PlayerId): void;
    abstract markAsReady(playerId: PlayerId): void;
    abstract markAsPending(playerId: PlayerId): void;
    abstract canStart(): boolean;
}

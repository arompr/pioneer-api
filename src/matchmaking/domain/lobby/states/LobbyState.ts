import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Lobby } from '../Lobby';
import { LobbyStateType } from './LobbyStateType';
import type { LobbyGameConfig } from '../LobbyGameConfig';

export abstract class LobbyState {
    public abstract readonly stateType: LobbyStateType;
    protected lobby!: Lobby;

    public setLobby(lobby: Lobby): void {
        this.lobby = lobby;
    }

    abstract join(player: Player, config: LobbyGameConfig): void;
    abstract start(playerId: PlayerId, config: LobbyGameConfig): void;
    abstract markAsReady(playerId: PlayerId, config: LobbyGameConfig): void;
    abstract markAsPending(playerId: PlayerId, config: LobbyGameConfig): void;
    abstract canStart(): boolean;
}

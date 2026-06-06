import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Lobby } from '../Lobby';
import { LobbyStateType } from './LobbyStateType';
import type { LobbyJoinRules, LobbyStartRules } from '../LobbyRules';

export abstract class LobbyState {
    public abstract readonly stateType: LobbyStateType;
    protected lobby!: Lobby;

    public setLobby(lobby: Lobby): void {
        this.lobby = lobby;
    }

    abstract join(player: Player, joinRules: LobbyJoinRules): void;
    abstract start(playerId: PlayerId, startRules: LobbyStartRules): void;
    abstract markAsReady(playerId: PlayerId, startRules: LobbyStartRules): void;
    abstract markAsPending(playerId: PlayerId, startRules: LobbyStartRules): void;
    abstract canStart(): boolean;
}

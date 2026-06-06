import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Player } from '../player/Player';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyStateType } from './states/LobbyStateType';
import type { GameConfigId } from '../gameConfig/GameConfigId';
import type { LobbyJoinRules, LobbyStartRules } from './LobbyRules';

export interface ILobby {
    get id(): LobbyId;
    get hostId(): PlayerId;
    get stateType(): LobbyStateType;
    get gameConfigId(): GameConfigId;
    join(player: Player, joinRules: LobbyJoinRules): void;
    leave(id: PlayerId): void;
    start(playerId: PlayerId, startRules: LobbyStartRules): void;
    markAsReady(id: PlayerId, startRules: LobbyStartRules): void;
    markAsPending(id: PlayerId, startRules: LobbyStartRules): void;
    meetsRequirementsToStart(startRules: LobbyStartRules): boolean;
    canStart(): boolean;
    isHost(id: PlayerId): boolean;
    isEmpty(): boolean;
    get allPlayers(): Player[];
    findPlayer(playerId: PlayerId): Player;
    get playerCount(): number;
    get readyPlayerCount(): number;
}

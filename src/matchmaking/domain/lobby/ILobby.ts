import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Player } from '../player/Player';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyStateType } from './states/LobbyStateType';
import type { GameConfigId } from '../gameConfig/GameConfigId';
import type { LobbyGameConfig } from './LobbyGameConfig';

export interface ILobby {
    get id(): LobbyId;
    get hostId(): PlayerId;
    get stateType(): LobbyStateType;
    get gameConfigId(): GameConfigId;
    join(player: Player, config: LobbyGameConfig): void;
    leave(id: PlayerId): void;
    start(playerId: PlayerId, config: LobbyGameConfig): void;
    markAsReady(id: PlayerId, config: LobbyGameConfig): void;
    markAsPending(id: PlayerId, config: LobbyGameConfig): void;
    meetsRequirementsToStart(config: LobbyGameConfig): boolean;
    canStart(): boolean;
    isHost(id: PlayerId): boolean;
    isEmpty(): boolean;
    get allPlayers(): Player[];
    findPlayer(playerId: PlayerId): Player;
    get playerCount(): number;
    get readyPlayerCount(): number;
}

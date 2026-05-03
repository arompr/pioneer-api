import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { Player } from '../player/Player';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyStateType } from './states/LobbyStateType';
import type { GameConfigId } from '../gameConfig/GameConfigId';

export interface ILobby {
    get id(): LobbyId;
    get config(): LobbyConfig;
    get hostId(): PlayerId;
    get stateType(): LobbyStateType;
    get gameConfigId(): GameConfigId | undefined;
    join(player: Player): void;
    leave(id: PlayerId): void;
    start(playerId: PlayerId): void;
    markAsReady(id: PlayerId): void;
    markAsPending(id: PlayerId): void;
    canStart(): boolean;
    isHost(id: PlayerId): boolean;
    isEmpty(): boolean;
    get allPlayers(): Player[];
    findPlayer(playerId: PlayerId): Player;
    get playerCount(): number;
    get readyPlayerCount(): number;
}

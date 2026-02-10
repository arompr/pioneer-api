import { Player } from '../player/Player';
import { PlayerId } from '../player/playerId/PlayerId';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyStateType } from './states/LobbyStateType';

export interface ILobby {
    get id(): LobbyId;
    get config(): LobbyConfig;
    get hostId(): PlayerId;
    get stateType(): LobbyStateType;
    join(player: Player): void;
    leave(id: PlayerId): void;
    start(playerId: PlayerId): void;
    markAsReady(id: PlayerId): void;
    markAsPending(id: PlayerId): void;
    canStart(): boolean;
    isHost(id: PlayerId): boolean;
    isFull(): boolean;
    isEmpty(): boolean;
    remainingPlaces(): number;
    get allPlayers(): Player[];
    get playerCount(): number;
    get readyPlayerCount(): number;
}

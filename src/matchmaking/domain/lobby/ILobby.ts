import { Player } from '../player/Player';
import { PlayerId } from '../player/playerId/PlayerId';
import { LobbyId } from './lobbyId/LobbyId';

export default interface ILobby {
    getId(): LobbyId;
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

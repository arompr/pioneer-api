import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';

export interface LobbyState {
    join(player: Player): void;
    start(playerId: PlayerId): void;
    markAsReady(playerId: PlayerId): void;
    markAsPending(playerId: PlayerId): void;
}

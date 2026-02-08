import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import LobbyAlreadyInGameError from '../errors/LobbyAlreadyInGameError';
import { LobbyState } from './LobbyState';

export class InGameState extends LobbyState {
    join(_player: Player): void {
        this.notAllowed();
    }

    start(_playerId: PlayerId): void {
        this.notAllowed();
    }

    markAsReady(_playerId: PlayerId): void {
        this.notAllowed();
    }

    markAsPending(_playerId: PlayerId): void {
        this.notAllowed();
    }

    canStart(): boolean {
        return false;
    }

    private notAllowed(): void {
        throw new LobbyAlreadyInGameError(this.lobby.getId());
    }
}

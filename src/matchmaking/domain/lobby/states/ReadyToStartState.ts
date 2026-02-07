import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyFullError } from '../errors/LobbyFullError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { InGameState } from './InGameState';
import { LobbyState } from './LobbyState';
import { WaitingForPlayersState } from './WaitingForPlayersState';

export class ReadyToStartState extends LobbyState {
    join(player: Player): void {
        if (this.lobby.isFull()) {
            throw new LobbyFullError(this.lobby.getId());
        }

        this.lobby.internalAddPlayer(player);

        if (!this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new WaitingForPlayersState());
        }
    }

    start(playerId: PlayerId): void {
        if (!this.lobby.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.lobby.getId());
        }
        this.lobby.transitionTo(new InGameState());
    }

    markAsReady(playerId: PlayerId): void {
        this.lobby.internalMarkAsReady(playerId);
    }

    markAsPending(playerId: PlayerId): void {
        this.lobby.internalMarkAsPending(playerId);
        if (!this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new WaitingForPlayersState());
        }
    }

    canStart(): boolean {
        return true;
    }
}

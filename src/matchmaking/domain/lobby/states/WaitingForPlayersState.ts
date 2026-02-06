import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyFullError } from '../errors/LobbyFullError';
import { LobbyNotReadyToStartError } from '../errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { LobbyState } from './LobbyState';
import { ReadyToStartState } from './ReadyToStartState';

export class WaitingForPlayersState extends LobbyState {
    join(player: Player): void {
        if (this.lobby.isFull()) {
            throw new LobbyFullError(this.lobby.getId());
        }
        this.lobby._addPlayer(player);
    }

    start(playerId: PlayerId): void {
        if (!this.lobby.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.lobby.getId());
        }
        throw new LobbyNotReadyToStartError(this.lobby.getId());
    }

    markAsReady(playerId: PlayerId): void {
        this.lobby._markPlayerAsReady(playerId);

        if (this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new ReadyToStartState());
        }
    }

    markAsPending(playerId: PlayerId): void {
        this.lobby._markPlayerAsPending(playerId);
    }

    canStart(): boolean {
        return false;
    }
}

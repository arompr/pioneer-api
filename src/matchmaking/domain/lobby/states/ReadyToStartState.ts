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
        this.lobby._addPlayer(player);
    }

    start(playerId: PlayerId): void {
        if (!this.lobby.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.lobby.getId());
        }
        this.lobby.transitionTo(new InGameState());
        console.log('Partie débuté!');
    }

    markAsReady(playerId: PlayerId): void {
        this.lobby._markPlayerAsReady(playerId);
    }

    markAsPending(playerId: PlayerId): void {
        this.lobby._markPlayerAsPending(playerId);
        if (!this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new WaitingForPlayersState());
        }
    }

    canStart(): boolean {
        return true;
    }
}

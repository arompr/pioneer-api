import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyFullError } from '../errors/LobbyFullError';
import { LobbyNotReadyToStartError } from '../errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { Lobby } from '../Lobby';
import { LobbyState } from './LobbyState';
import { ReadyToStartState } from './ReadyToStartState';

export class WaitingForPlayersState implements LobbyState {
    private lobby: Lobby;

    constructor(lobby: Lobby) {
        this.lobby = lobby;
    }

    join(player: Player): void {
        if (this.lobby.isFull()) {
            throw new LobbyFullError(this.lobby.getId());
        }
        this.lobby.addPlayer(player);
    }

    start(playerId: PlayerId): void {
        if (!this.lobby.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.lobby.getId());
        }
        throw new LobbyNotReadyToStartError(this.lobby.getId());
    }

    markAsReady(playerId: PlayerId): void {
        this.lobby.markAsReady(playerId);

        if (this.lobby.canStart()) {
            this.lobby.transitionTo(new ReadyToStartState(this.lobby));
        }
    }

    markAsPending(playerId: PlayerId): void {
        this.lobby.markAsPending(playerId);
    }
}

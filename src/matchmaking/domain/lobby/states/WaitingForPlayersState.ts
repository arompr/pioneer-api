import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyFullError } from '../errors/LobbyFullError';
import { LobbyNotReadyToStartError } from '../errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import { ReadyToStartState } from './ReadyToStartState';

/**
 * Represents a lobby that is waiting for additional players before it can start.
 *
 * In this state:
 * - Players may join as long as the lobby is not full.
 * - Players may toggle readiness.
 * - The host cannot start the match yet, even if they attempt to.
 * - When all requirements are met (minimum players + all ready), the lobby transitions to ReadyToStartState.
 */
export class WaitingForPlayersState extends LobbyState {
    public readonly stateType: LobbyStateType = LobbyStateType.WaitingForPlayers;

    /**
     * Adds a player to the lobby if it is not full.
     *
     * @param {Player} player - The player attempting to join.
     * @throws {LobbyFullError} If the lobby has reached maximum capacity.
     */
    join(player: Player): void {
        if (this.lobby.isFull()) {
            throw new LobbyFullError(this.lobby.id);
        }
        this.lobby.internalAddPlayer(player);
    }

    /**
     * Attempts to start the lobby.
     *
     * In this state, starting is always forbidden because the lobby
     * has not yet reached the minimum requirements.
     *
     * @param {PlayerId} playerId - The player attempting to start the match.
     * @throws {PlayerIsNotHostError} If the player is not the host.
     * @throws {LobbyNotReadyToStartError}  Always thrown in this state, because the lobby does not yet meet the requirements to start.
     */
    start(playerId: PlayerId): void {
        if (!this.lobby.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.lobby.id);
        }
        throw new LobbyNotReadyToStartError(this.lobby.id);
    }

    /**
     * Marks a player as ready.
     *
     * If the lobby reaches the minimum number of ready players,
     * it transitions to ReadyToStartState.
     *
     * @param {PlayerId} playerId - The player to mark as ready.
     */
    markAsReady(playerId: PlayerId): void {
        this.lobby.internalMarkAsReady(playerId);

        if (this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new ReadyToStartState());
        }
    }

    /**
     * Marks a player as pending (not ready).
     *
     * @param {PlayerId} playerId - The player to mark as pending.
     */
    markAsPending(playerId: PlayerId): void {
        this.lobby.internalMarkAsPending(playerId);
    }

    /**
     * A lobby waiting for players cannot start yet.
     *
     * @returns {boolean} Always false.
     */
    canStart(): boolean {
        return false;
    }
}

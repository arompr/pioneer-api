import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyFullError } from '../errors/LobbyFullError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { InGameState } from './InGameState';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import { WaitingForPlayersState } from './WaitingForPlayersState';

/**
 * Represents a lobby where all requirements to start the match are met.
 *
 * In this state:
 * - The lobby has reached the minimum number of players.
 * - All players are ready.
 * - The host is allowed to start the match.
 * - New players may still join, but doing so may invalidate readiness
 *   and cause a transition back to WaitingForPlayersState.
 * - Players may toggle readiness; if readiness conditions are no longer met,
 *   the lobby transitions back to WaitingForPlayersState.
 */
export class ReadyToStartState extends LobbyState {
    stateType: LobbyStateType = LobbyStateType.ReadyToStart;

    /**
     * Adds a player to the lobby if it is not full.
     *
     * Joining is allowed in this state, but may cause the lobby to lose
     * its "ready to start" status if the new player is not ready.
     *
     * @param {Player} player - The player attempting to join.
     * @throws {LobbyFullError} If the lobby has reached maximum capacity.
     */
    join(player: Player): void {
        if (this.lobby.isFull()) {
            throw new LobbyFullError(this.lobby.id);
        }

        this.lobby.internalAddPlayer(player);

        if (!this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new WaitingForPlayersState());
        }
    }

    /**
     * Starts the match.
     *
     * In this state, starting is explicitly allowed because all requirements
     * (minimum players + all ready) are satisfied.
     * Only the host may initiate the start.
     *
     * @param {PlayerId} playerId - The player attempting to start the match.
     * @throws {PlayerIsNotHostError} If the player is not the host.
     */
    start(playerId: PlayerId): void {
        if (!this.lobby.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.lobby.id);
        }
        this.lobby.transitionTo(new InGameState());
    }

    /**
     * Marks a player as ready.
     *
     * Since the lobby is already ready to start, this action does not
     * trigger any state transition.
     *
     * @param {PlayerId} playerId - The player to mark as ready.
     */
    markAsReady(playerId: PlayerId): void {
        this.lobby.internalMarkAsReady(playerId);
    }

    /**
     * Marks a player as pending (not ready).
     *
     * This invalidates the "ready to start" status and forces the lobby
     * back into WaitingForPlayersState.
     *
     * @param {PlayerId} playerId - The player to mark as pending.
     */
    markAsPending(playerId: PlayerId): void {
        this.lobby.internalMarkAsPending(playerId);
        if (!this.lobby.meetsRequirementsToStart()) {
            this.lobby.transitionTo(new WaitingForPlayersState());
        }
    }

    /**
     * A lobby in this state is allowed to start.
     *
     * @returns {boolean} Always true.
     */
    canStart(): boolean {
        return true;
    }
}

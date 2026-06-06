import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { InGameState } from './InGameState';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import { WaitingForPlayersState } from './WaitingForPlayersState';
import type { LobbyJoinRules, LobbyStartRules } from '../LobbyRules';

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
    public readonly stateType: LobbyStateType = LobbyStateType.ReadyToStart;

    /**
     * Adds a player to the lobby.
     *
     * Joining is allowed in this state, but may cause the lobby to lose
     * its "ready to start" status if the new player is not ready.
     *
     * @param {Player} player - The player attempting to join.
     * @param {LobbyJoinRules} joinRules - Rules governing join (max players).
     */
    join(player: Player, joinRules: LobbyJoinRules): void {
        this.lobby.assertCanJoin(joinRules);
        this.lobby.internalAddPlayer(player);

        if (!this.lobby.meetsRequirementsToStart(joinRules)) {
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
     * @param {LobbyStartRules} _startRules - Rules governing start requirements (unused in this state).
     * @throws {PlayerIsNotHostError} If the player is not the host.
     */
    start(playerId: PlayerId, _startRules: LobbyStartRules): void {
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
     * @param {LobbyStartRules} _startRules - Rules governing start requirements (unused).
     */
    markAsReady(playerId: PlayerId, _startRules: LobbyStartRules): void {
        this.lobby.internalMarkAsReady(playerId);
    }

    /**
     * Marks a player as pending (not ready).
     *
     * This invalidates the "ready to start" status and forces the lobby
     * back into WaitingForPlayersState.
     *
     * @param {PlayerId} playerId - The player to mark as pending.
     * @param {LobbyStartRules} startRules - Rules governing start requirements (min players).
     */
    markAsPending(playerId: PlayerId, startRules: LobbyStartRules): void {
        this.lobby.internalMarkAsPending(playerId);
        if (!this.lobby.meetsRequirementsToStart(startRules)) {
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

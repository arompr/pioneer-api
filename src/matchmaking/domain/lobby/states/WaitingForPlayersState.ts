import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyNotReadyToStartError } from '../errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import { ReadyToStartState } from './ReadyToStartState';
import type { LobbyJoinRules, LobbyStartRules } from '../LobbyRules';

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
     * Adds a player to the lobby.
     *
     * @param {Player} player - The player attempting to join.
     * @param {LobbyJoinRules} joinRules - Rules governing join (unused in this state).
     */
    join(player: Player, joinRules: LobbyJoinRules): void {
        this.lobby.assertCanJoin(joinRules);
        this.lobby.internalAddPlayer(player);
    }

    /**
     * Attempts to start the lobby.
     *
     * In this state, starting is always forbidden because the lobby
     * has not yet reached the minimum requirements.
     *
     * @param {PlayerId} playerId - The player attempting to start the match.
     * @param {LobbyStartRules} _startRules - Rules governing start requirements (unused).
     * @throws {PlayerIsNotHostError} If the player is not the host.
     * @throws {LobbyNotReadyToStartError}  Always thrown in this state, because the lobby does not yet meet the requirements to start.
     */
    start(playerId: PlayerId, _startRules: LobbyStartRules): void {
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
     * @param {LobbyStartRules} startRules - Rules governing start requirements (min players).
     */
    markAsReady(playerId: PlayerId, startRules: LobbyStartRules): void {
        this.lobby.internalMarkAsReady(playerId);

        if (this.lobby.meetsRequirementsToStart(startRules)) {
            this.lobby.transitionTo(new ReadyToStartState());
        }
    }

    /**
     * Marks a player as pending (not ready).
     *
     * @param {PlayerId} playerId - The player to mark as pending.
     * @param {LobbyStartRules} _startRules - Rules governing start requirements (unused).
     */
    markAsPending(playerId: PlayerId, _startRules: LobbyStartRules): void {
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

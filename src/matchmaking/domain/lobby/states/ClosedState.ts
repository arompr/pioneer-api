import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyClosedError } from '../errors/LobbyClosedError';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import type { LobbyJoinRules, LobbyStartRules } from '../LobbyRules';

/**
 * Represents a lobby that has been permanently closed.
 *
 * In this state:
 * - No new players can join.
 * - No player can change readiness.
 * - The lobby cannot start.
 * - All actions are forbidden and will throw a LobbyClosedError.
 *
 * This state is terminal and indicates that the lobby is no longer usable.
 */
export class ClosedState extends LobbyState {
    public readonly stateType: LobbyStateType = LobbyStateType.Closed;

    /**
     * Joining a closed lobby is forbidden.
     *
     * @throws {LobbyClosedError} Always thrown because the lobby is closed.
     */
    join(_player: Player, _joinRules: LobbyJoinRules): void {
        this.notAllowed();
    }

    /**
     * Starting a closed lobby is forbidden.
     *
     * @throws {LobbyClosedError} Always thrown because the lobby is closed.
     */
    start(_playerId: PlayerId, _startRules: LobbyStartRules): void {
        this.notAllowed();
    }

    /**
     * Marking a player as ready is forbidden.
     *
     * @throws {LobbyClosedError} Always thrown because the lobby is closed.
     */
    markAsReady(_playerId: PlayerId, _startRules: LobbyStartRules): void {
        this.notAllowed();
    }

    /**
     * Marking a player as pending is forbidden.
     *
     * @throws {LobbyClosedError} Always thrown because the lobby is closed.
     */
    markAsPending(_playerId: PlayerId, _startRules: LobbyStartRules): void {
        this.notAllowed();
    }

    /**
     * A closed lobby can never start.
     *
     * @returns {boolean} Always false.
     */
    canStart(): boolean {
        return false;
    }

    private notAllowed(): void {
        throw new LobbyClosedError(this.lobby.id);
    }
}

import { Player } from '#matchmaking/domain/player/Player';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyAlreadyInGameError } from '../errors/LobbyAlreadyInGameError';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import type { LobbyGameConfig } from '../LobbyGameConfig';

/**
 * Represents a lobby that is currently in an active match.
 *
 * In this state:
 * - No new players can join.
 * - The match cannot be started again.
 * - Players cannot change readiness.
 * - All actions are forbidden and will throw a LobbyAlreadyInGameError.
 *
 * This state indicates that the lobby has transitioned into gameplay
 * and is no longer available for matchmaking interactions.
 */
export class InGameState extends LobbyState {
    public readonly stateType: LobbyStateType = LobbyStateType.InGame;

    /**
     * Joining a lobby that is already in-game is forbidden.
     *
     * @throws {LobbyAlreadyInGameError} Always thrown because the lobby is in-game.
     */
    join(_player: Player, _config: LobbyGameConfig): void {
        this.notAllowed();
    }

    /**
     * Starting a lobby that is already in-game is forbidden.
     *
     * @throws {LobbyAlreadyInGameError} Always thrown because the lobby is in-game.
     */
    start(_playerId: PlayerId, _config: LobbyGameConfig): void {
        this.notAllowed();
    }

    /**
     * Marking a player as ready is forbidden while the lobby is in-game.
     *
     * @throws {LobbyAlreadyInGameError} Always thrown because the lobby is in-game.
     */
    markAsReady(_playerId: PlayerId, _config: LobbyGameConfig): void {
        this.notAllowed();
    }

    /**
     * Marking a player as pending is forbidden while the lobby is in-game.
     *
     * @throws {LobbyAlreadyInGameError} Always thrown because the lobby is in-game.
     */
    markAsPending(_playerId: PlayerId, _config: LobbyGameConfig): void {
        this.notAllowed();
    }

    /**
     * A lobby that is already in-game can never be started again.
     *
     * @returns {boolean} Always false.
     */
    canStart(): boolean {
        return false;
    }

    private notAllowed(): void {
        throw new LobbyAlreadyInGameError(this.lobby.id);
    }
}

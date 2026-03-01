import type { PlayerId } from '../../../common/domain/player/playerId/PlayerId.js';
import { PlayerStatus } from './PlayerStatus';

/**
 * Represents a player in a matchmaking lobby.
 *
 * A player has:
 * - an id, used for identity and equality
 * - a name
 * - a readiness status
 */
export class Player {
    private _id: PlayerId;
    private _name: string;
    private _status: PlayerStatus;

    /**
     * Creates a new Player instance.
     *
     * @param {PlayerId} id - Unique identifier for the player.
     * @param {string} name - Name chosen by the player.
     * @param {PlayerStatus} status - Initial readiness status of the player.
     */
    constructor(id: PlayerId, name: string, status: PlayerStatus) {
        this._id = id;
        this._name = name;
        this._status = status;
    }

    /**
     * Accessor for the player id.
     *
     * @returns {PlayerId} The unique identifier of the player.
     */
    get id(): PlayerId {
        return this._id;
    }

    /**
     * Accessor for the Player's name.
     *
     * @returns {string} The name of the player.
     */
    get name(): string {
        return this._name;
    }

    /**
     * Accessor for the Player's status.
     *
     * @returns {PlayerStatus} The status of the player.
     */
    get status(): PlayerStatus {
        return this._status;
    }

    /**
     * Marks the player as ready.
     */
    markReady(): void {
        this._status = PlayerStatus.Ready;
    }

    /**
     * Marks the player as pending.
     */
    markPending(): void {
        this._status = PlayerStatus.Pending;
    }

    /**
     * Checks whether the player is ready.
     *
     * @returns {boolean} `true` if the player is ready, otherwise `false`.
     */
    isReady(): boolean {
        return this._status === PlayerStatus.Ready;
    }

    /**
     * Compares this player with another player.
     *
     * @param {Player} other - The other player to compare.
     * @returns {boolean} True if the players are the same entity.
     */
    equals(other: Player): boolean {
        return this._id.equals(other.id);
    }
}

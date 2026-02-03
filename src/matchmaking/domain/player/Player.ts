import type { PlayerId } from './playerId/PlayerId.ts';
import { PlayerStatus } from './PlayerStatus';

/**
 * Represents a player in a matchmaking lobby.
 *
 * Each player has a unique identifier (playerId) and a chosen name.
 * The player can also be marked as "ready" to indicate they are ready to start the game.
 */
export class Player {
    private secretId: PlayerId;
    private publicId: PlayerId;
    private name: string;

    /**
     * Indicates whether the player is ready to start the game.
     *
     * @type {PlayerStatus}
     * @private
     */
    private status: PlayerStatus = PlayerStatus.Pending;

    /**
     * Creates a new Player instance.
     *
     * @param {PlayerId} secretId - Unique and secret identifier for the player.
     * @param {PlayerId} playerId - Unique identifier for the player.
     * @param {string} name - Name chosen by the player.
     */
    constructor(secretId: PlayerId, playerId: PlayerId, name: string) {
        this.secretId = secretId;
        this.publicId = playerId;
        this.name = name;
    }

    /**
     * Accessor for the public id.
     *
     * @returns {PlayerId} The unique public identifier of the player.
     */
    getPublicId(): PlayerId {
        return this.publicId;
    }

    /**
     * Accessor for the secret id.
     *
     * @returns {PlayerId} The unique secret identifier of the player.
     */
    getSecretId(): PlayerId {
        return this.secretId;
    }

    /**
     * Accessor for the Player's name.
     *
     * @returns {string} The name of the player.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Marks the player as ready.
     */
    markReady() {
        this.status = PlayerStatus.Ready;
    }

    /**
     * Marks the player as pending.
     */
    markPending() {
        this.status = PlayerStatus.Pending;
    }

    /**
     * Checks whether the player is ready.
     *
     * @returns {boolean} `true` if the player is ready, otherwise `false`.
     */
    isReady(): boolean {
        return this.status === PlayerStatus.Ready;
    }

    /**
     * Compares this player with another player.
     *
     * @param {Player} other - The other player to compare.
     * @returns {boolean} True if the players are the same entity.
     */
    equals(other: Player): boolean {
        return this.secretId.equals(other.getSecretId());
    }
}

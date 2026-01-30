import type { Player } from '../player/Player.ts';
import type { PlayerId } from '../player/playerId/PlayerId.ts';

/**
 * Encapsulates the collection of players within a lobby.
 * * Responsible for:
 * - Managing the list of players.
 * - Enforcing capacity constraints.
 * - Providing search and validation logic for players.
 */
export class LobbyPlayers {
    private readonly items: Player[] = [];
    private readonly maxCapacity: number;
    /**
     * Creates a new LobbyPlayers collection.
     *
     * * @param {number} maxCapacity - The maximum number of players allowed.
     */
    constructor(maxCapacity: number) {
        this.maxCapacity = maxCapacity;
    }

    /**
     * Adds a player to the collection.
     *
     * @param {Player} player - The player to add.
     * @throws Error if the capacity is reached or if the player is already present.
     */
    add(player: Player): void {
        if (!this.hasSpace()) {
            throw new Error('Lobby is full');
        }

        if (this.contains(player)) {
            throw new Error('Player already in lobby');
        }

        this.items.push(player);
    }

    /**
     * Finds a player by their unique identifier.
     *
     * @param {PlayerId} playerId - The string representation of the PlayerId.
     * @returns {Player} The found player.
     * @throws Error if the player is not found.
     */
    findById(playerId: PlayerId): Player {
        const player = this.items.find((player) => player.getPlayerId().equals(playerId));
        if (!player) {
            throw new Error('Player not found in lobby');
        }
        return player;
    }

    /**
     * Checks if a specific player is already present in the lobby.
     *
     * @param {Player} player - The identifier of the player to check.
     * @returns {boolean} True if the player is in the collection, false otherwise.
     */
    contains(player: Player): boolean {
        return this.items.some((p: Player) => p.equals(player));
    }

    /**
     * Checks if all the players all are ready.
     *
     * @returns {boolean} True if all conditions are met.
     */
    areAllReady(): boolean {
        return this.items.every((player) => player.isReady());
    }

    /**
     * Returns the current number of players in the collection.
     *
     * @returns {number}
     */
    get count(): number {
        return this.items.length;
    }

    /**
     * Checks if more players can be added.
     *
     * * @returns {boolean} True if capacity is not reached.
     */
    hasSpace(): boolean {
        return this.count < this.maxCapacity;
    }
}

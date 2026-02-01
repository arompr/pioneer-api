import type { Player } from '../player/Player.ts';
import type { PlayerId } from '../player/playerId/PlayerId.ts';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError.ts';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError.ts';

/**
 * Encapsulates the collection of players within a lobby.
 */
export class LobbyPlayers {
    private readonly players: Player[] = [];

    /**
     * Adds a player to the collection.
     *
     * @param {Player} player - The player to add.
     * @throws {PlayerAlreadyInLobbyError} Error if the player is already present.
     */
    add(player: Player): void {
        if (this.contains(player)) {
            throw new PlayerAlreadyInLobbyError();
        }

        this.players.push(player);
    }

    /**
     * Removes a player from the collection.
     *
     * @param {PlayerId} id - The secret identifier of the player to remove.
     * @throws {PlayerNotFoundError} If the player is not in the lobby.
     */
    remove(id: PlayerId): void {
        this.players.splice(this.players.indexOf(this.findById(id)), 1);
    }

    /**
     * Finds a player by their unique identifier.
     *
     * @param {PlayerId} id - The string representation of the secret id.
     * @returns {Player} The found player.
     * @throws {PlayerNotFoundInLobbyError} Error if the player is not found.
     */
    findById(id: PlayerId): Player {
        const player = this.players.find((player) => player.getSecretId().equals(id));
        if (!player) {
            throw new PlayerNotFoundInLobbyError();
        }
        return player;
    }

    /**
     * Marks a player as ready using their unique identifier.
     *
     * @param {PlayerId} id - The secret identifier of the player.
     * @throws {PlayerNotFoundInLobbyError} If no player matches the given identifier.
     */
    markAsReady(id: PlayerId): void {
        this.findById(id).markReady();
    }

    /**
     * Marks a player as pending using their unique identifier.
     *
     * @param {PlayerId} id - The secret identifier of the player.
     * @throws {PlayerNotFoundInLobbyError} If no player matches the given identifier.
     */
    markAsPending(id: PlayerId): void {
        this.findById(id).markPending();
    }

    /**
     * Checks if all the players all are ready.
     *
     * @returns {boolean} True if all conditions are met.
     */
    areAllReady(): boolean {
        return this.players.every((player) => player.isReady());
    }

    /**
     * Returns a copy of all players in the lobby.
     */
    get all(): Player[] {
        return [...this.players];
    }

    /**
     * Checks if a specific player is already present in the lobby.
     *
     * @param {Player} player - The identifier of the player to check.
     * @returns {boolean} True if the player is in the collection, false otherwise.
     */
    contains(player: Player): boolean {
        return this.players.some((p: Player) => p.equals(player));
    }

    /**
     * Returns the current number of players in the collection.
     *
     * @returns {number}
     */
    get count(): number {
        return this.players.length;
    }
}

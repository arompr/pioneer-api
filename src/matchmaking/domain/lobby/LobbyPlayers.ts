import type { Player } from '../player/Player.ts';
import type { PlayerId } from '../player/playerId/PlayerId.ts';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError';

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
        if (this.contains(player.getSecretId())) {
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
     * Returns the first player in the lobby.
     *
     * @returns {Player} The first player.
     * @throws {PlayerNotFoundInLobbyError} If the lobby is empty.
     */
    first(): Player {
        const player = this.players.at(0);
        if (!player) {
            throw new PlayerNotFoundInLobbyError();
        }
        return player;
    }

    /**
     * Returns a copy of all players in the lobby.
     *
     * @returns {Player[]} The list of all the players in the lobby.
     */
    get all(): Player[] {
        return [...this.players];
    }

    /**
     * Checks if the collection contains no players.
     *
     *  @returns {boolean} True if the lobby is empty, false otherwise.
     */
    isEmpty(): boolean {
        return this.players.length === 0;
    }

    /**
     * Checks if a specific player is already present in the lobby.
     *
     * @param {PlayerId} playerId - The identifier of the player to check.
     * @returns {boolean} True if the player is in the collection, false otherwise.
     */
    contains(playerId: PlayerId): boolean {
        return this.players.some((p: Player) => p.getSecretId().equals(playerId));
    }

    /**
     * Returns the number of players that are marked as ready.
     *
     * @returns {number} The count of ready players.
     */
    get readyCount(): number {
        return this.players.filter((player) => player.isReady()).length;
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

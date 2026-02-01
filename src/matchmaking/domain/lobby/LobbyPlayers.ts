import type { Player } from '../player/Player.ts';
import type { PlayerId } from '../player/playerId/PlayerId.ts';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError.ts';
import { PlayerNotFoundError } from './errors/PlayerNotFoundInLobbyError.ts';

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
     * Finds a player by their unique identifier.
     *
     * @param {PlayerId} playerId - The string representation of the PlayerId.
     * @returns {Player} The found player.
     * @throws {PlayerNotFoundError} Error if the player is not found.
     */
    findById(playerId: PlayerId): Player {
        const player = this.players.find((player) => player.getPlayerId().equals(playerId));
        if (!player) {
            throw new PlayerNotFoundError();
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
        return this.players.some((p: Player) => p.equals(player));
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
     * Returns the current number of players in the collection.
     *
     * @returns {number}
     */
    get count(): number {
        return this.players.length;
    }
}

import type { Player } from '../player/Player.ts';
import { MinPlayersExceedsMaxPlayersError } from './errors/MinPlayersExceedsMaxPlayersError.ts';
import { InvalidMinPlayersError } from './errors/InvalidMinPlayersError.ts';
import type { LobbyId } from './lobbyId/LobbyId.ts';
import { LobbyStatus } from './LobbyStatus.ts';

/**
 * Represents a matchmaking lobby.
 */
export class Lobby {
    private readonly id: LobbyId;
    private readonly players: Player[] = [];
    private readonly maxPlayers: number;
    private readonly minPlayers: number;
    private status: LobbyStatus = LobbyStatus.WAITING_FOR_PLAYERS;

    /**
     * Creates a new Lobby instance.
     *
     * @param {LobbyId} id - Unique identifier for the lobby.
     * @param {number} minPlayers - Minimum number of players required.
     * @param {number} maxPlayers - Maximum number of players allowed.
     *
     * @throws {InvalidMinPlayersError} If `minPlayers` is less than 1.
     * @throws {MinPlayersExceedsMaxPlayersError} If `maxPlayers` is less than `minPlayers`.
     */
    constructor(id: LobbyId, minPlayers: number, maxPlayers: number) {
        this.validatePlayerLimits(minPlayers, maxPlayers);
        this.id = id;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    /**
     * Gets the lobby's unique identifier.
     *
     * @returns {LobbyId} The unique LobbyId
     */
    getId(): LobbyId {
        return this.id;
    }

    /**
     * Gets the minimum number of players required in the lobby.
     *
     * @returns {number} Minimum players
     */
    getMinPlayers(): number {
        return this.minPlayers;
    }

    /**
     * Gets the maximum number of players allowed in the lobby.
     *
     * @returns {number} Maximum players
     */
    getMaxPlayers(): number {
        return this.maxPlayers;
    }

    /**
     * Returns the current status of the lobby.
     *
     * @returns {LobbyStatus} LobbyStatus (e.g., WAITING_FOR_PLAYERS, ALL_PLAYERS_READY)
     */
    getStatus(): LobbyStatus {
        return this.status;
    }

    private validatePlayerLimits(minPlayers: number, maxPlayers: number): void {
        if (minPlayers < 1) {
            throw new InvalidMinPlayersError(minPlayers);
        }

        if (maxPlayers < minPlayers) {
            throw new MinPlayersExceedsMaxPlayersError(minPlayers, maxPlayers);
        }
    }
}

import { InvalidMinPlayersError } from '../errors/InvalidMinPlayersError.ts';
import { MinPlayersExceedsMaxPlayersError } from '../errors/MinPlayersExceedsMaxPlayersError.ts';
import type { LobbyGameMode } from './LobbyGameMode.ts';

/**
 * Value object representing the configuration rules of a lobby.
 */
export class LobbyConfig {
    public readonly mode: LobbyGameMode;
    public readonly minPlayers: number;
    public readonly maxPlayers: number;

    /**
     * Creates a new LobbyConfig.
     * @param {LobbyGameMode} mode - The game mode.
     * @param {number} minPlayers - Minimum number of players required.
     * @param {number} maxPlayers - Maximum number of players allowed.
     * @throws {InvalidMinPlayersError} If minPlayers is less than 1.
     * @throws {MinPlayersExceedsMaxPlayersError} If maxPlayers is less than minPlayers.
     */
    constructor(mode: LobbyGameMode, minPlayers: number, maxPlayers: number) {
        this.validate();
        this.mode = mode;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    /**
     * Gets the game mode associated with this configuration.
     *
     * @returns {LobbyGameMode}
     */
    getGameMode(): LobbyGameMode {
        return this.mode;
    }

    /**
     * Gets the minimum number of players allowed.
     *
     * @returns {number}
     */
    getMinPlayers(): number {
        return this.minPlayers;
    }

    /**
     * Gets the maximum number of players allowed.
     *
     * @returns {number}
     */
    getMaxPlayers(): number {
        return this.maxPlayers;
    }

    private validate(): void {
        if (this.minPlayers < 1) throw new InvalidMinPlayersError(this.minPlayers);
        if (this.maxPlayers < this.minPlayers)
            throw new MinPlayersExceedsMaxPlayersError(this.minPlayers, this.maxPlayers);
    }
}

import { InvalidMinPlayersError } from './errors/InvalidMinPlayersError';
import { MinPlayersExceedsMaxPlayersError } from './errors/MinPlayersExceedsMaxPlayersError';
import type { GameMode } from './GameMode';
import type { GameConfigId } from './GameConfigId';

/**
 * Value object representing the configuration rules for a game mode.
 */
export class GameConfig {
    public readonly gameConfigId: GameConfigId;
    public readonly gameMode: GameMode;
    public readonly minPlayers: number;
    public readonly maxPlayers: number;

    /**
     * Creates a new GameConfig.
     * @param {GameConfigId} gameConfigId - The unique identifier for this game configuration.
     * @param {GameMode} gameMode - The game mode.
     * @param {number} minPlayers - Minimum number of players required.
     * @param {number} maxPlayers - Maximum number of players allowed.
     * @throws {InvalidMinPlayersError} If minPlayers is less than 1.
     * @throws {MinPlayersExceedsMaxPlayersError} If maxPlayers is less than minPlayers.
     */
    constructor(
        gameConfigId: GameConfigId,
        gameMode: GameMode,
        minPlayers: number,
        maxPlayers: number
    ) {
        this.validate(minPlayers, maxPlayers);
        this.gameConfigId = gameConfigId;
        this.gameMode = gameMode;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    private validate(minPlayers: number, maxPlayers: number): void {
        if (minPlayers < 1) throw new InvalidMinPlayersError(minPlayers);
        if (maxPlayers < minPlayers)
            throw new MinPlayersExceedsMaxPlayersError(minPlayers, maxPlayers);
    }
}

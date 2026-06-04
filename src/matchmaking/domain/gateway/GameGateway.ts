export const GAME_GATEWAY = Symbol('GameGateway');

/**
 * Gateway interface for matchmaking to interact with game domain.
 */
export interface IGameGateway {
    /**
     * Creates a game configuration for the given game mode.
     * Delegates config creation to the game domain.
     *
     * @param {string} gameModeString - The game mode as a string (e.g., 'BASE')
     * @returns {Promise<{ configId: string }>} The created config ID
     * @throws If the game mode is not supported
     */
    createConfig(gameModeString: string): Promise<{ configId: string }>;

    /**
     * Validates if the current player count is valid for the given game config.
     *
     * @param {string} configId - The game config ID
     * @param {number} currentPlayers - Current number of players in the lobby
     * @returns {Promise<boolean>} True if valid, throws otherwise
     * @throws If config not found or validation fails
     */
    validatePlayerCount(configId: string, currentPlayers: number): Promise<boolean>;
}

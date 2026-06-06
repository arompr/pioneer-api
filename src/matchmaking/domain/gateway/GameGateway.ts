import { LobbyGameConfig } from '#matchmaking/domain/lobby/LobbyGameConfig';
import { GameConfigId } from '../gameConfig/GameConfigId';

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
     * Gets a matchmaking game configuration for the given config id.
     *
     * @param {GameConfigId} configId - The game configuration id
     * @returns {Promise<LobbyGameConfig>} The matchmaking game configuration
     * @throws if config not found
     */
    getMatchmakingGameConfig(configId: GameConfigId): Promise<LobbyGameConfig>;
}

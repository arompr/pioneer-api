import { LobbyConfig } from './LobbyConfig';
import type { GameConfigId } from '../../gameConfig/GameConfigId';

/**
 * Factory responsible for creating LobbyConfig instances.
 * Wraps game config IDs into LobbyConfig value objects.
 */
export class LobbyConfigFactory {
    /**
     * Creates a configuration for the given game config ID with optional player limits.
     *
     * @param {GameConfigId} gameConfigId - The game configuration identifier.
     * @param {number} [minPlayers=3] - Minimum players (TODO: fetch from game).
     * @param {number} [maxPlayers=4] - Maximum players (TODO: fetch from game).
     * @returns {LobbyConfig} The corresponding lobby configuration.
     */
    public createFromGameConfigId(
        gameConfigId: GameConfigId,
        minPlayers: number = 3,
        maxPlayers: number = 4
    ): LobbyConfig {
        return new LobbyConfig(gameConfigId, minPlayers, maxPlayers);
    }
}

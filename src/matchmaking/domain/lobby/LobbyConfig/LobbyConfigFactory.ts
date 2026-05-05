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
     * @returns {LobbyConfig} The corresponding lobby configuration.
     */
    public createFromGameConfigId(gameConfigId: GameConfigId): LobbyConfig {
        return new LobbyConfig(gameConfigId);
    }
}

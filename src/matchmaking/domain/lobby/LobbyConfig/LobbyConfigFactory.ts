import { LobbyGameMode } from './LobbyGameMode.ts';
import { LobbyConfig } from './LobbyConfig.ts';

/**
 * Factory responsible for creating LobbyConfig instances based on Game mode.
 */
export class LobbyConfigFactory {
    private static readonly SETUPS = {
        [LobbyGameMode.BASE]: { min: 3, max: 4 },
    };

    private constructor() {} // This tells ESLint: "I know I'm not instantiating this"

    /**
     * Creates a configuration specific to an existing game mode.
     *
     * @param {LobbyGameMode} mode - The chosen game mode.
     * @returns {LobbyConfig} The corresponding lobby configuration.
     * @throws {UnsupportedGameModeError} If the game mode is not supported.
     */
    public static createFromGameMode(mode: LobbyGameMode): LobbyConfig {
        const setup = this.SETUPS[mode];
        return new LobbyConfig(mode, setup.min, setup.max);
    }
}

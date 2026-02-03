import { LobbyGameMode } from './LobbyGameMode';
import { LobbyConfig } from './LobbyConfig';
import { UnsupportedGameModeError } from '../errors/UnsupportedGameModeError';

/**
 * Factory responsible for creating LobbyConfig instances based on Game mode.
 */
export class LobbyConfigFactory {
    private readonly SETUPS = new Map([[LobbyGameMode.BASE, { min: 3, max: 4 }]]);

    /**
     * Creates a configuration specific to an existing game mode.
     *
     * @param {LobbyGameMode} mode - The chosen game mode.
     * @returns {LobbyConfig} The corresponding lobby configuration.
     * @throws {UnsupportedGameModeError} If the game mode is not supported.
     */
    public createFromGameMode(mode: LobbyGameMode): LobbyConfig {
        const setup = this.SETUPS.get(mode);

        if (!setup) {
            throw new UnsupportedGameModeError(mode);
        }

        return new LobbyConfig(mode, setup.min, setup.max);
    }
}

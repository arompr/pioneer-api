import { GameConfig } from './GameConfig';
import { GameMode } from './GameMode';
import { UnsupportedGameModeError } from './errors/UnsupportedGameModeError';

/**
 * Factory responsible for creating GameConfig instances based on game mode.
 * This is the authoritative source of game-mode-specific configuration rules.
 */
export class GameConfigFactory {
    private readonly SETUPS = new Map([[GameMode.BASE, { min: 3, max: 4 }]]);

    /**
     * Creates a configuration specific to a game mode.
     *
     * @param {GameMode} mode - The chosen game mode.
     * @returns {GameConfig} The corresponding game configuration.
     * @throws {UnsupportedGameModeError} If the game mode is not supported.
     */
    public createFromGameMode(mode: GameMode): GameConfig {
        const setup = this.SETUPS.get(mode);

        if (!setup) {
            throw new UnsupportedGameModeError(mode);
        }

        return new GameConfig(mode, setup.min, setup.max);
    }
}

import { v4 as uuidv4 } from 'uuid';
import { GameConfig } from './GameConfig';
import { GameConfigId } from './GameConfigId';
import { GameMode } from './GameMode';
import { UnsupportedGameModeError } from './errors/UnsupportedGameModeError';

/**
 * Factory responsible for creating GameConfig instances based on game mode.
 * This is the authoritative source of game-mode-specific configuration rules.
 */
export class GameConfigFactory {
    private readonly SETUPS = new Map([[GameMode.BASE, { min: 3, max: 4 }]]);

    /**
     * Creates a configuration specific to a game mode with a generated GameConfigId.
     *
     * @param {GameMode} mode - The chosen game mode.
     * @returns {GameConfig} The corresponding game configuration with a generated ID.
     * @throws {UnsupportedGameModeError} If the game mode is not supported.
     */
    public createFromGameMode(mode: GameMode): GameConfig {
        const gameConfigId = this.generateId();
        return this.createWithId(mode, gameConfigId);
    }

    /**
     * Creates a configuration specific to a game mode with an optional GameConfigId.
     * If no ID is provided, a new one will be generated.
     *
     * @param {GameMode} mode - The chosen game mode.
     * @param {GameConfigId} [gameConfigId] - Optional GameConfigId. If not provided, a new one will be generated.
     * @returns {GameConfig} The corresponding game configuration.
     * @throws {UnsupportedGameModeError} If the game mode is not supported.
     */
    public createWithId(mode: GameMode, gameConfigId?: GameConfigId): GameConfig {
        const setup = this.SETUPS.get(mode);

        if (!setup) {
            throw new UnsupportedGameModeError(mode);
        }

        const id = gameConfigId || this.generateId();
        return new GameConfig(id, mode, setup.min, setup.max);
    }

    private generateId(): GameConfigId {
        return new GameConfigId(uuidv4());
    }
}

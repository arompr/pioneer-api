import { LobbyConfig } from './LobbyConfig';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import type { GameMode } from '#game/domain/config/GameMode';

/**
 * Factory responsible for creating LobbyConfig instances based on game mode.
 * Delegates to GameConfigFactory for authoritative game-mode configuration rules.
 */
export class LobbyConfigFactory {
    constructor(private readonly gameConfigFactory: GameConfigFactory) {}

    /**
     * Creates a configuration specific to an existing game mode.
     *
     * @param {GameMode} mode - The chosen game mode.
     * @returns {LobbyConfig} The corresponding lobby configuration.
     * @throws {UnsupportedGameModeError} If the game mode is not supported.
     */
    public createFromGameMode(mode: GameMode): LobbyConfig {
        const gameConfig = this.gameConfigFactory.createFromGameMode(mode);

        return new LobbyConfig(gameConfig.gameMode, gameConfig.minPlayers, gameConfig.maxPlayers);
    }
}

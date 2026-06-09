import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameMode } from '#game/domain/config/GameMode';

/**
 * Object Mother factory for creating GameConfig test fixtures.
 */
export class GameConfigMother {
    static readonly DEFAULT_CONFIG_ID = new GameConfigId('config-id-1');
    static readonly DEFAULT_MODE: GameMode = GameMode.BASE;
    static readonly DEFAULT_MIN_PLAYERS = 3;
    static readonly DEFAULT_MAX_PLAYERS = 4;

    /**
     * Creates a base GameConfig with default values.
     */
    static baseConfig(): GameConfig {
        return new GameConfig(
            GameConfigMother.DEFAULT_CONFIG_ID,
            GameConfigMother.DEFAULT_MODE,
            GameConfigMother.DEFAULT_MIN_PLAYERS,
            GameConfigMother.DEFAULT_MAX_PLAYERS
        );
    }

    /**
     * Creates a GameConfig with a custom ID.
     */
    static withId(id: GameConfigId): GameConfig {
        return new GameConfig(
            id,
            GameConfigMother.DEFAULT_MODE,
            GameConfigMother.DEFAULT_MIN_PLAYERS,
            GameConfigMother.DEFAULT_MAX_PLAYERS
        );
    }

    /**
     * Creates a GameConfig with custom player limits.
     */
    static withPlayerLimits(minPlayers: number, maxPlayers: number): GameConfig {
        return new GameConfig(
            GameConfigMother.DEFAULT_CONFIG_ID,
            GameConfigMother.DEFAULT_MODE,
            minPlayers,
            maxPlayers
        );
    }

    /**
     * Creates a GameConfig with custom mode.
     */
    static withMode(mode: GameMode): GameConfig {
        return new GameConfig(
            GameConfigMother.DEFAULT_CONFIG_ID,
            mode,
            GameConfigMother.DEFAULT_MIN_PLAYERS,
            GameConfigMother.DEFAULT_MAX_PLAYERS
        );
    }
}

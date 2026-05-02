import { GameMode } from '#game/domain/config/GameMode';

/**
 * Configuration setup for lobbies based on game mode.
 * Maps game modes to their corresponding min/max player requirements.
 */
export const LOBBY_CONFIG_SETUPS: Record<GameMode, { minPlayers: number; maxPlayers: number }> = {
    [GameMode.BASE]: { minPlayers: 3, maxPlayers: 4 },
};

/**
 * Creates lobby configuration limits for a given game mode.
 * @param {GameMode} gameMode - The game mode
 * @returns Object with minPlayers and maxPlayers
 * @throws {UnsupportedGameModeError} If the game mode is not supported
 */
export function getLobbySetupForGameMode(gameMode: GameMode): {
    minPlayers: number;
    maxPlayers: number;
} {
    const setup = LOBBY_CONFIG_SETUPS[gameMode];
    if (!setup) {
        throw new Error(`Unsupported game mode: ${gameMode}`);
    }
    return setup;
}

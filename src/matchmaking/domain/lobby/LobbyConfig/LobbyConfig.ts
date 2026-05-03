import type { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';

/**
 * Value object representing the configuration of a lobby.
 * Maintains a reference to the game configuration via gameConfigId.
 *
 * TODO (Future Refactoring): Player limits should come from the game domain via gateway queries.
 * Currently stored here with defaults for backward compatibility during transition.
 */
export class LobbyConfig {
    public readonly gameConfigId: GameConfigId;
    public readonly minPlayers: number;
    public readonly maxPlayers: number;

    /**
     * Creates a new LobbyConfig.
     * @param {GameConfigId} gameConfigId - Reference to the game configuration.
     * @param {number} [minPlayers=3] - Minimum players (TODO: fetch from game via gateway).
     * @param {number} [maxPlayers=4] - Maximum players (TODO: fetch from game via gateway).
     */
    constructor(gameConfigId: GameConfigId, minPlayers: number = 3, maxPlayers: number = 4) {
        this.gameConfigId = gameConfigId;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    /**
     * Gets the game config ID associated with this configuration.
     *
     * @returns {GameConfigId}
     */
    getGameConfigId(): GameConfigId {
        return this.gameConfigId;
    }

    /**
     * Gets the minimum number of players allowed.
     * TODO: Fetch from game domain via gateway.
     *
     * @returns {number}
     */
    getMinPlayers(): number {
        return this.minPlayers;
    }

    /**
     * Gets the maximum number of players allowed.
     * TODO: Fetch from game domain via gateway.
     *
     * @returns {number}
     */
    getMaxPlayers(): number {
        return this.maxPlayers;
    }
}

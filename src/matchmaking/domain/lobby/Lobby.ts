import type { LobbyId } from './lobbyId/LobbyId.ts';
import { LobbyStatus } from './LobbyStatus.ts';
import { LobbyPlayers } from './LobbyPlayers.ts';
import type { LobbyConfig } from './LobbyConfig/LobbyConfig.ts';

/**
 * Represents a matchmaking lobby.
 */
export class Lobby {
    private readonly id: LobbyId;
    private readonly players: LobbyPlayers = new LobbyPlayers();
    private readonly config: LobbyConfig;
    private status: LobbyStatus = LobbyStatus.WAITING_FOR_PLAYERS;

    /**
     * Creates a new Lobby instance.
     *
     * @param {LobbyId} id - Unique identifier for the lobby.
     * @param {LobbyConfig} config - The configuration containing mode and limits.
     *
     */
    constructor(id: LobbyId, config: LobbyConfig) {
        this.id = id;
        this.config = config;
    }

    /**
     * Gets the lobby's unique identifier.
     *
     * @returns {LobbyId} The unique LobbyId
     */
    getId(): LobbyId {
        return this.id;
    }

    /**
     * Returns the current status of the lobby.
     *
     * @returns {LobbyStatus} LobbyStatus (e.g., WAITING_FOR_PLAYERS, ALL_PLAYERS_READY)
     */
    getStatus(): LobbyStatus {
        return this.status;
    }
}

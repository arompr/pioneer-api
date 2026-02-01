import type { LobbyId } from './lobbyId/LobbyId.ts';
import { LobbyStatus } from './LobbyStatus.ts';
import { LobbyPlayers } from './LobbyPlayers.ts';
import type { LobbyConfig } from './LobbyConfig/LobbyConfig.ts';
import type { Player } from '../player/Player.ts';
import { LobbyFullError } from './errors/LobbyFullError.ts';

/**
 * Represents a matchmaking lobby.
 */
export class Lobby {
    private readonly id: LobbyId;
    private readonly players: LobbyPlayers = new LobbyPlayers();
    private readonly config: LobbyConfig;

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
     * @returns {LobbyStatus} LobbyStatus
     */
    get status(): LobbyStatus {
        if (this.hasReachedMinimum() && this.players.areAllReady()) {
            return LobbyStatus.READY_TO_START;
        }

        return LobbyStatus.WAITING_FOR_PLAYERS;
    }

    /**
     * Checks if the lobby meets all requirements to begin the match.
     */
    public canStart(): boolean {
        return this.status === LobbyStatus.READY_TO_START;
    }

    /**
     * Checks if the lobby is still waiting for more players or ready actions.
     */
    public isWaiting(): boolean {
        return this.status === LobbyStatus.WAITING_FOR_PLAYERS;
    }

    /**
     * Adds a player to the lobby if there is still room.
     */
    join(player: Player): void {
        if (this.isFull()) {
            throw new LobbyFullError(this.id);
        }
        this.players.add(player);
    }

    /**
     * Checks if the lobby has reached or exceeded its maximum capacity.
     */
    public isFull(): boolean {
        return this.players.count >= this.config.getMaxPlayers();
    }

    /**
     * Checks if the lobby has reached the minimum required players to start.
     */
    public hasReachedMinimum(): boolean {
        return this.players.count >= this.config.getMinPlayers();
    }
}

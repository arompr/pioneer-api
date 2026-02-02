import type { LobbyId } from './lobbyId/LobbyId.ts';
import { LobbyStatus } from './LobbyStatus.ts';
import { LobbyPlayers } from './LobbyPlayers.ts';
import type { LobbyConfig } from './LobbyConfig/LobbyConfig.ts';
import type { Player } from '../player/Player.ts';
import { LobbyFullError } from './errors/LobbyFullError.ts';
import type { PlayerId } from '../player/playerId/PlayerId.ts';
import { PlayerIsNotHostError } from './errors/PlayerIsNotHostError.ts';
import { LobbyNotReadyToStartError } from './errors/LobbyNotReadyToStartError.ts';
import { LobbyAlreadyInGameError } from './errors/LobbyAlreadyInGameError.ts';

/**
 * Represents a matchmaking lobby.
 */
export class Lobby {
    private readonly id: LobbyId;
    private readonly players: LobbyPlayers = new LobbyPlayers();
    private readonly config: LobbyConfig;
    private inGame: boolean = false;

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
        if (this.inGame) {
            return LobbyStatus.IN_GAME;
        }

        if (this.meetsRequirements()) {
            return LobbyStatus.READY_TO_START;
        }

        return LobbyStatus.WAITING_FOR_PLAYERS;
    }

    /**
     * Adds a player to the lobby if there is still room.
     *
     * @param {Player} player - The player to add to the lobby.
     * @throws {LobbyFullError} If the lobby has already reached its maximum capacity.
     * @throws {PlayerAlreadyInLobbyError} If the player is already present in the lobby.
     */
    join(player: Player): void {
        this.ensureNotInGame();

        if (this.isFull()) {
            throw new LobbyFullError(this.id);
        }
        this.players.add(player);
    }

    /**
     * Remove a player from the lobby.
     *
     * @param {PlayerId} id - The player to remove from the lobby.
     * @throws {PlayerNotFoundInLobbyError} If the player to remove is not in the lobby.
     */
    leave(id: PlayerId): void {
        this.players.remove(id);
    }

    /**
     * Transitions the lobby to the started state and locks it for the match.
     * This action is irreversible and prevents new players from joining.
     * Only the host can initiate this transition, and all match requirements
     * (minimum players and readiness) must be met.
     *
     * @param {PlayerId} playerId - The identifier of the player attempting to start the match.
     * @throws {PlayerIsNotHostError} If the provided playerId does not belong to the lobby host.
     * @throws {LobbyNotReadyToStartError} If the lobby status is not READY_TO_START.
     */
    start(playerId: PlayerId): void {
        this.ensureNotInGame();

        if (!this.isHost(playerId)) {
            throw new PlayerIsNotHostError(playerId, this.id);
        }

        if (this.status !== LobbyStatus.READY_TO_START) {
            throw new LobbyNotReadyToStartError(this.id);
        }

        this.inGame = true;
    }

    /**
     * Mark a player as ready.
     *
     * @param {PlayerId} id - The player to mark as ready.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    markAsReady(id: PlayerId): void {
        this.ensureNotInGame();
        this.players.markAsReady(id);
    }

    /**
     * Mark a player as pending.
     *
     * @param {PlayerId} id - The player to mark as pending.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    markAsPending(id: PlayerId): void {
        this.ensureNotInGame();
        this.players.markAsPending(id);
    }

    /**
     * Checks if the lobby status is ready to start.
     *
     * @returns {boolean} True if the lobby is ready to start, otherwise false.
     */
    canStart(): boolean {
        return this.status === LobbyStatus.READY_TO_START;
    }

    /**
     * Checks if the lobby is still waiting for more players or ready actions.
     *
     * @returns {boolean} True if the lobby is in waiting mode, false otherwise.
     */
    isWaiting(): boolean {
        return this.status === LobbyStatus.WAITING_FOR_PLAYERS;
    }

    /**
     * Checks if a given player is the host of this lobby.
     *
     * @param {PlayerId} id - The ID to check.
     * @returns {boolean} True if the player is the host.
     */
    isHost(id: PlayerId): boolean {
        if (this.isEmpty()) {
            return false;
        }
        return this.hostId.equals(id);
    }

    /**
     * Checks if the lobby has reached or exceeded its maximum capacity.
     *
     * @returns {boolean} True if the lobby is full, false otherwise.
     */
    isFull(): boolean {
        return this.remainingPlaces() === 0;
    }

    /**
     * Checks if the lobby is empty and can be safely deleted.
     *
     * @returns {boolean} True if the lobby is empty, false otherwise.
     */
    isEmpty(): boolean {
        return this.players.isEmpty();
    }

    /**
     * Checks if the lobby has reached the minimum required players to start.
     *
     * @returns {boolean} True if the lobby has reached the minimum capacity, false otherwise.
     */
    hasReachedMinimum(): boolean {
        return this.players.count >= this.config.getMinPlayers();
    }

    /**
     * Calculates the number of available places remaining in the lobby.
     *
     * @returns {number} The number of players that can still join.
     */
    remainingPlaces(): number {
        return Math.max(0, this.config.getMaxPlayers() - this.players.count);
    }

    /**
     * Returns a copy of the current players in the lobby.
     *
     * @returns {Player[]} All the players in the lobby.
     */
    get allPlayers(): Player[] {
        return this.players.all;
    }

    /**
     * Returns the current number of players.
     *
     * @returns {number} The number of players
     */
    get playerCount(): number {
        return this.players.count;
    }

    /**
     * Returns the ID of the current host (the first player who joined).
     *
     * @returns {PlayerId} The unique identifier of the host.
     * @throws {PlayerNotFoundInLobbyError} If the lobby is empty.
     * @private
     */
    private get hostId(): PlayerId {
        return this.players.first().getSecretId();
    }

    /**
     * Evaluates if the essential technical conditions are met to allow a match.
     * 1. The player count must meet the minimum defined in the config.
     * 2. Every player currently in the lobby must have marked themselves as ready.
     *
     * @returns {boolean} True if player count and readiness requirements are satisfied.
     * @private
     */
    private meetsRequirements(): boolean {
        return this.hasReachedMinimum() && this.players.areAllReady();
    }

    /**
     * Internal guard to ensure the lobby is not already in a match.
     *
     * @throws {LobbyAlreadyInGameError} If the game has already started.
     * @private
     */
    private ensureNotInGame(): void {
        if (this.status === LobbyStatus.IN_GAME) {
            throw new LobbyAlreadyInGameError(this.id);
        }
    }
}

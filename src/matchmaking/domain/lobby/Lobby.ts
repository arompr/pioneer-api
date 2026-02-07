import type { LobbyId } from './lobbyId/LobbyId';
import { LobbyPlayers } from './LobbyPlayers';
import type { LobbyConfig } from './LobbyConfig/LobbyConfig';
import type { Player } from '../player/Player';
import type { PlayerId } from '../player/playerId/PlayerId';
import { LobbyState } from './states/LobbyState';
import { ClosedState } from './states/ClosedState';
import ILobby from './ILobby';

/**
 * Represents a matchmaking lobby.
 */
export class Lobby implements ILobby {
    private readonly id: LobbyId;
    private readonly players: LobbyPlayers;
    private readonly config: LobbyConfig;
    private hostId: PlayerId;
    private lobbyState: LobbyState;

    /**
     * Creates a new Lobby instance.
     *
     * @param {LobbyId} id - Unique identifier for the lobby.
     * @param {LobbyConfig} config - The configuration containing mode and limits.
     *
     */
    constructor(
        id: LobbyId,
        config: LobbyConfig,
        hostId: PlayerId,
        players: LobbyPlayers,
        lobbyState: LobbyState
    ) {
        this.id = id;
        this.config = config;
        this.hostId = hostId;
        this.players = players;
        this.lobbyState = lobbyState;
        this.transitionTo(lobbyState);
    }

    /**
     * Gets the lobby's unique identifier.
     *
     * @returns {LobbyId} The unique LobbyId
     */
    getId(): LobbyId {
        return this.id;
    }

    transitionTo(lobbyState: LobbyState) {
        this.lobbyState = lobbyState;
        this.lobbyState.setLobby(this);
    }

    /**
     * Adds a player to the lobby if there is still room.
     *
     * @param {Player} player - The player to add to the lobby.
     * @throws {LobbyFullError} If the lobby has already reached its maximum capacity.
     * @throws {PlayerAlreadyInLobbyError} If the player is already present in the lobby.
     */
    join(player: Player): void {
        this.lobbyState.join(player);
    }

    /**
     * Remove a player from the lobby.
     *
     * @param {PlayerId} id - The player to remove from the lobby.
     * @throws {PlayerNotFoundInLobbyError} If the player to remove is not in the lobby.
     */
    leave(id: PlayerId): void {
        const wasHost = this.isHost(id);
        this.players.remove(id);
        if (wasHost) {
            this.reassignHost();
        }
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
        this.lobbyState.start(playerId);
    }

    /**
     * Mark a player as ready.
     *
     * @param {PlayerId} id - The player to mark as ready.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    markAsReady(id: PlayerId): void {
        this.lobbyState.markAsReady(id);
    }

    /**
     * Mark a player as pending.
     *
     * @param {PlayerId} id - The player to mark as pending.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    markAsPending(id: PlayerId): void {
        this.lobbyState.markAsPending(id);
    }

    /**
     * Checks if the lobby status is ready to start.
     *
     * @returns {boolean} True if the lobby is ready to start, otherwise false.
     */
    canStart(): boolean {
        return this.lobbyState.canStart();
    }

    /**
     * Checks if a given player is the host of this lobby.
     *
     * @param {PlayerId} id - The ID to check.
     * @returns {boolean} True if the player is the host.
     */
    isHost(id: PlayerId): boolean {
        return !this.isEmpty() && this.hostId.equals(id);
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
     * Returns the number of players that are ready in the lobby.
     *
     * @returns {number} The count of ready players.
     */
    get readyPlayerCount(): number {
        return this.players.readyCount;
    }

    /**
     * Evaluates if the essential technical conditions are met to allow a match.
     * 1. The player count must meet the minimum defined in the config.
     * 2. Every player currently in the lobby must have marked themselves as ready.
     *
     * @returns {boolean} True if player count and readiness requirements are satisfied.
     */
    meetsRequirementsToStart(): boolean {
        return this.hasReachedMinimum() && this.players.areAllReady();
    }

    /**
     * Reassigns the host after the current host leaves the lobby.
     *
     * If no players remain, the lobby is closed.
     * Otherwise, a new host is selected according to the host assignment rules.
     *
     * This method assumes the leaving player was the current host.
     * @private
     */
    private reassignHost(): void {
        if (this.players.isEmpty()) {
            this.transitionTo(new ClosedState());
        } else {
            this.assignNextHost();
        }
    }

    /**
     * Assigns the next host among the remaining players.
     * @private
     */
    private assignNextHost() {
        this.hostId = this.players.first().getSecretId();
    }

    /** @internal */
    internalAddPlayer(player: Player): void {
        this.players.add(player);
    }

    /** @internal */
    internalMarkAsReady(id: PlayerId): void {
        this.players.markAsReady(id);
    }

    /** @internal */
    internalMarkAsPending(id: PlayerId): void {
        this.players.markAsPending(id);
    }
}

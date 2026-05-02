import type { LobbyId } from './lobbyId/LobbyId';
import { LobbyPlayers } from './LobbyPlayers';
import type { LobbyConfig } from './LobbyConfig/LobbyConfig';
import type { Player } from '../player/Player';
import { LobbyState } from './states/LobbyState';
import { ClosedState } from './states/ClosedState';
import { ILobby } from './ILobby';
import { AggregateRoot } from '#common/domain/aggregate/AggregateRoot';
import {
    PlayerJoinedLobby,
    PlayerLeftLobby,
    LobbyStarted,
    PlayerMarkedReady,
    PlayerMarkedPending,
    LobbyClosed,
    LobbyHostChanged,
} from './events';
import { LobbyStateType } from './states/LobbyStateType';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { GameConfigId } from '#game/domain/config/GameConfigId';

/**
 * Represents a matchmaking lobby.
 */
export class Lobby extends AggregateRoot implements ILobby {
    private readonly _id: LobbyId;
    private readonly _players: LobbyPlayers;
    private readonly _config: LobbyConfig;
    private _hostId: PlayerId;
    private _lobbyState: LobbyState;
    private readonly _gameConfigId?: GameConfigId;

    /**
     * Creates a new Lobby instance.
     *
     * @param {LobbyId} id - Unique identifier for the lobby.
     * @param {LobbyConfig} config - The configuration containing mode and limits.
     * @param {PlayerId} hostId - The unique identifier of the lobby host.
     * @param {LobbyPlayers} players - The collection of players in the lobby.
     * @param {LobbyState} lobbyState - The current state of the lobby.
     * @param {GameConfigId} [gameConfigId] - Optional unique identifier for the game configuration.
     */
    constructor(
        id: LobbyId,
        config: LobbyConfig,
        hostId: PlayerId,
        players: LobbyPlayers,
        lobbyState: LobbyState,
        gameConfigId?: GameConfigId
    ) {
        super();
        this._id = id;
        this._config = config;
        this._hostId = hostId;
        this._players = players;
        this._lobbyState = lobbyState;
        this._gameConfigId = gameConfigId;
        this.transitionTo(lobbyState);
    }

    /**
     * Gets the lobby's unique identifier.
     *
     * @returns {LobbyId} The unique LobbyId
     */
    get id(): LobbyId {
        return this._id;
    }

    /**
     * Gets the lobby configuration (min/max players, mode).
     *
     * @returns {LobbyConfig} The immutable configuration of the lobby.
     */
    get config(): LobbyConfig {
        return this._config;
    }

    /**
     * Gets the game configuration identifier if set.
     *
     * @returns {GameConfigId | undefined} The game configuration ID, or undefined if not set.
     */
    get gameConfigId(): GameConfigId | undefined {
        return this._gameConfigId;
    }

    /**
     * Gets the identifier of the current host.
     *
     * @returns {PlayerId} The host's unique identifier.
     */
    get hostId(): PlayerId {
        return this._hostId;
    }

    /**
     * Gets the current state of the lobby (open, closed, started, etc.).
     *
     * @returns {LobbyStateType} The type of the current lobby state.
     */
    get stateType(): LobbyStateType {
        return this._lobbyState.stateType;
    }

    /**
     * Changes the lobby to the given state and binds the state to this lobby.
     *
     * @param {LobbyState} lobbyState - The new state.
     */
    transitionTo(lobbyState: LobbyState): void {
        this._lobbyState = lobbyState;
        this._lobbyState.setLobby(this);
    }

    /**
     * Adds a player to the lobby if there is still room.
     *
     * @param {Player} player - The player to add to the lobby.
     * @throws {LobbyFullError} If the lobby has already reached its maximum capacity.
     * @throws {PlayerAlreadyInLobbyError} If the player is already present in the lobby.
     */
    join(player: Player): void {
        this._lobbyState.join(player);
        this.record(new PlayerJoinedLobby(player.id));
    }

    /**
     * Remove a player from the lobby.
     *
     * @param {PlayerId} playerId - The player to remove from the lobby.
     * @throws {PlayerNotFoundInLobbyError} If the player to remove is not in the lobby.
     */
    leave(playerId: PlayerId): void {
        const wasHost = this.isHost(playerId);
        this._players.remove(playerId);
        this.record(new PlayerLeftLobby(this._id, playerId, wasHost));
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
        this._lobbyState.start(playerId);
        this.record(new LobbyStarted());
    }

    /**
     * Mark a player as ready.
     *
     * @param {PlayerId} playerId - The player to mark as ready.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    markAsReady(playerId: PlayerId): void {
        this._lobbyState.markAsReady(playerId);
        this.record(new PlayerMarkedReady(playerId));
    }

    /**
     * Mark a player as pending.
     *
     * @param {PlayerId} playerId - The player to mark as pending.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    markAsPending(playerId: PlayerId): void {
        this._lobbyState.markAsPending(playerId);
        this.record(new PlayerMarkedPending(playerId));
    }

    /**
     * Checks if the lobby status is ready to start.
     *
     * @returns {boolean} True if the lobby is ready to start, otherwise false.
     */
    canStart(): boolean {
        return this._lobbyState.canStart();
    }

    /**
     * Checks if a given player is the host of this lobby.
     *
     * @param {PlayerId} id - The ID to check.
     * @returns {boolean} True if the player is the host.
     */
    isHost(id: PlayerId): boolean {
        return !this.isEmpty() && this._hostId.equals(id);
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
        return this._players.isEmpty();
    }

    /**
     * Checks if the lobby has reached the minimum required players to start.
     *
     * @returns {boolean} True if the lobby has reached the minimum capacity, false otherwise.
     */
    hasReachedMinimum(): boolean {
        return this._players.count >= this._config.getMinPlayers();
    }

    /**
     * Calculates the number of available places remaining in the lobby.
     *
     * @returns {number} The number of players that can still join.
     */
    remainingPlaces(): number {
        return Math.max(0, this._config.getMaxPlayers() - this._players.count);
    }

    /**
     * Returns a copy of the current players in the lobby.
     *
     * @returns {Player[]} All the players in the lobby.
     */
    get allPlayers(): Player[] {
        return this._players.all;
    }

    /**
     * Returns a player if it exists in the lobby.
     *
     * @param {PlayerId} playerId - The ID of the player to find.
     * @returns {Player} The player in the lobby.
     * @throws {PlayerNotFoundInLobbyError} If the player is not in the lobby.
     */
    findPlayer(playerId: PlayerId): Player {
        return this._players.findById(playerId);
    }

    /**
     * Returns the current number of players.
     *
     * @returns {number} The number of players
     */
    get playerCount(): number {
        return this._players.count;
    }

    /**
     * Returns the number of players that are ready in the lobby.
     *
     * @returns {number} The count of ready players.
     */
    get readyPlayerCount(): number {
        return this._players.readyCount;
    }

    /**
     * Evaluates if the essential technical conditions are met to allow a match.
     * 1. The player count must meet the minimum defined in the config.
     * 2. Every player currently in the lobby must have marked themselves as ready.
     *
     * @returns {boolean} True if player count and readiness requirements are satisfied.
     */
    meetsRequirementsToStart(): boolean {
        return this.hasReachedMinimum() && this._players.areAllReady();
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
        if (this._players.isEmpty()) {
            this.transitionTo(new ClosedState());
            this.record(new LobbyClosed());
        } else {
            this.assignNextHost();
            this.record(new LobbyHostChanged(this._hostId));
        }
    }

    /**
     * Assigns the next host among the remaining players.
     * @private
     */
    private assignNextHost() {
        this._hostId = this._players.first().id;
    }

    /** @internal */
    internalAddPlayer(player: Player): void {
        this._players.add(player);
    }

    /** @internal */
    internalMarkAsReady(id: PlayerId): void {
        this._players.markAsReady(id);
    }

    /** @internal */
    internalMarkAsPending(id: PlayerId): void {
        this._players.markAsPending(id);
    }
}

import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyPlayers } from '#matchmaking/domain/lobby/LobbyPlayers';
import { ClosedState } from '#matchmaking/domain/lobby/states/ClosedState';
import { InGameState } from '#matchmaking/domain/lobby/states/InGameState';
import { LobbyState } from '#matchmaking/domain/lobby/states/LobbyState';
import { ReadyToStartState } from '#matchmaking/domain/lobby/states/ReadyToStartState';
import { WaitingForPlayersState } from '#matchmaking/domain/lobby/states/WaitingForPlayersState';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerMother } from '../player/PlayerMother';

/**
 * Object Mother factory for creating Lobby instances with various configurations for testing.
 */
export class LobbyMother {
    static readonly DEFAULT_LOBBY_ID = new LobbyId('lobby-id');
    static readonly DEFAULT_GAME_CONFIG_ID = new GameConfigId('game-config-id');
    static readonly DEFAULT_MIN_PLAYERS = 3;
    static readonly DEFAULT_MAX_PLAYERS = 4;

    private static readonly DEFAULT_LOBBY_CONFIG = new LobbyConfig(
        LobbyMother.DEFAULT_GAME_CONFIG_ID
    );

    private _gameConfigId?: GameConfigId;

    private constructor() {
        // Private constructor to enforce static factory methods
    }

    /**
     * Creates a new LobbyMother instance for building lobbies.
     *
     * @returns {LobbyMother} A new builder instance.
     */
    static builder(): LobbyMother {
        return new LobbyMother();
    }

    /**
     * Sets the gameConfigId for the lobby being built.
     *
     * @param {GameConfigId | undefined} gameConfigId - The game config ID or undefined.
     * @returns {LobbyMother} This builder for chaining.
     */
    withGameConfigId(gameConfigId: GameConfigId | undefined): LobbyMother {
        this._gameConfigId = gameConfigId;
        return this;
    }

    /**
     * Builds a basic lobby with 1 player and no gameConfigId (backward compatibility).
     *
     * @returns {{lobby: Lobby; players: Player[]}} The created lobby and its players.
     */
    static baseLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new WaitingForPlayersState(), 1, 0, undefined);
    }

    /**
     * Builds a lobby that is ready to start with gameConfigId.
     *
     * @param {GameConfigId} [gameConfigId] - Optional game config ID.
     * @returns {{lobby: Lobby; players: Player[]}} The created lobby and its players.
     */
    static baseLobbyWithGameConfigId(gameConfigId?: GameConfigId): {
        lobby: Lobby;
        players: Player[];
    } {
        return this.buildLobbyWithState(
            new WaitingForPlayersState(),
            1,
            0,
            gameConfigId ?? this.DEFAULT_GAME_CONFIG_ID
        );
    }

    static inGameLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new InGameState(), 3, 3, undefined);
    }

    static inClosedLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new ClosedState(), 0, 0, undefined);
    }

    static readyToStartLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new ReadyToStartState(), 2, 2, undefined);
    }

    /**
     * Builds a lobby that is ready to start with gameConfigId.
     *
     * @param {GameConfigId} [gameConfigId] - Optional game config ID.
     * @returns {{lobby: Lobby; players: Player[]}} The created lobby and its players.
     */
    static readyToStartLobbyWithGameConfigId(gameConfigId?: GameConfigId): {
        lobby: Lobby;
        players: Player[];
    } {
        return this.buildLobbyWithState(
            new ReadyToStartState(),
            2,
            2,
            gameConfigId ?? this.DEFAULT_GAME_CONFIG_ID
        );
    }

    private static buildLobbyWithState(
        state: LobbyState,
        totalPlayersInLobby: number,
        numberOfReadyPlayer: number,
        gameConfigId?: GameConfigId
    ) {
        const players: Player[] = PlayerMother.createMany(4, numberOfReadyPlayer);

        const lobbyPlayers: LobbyPlayers = new LobbyPlayers();
        players.slice(0, totalPlayersInLobby).forEach((player) => {
            lobbyPlayers.add(player);
        });

        const lobby = new Lobby(
            this.DEFAULT_LOBBY_ID,
            players[0].id,
            lobbyPlayers,
            state,
            gameConfigId
        );

        return { lobby, players };
    }
}

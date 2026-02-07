import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyPlayers } from '#matchmaking/domain/lobby/LobbyPlayers';
import { ClosedState } from '#matchmaking/domain/lobby/states/ClosedState';
import { InGameState } from '#matchmaking/domain/lobby/states/InGameState';
import { LobbyState } from '#matchmaking/domain/lobby/states/LobbyState';
import { ReadyToStartState } from '#matchmaking/domain/lobby/states/ReadyToStartState';
import { WaitingForPlayersState } from '#matchmaking/domain/lobby/states/WaitingForPlayersState';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerMother } from '../player/PlayerMother';

export class LobbyMother {
    static readonly DEFAULT_LOBBY_ID = new LobbyId('lobby-id');
    static readonly DEFAULT_MIN_PLAYERS = 2;
    static readonly DEFAULT_MAX_PLAYERS = 3;
    private static readonly DEFAULT_LOBBY_CONFIG = new LobbyConfig(
        LobbyGameMode.BASE,
        LobbyMother.DEFAULT_MIN_PLAYERS,
        LobbyMother.DEFAULT_MAX_PLAYERS
    );

    static baseLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new WaitingForPlayersState(), 1, 0);
    }

    static inGameLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new InGameState(), 3, 3);
    }

    static inClosedLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new ClosedState(), 0, 0);
    }

    static readyToStartLobby(): { lobby: Lobby; players: Player[] } {
        return this.buildLobbyWithState(new ReadyToStartState(), 2, 2);
    }

    private static buildLobbyWithState(
        state: LobbyState,
        totalPlayersInLobby: number,
        numberOfReadyPlayer: number
    ) {
        const players: Player[] = PlayerMother.createMany(4, numberOfReadyPlayer);

        const lobbyPlayers: LobbyPlayers = new LobbyPlayers();
        players.slice(0, totalPlayersInLobby).forEach((player) => {
            lobbyPlayers.add(player);
        });

        const lobby = new Lobby(
            this.DEFAULT_LOBBY_ID,
            this.DEFAULT_LOBBY_CONFIG,
            players[0].getSecretId(),
            lobbyPlayers,
            state
        );

        return { lobby, players };
    }
}

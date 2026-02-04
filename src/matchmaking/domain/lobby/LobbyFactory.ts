import { Player } from '../player/Player';
import { Lobby } from './Lobby';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyIdFactory } from './lobbyId/LobbyIdFactory';
import { LobbyPlayers } from './LobbyPlayers';

export class LobbyFactory {
    private readonly lobbyIdFactory: LobbyIdFactory;
    private readonly INITIAL_IN_GAME = false;
    private readonly INITIAL_IS_CLOSED = false;

    constructor(lobbyIdFactory: LobbyIdFactory) {
        this.lobbyIdFactory = lobbyIdFactory;
    }

    /**
     * Creates a new Lobby with a host player.
     *
     * @param hostName Optional name for the host. If not provided, a default name will be used.
     * @param config The configuration for the lobby.
     */
    create(config: LobbyConfig, host: Player): Lobby {
        const lobbyId: LobbyId = this.lobbyIdFactory.generate();
        const players = new LobbyPlayers();
        players.add(host);

        return new Lobby(
            lobbyId,
            config,
            host.getSecretId(),
            players,
            this.INITIAL_IN_GAME,
            this.INITIAL_IS_CLOSED
        );
    }
}

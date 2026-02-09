import { Player } from '../player/Player';
import { Lobby } from './Lobby';
import { LobbyAggregate } from './LobbyAggregate.type';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyIdFactory } from './lobbyId/LobbyIdFactory';
import { LobbyPlayers } from './LobbyPlayers';
import { WaitingForPlayersState } from './states/WaitingForPlayersState';

export class LobbyFactory {
    private readonly lobbyIdFactory: LobbyIdFactory;

    constructor(lobbyIdFactory: LobbyIdFactory) {
        this.lobbyIdFactory = lobbyIdFactory;
    }

    /**
     * Creates a new Lobby with a host player.
     *
     * @param hostName Optional name for the host. If not provided, a default name will be used.
     * @param config The configuration for the lobby.
     */
    create(config: LobbyConfig, host: Player): LobbyAggregate {
        const lobbyId: LobbyId = this.lobbyIdFactory.generate();
        const players = new LobbyPlayers();
        players.add(host);

        return new Lobby(lobbyId, config, host.id, players, new WaitingForPlayersState());
    }
}

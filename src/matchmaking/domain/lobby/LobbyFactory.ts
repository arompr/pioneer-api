import type { GameConfigId } from '../gameConfig/GameConfigId';
import { Player } from '../player/Player';
import { Lobby } from './Lobby';
import { LobbyAggregate } from './LobbyAggregate.type';
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
     * @param {Player} host - The host player for the lobby.
     * @param {GameConfigId | undefined} gameConfigId - Optional game config ID association.
     * @returns {LobbyAggregate} A new lobby instance.
     */
    create(host: Player, gameConfigId?: GameConfigId): LobbyAggregate {
        const lobbyId: LobbyId = this.lobbyIdFactory.generate();
        const players = new LobbyPlayers();
        players.add(host);

        return new Lobby(lobbyId, host.id, players, new WaitingForPlayersState(), gameConfigId);
    }
}

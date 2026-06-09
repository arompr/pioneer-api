import { GameConfigId } from '../gameConfig/GameConfigId';
import { IGameGateway } from '../gateway/GameGateway';
import { Player } from '../player/Player';
import { Lobby } from './Lobby';
import { LobbyAggregate } from './LobbyAggregate.type';
import { LobbyId } from './lobbyId/LobbyId';
import { LobbyIdFactory } from './lobbyId/LobbyIdFactory';
import { LobbyPlayers } from './LobbyPlayers';
import { WaitingForPlayersState } from './states/WaitingForPlayersState';

export class LobbyFactory {
    private readonly lobbyIdFactory: LobbyIdFactory;
    private readonly gameGateway: IGameGateway;

    constructor(lobbyIdFactory: LobbyIdFactory, gameGateway: IGameGateway) {
        this.lobbyIdFactory = lobbyIdFactory;
        this.gameGateway = gameGateway;
    }

    /**
     * Creates a new Lobby with a host player.
     *
     * @param {Player} host - The host player for the lobby.
     * @returns {LobbyAggregate} A new lobby instance.
     */
    async create(host: Player): Promise<LobbyAggregate> {
        const gameConfig = await this.gameGateway.createConfig('BASE');
        const gameConfigId = new GameConfigId(gameConfig.configId);

        const lobbyId: LobbyId = this.lobbyIdFactory.generate();
        const players = new LobbyPlayers();
        players.add(host);

        return new Lobby(lobbyId, host.id, players, new WaitingForPlayersState(), gameConfigId);
    }
}

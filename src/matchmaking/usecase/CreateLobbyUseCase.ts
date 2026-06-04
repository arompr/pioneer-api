import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { CreateLobbyDto } from './dto/CreateLobbyDto';

export type CreateLobbyResult = {
    createdLobby: LobbyAggregate;
    createdHostPlayer: Player;
    token: string;
};

export class CreateLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly lobbyFactory: LobbyFactory,
        private readonly playerFactory: PlayerFactory,
        private readonly outboxService: OutboxService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly gameGateway: IGameGateway
    ) {}

    /**
     * Creates a new lobby.
     * If gameConfigId is provided, it associates the lobby with that configuration.
     * Otherwise, a default configuration is created via GameGateway.
     *
     * @param {CreateLobbyDto} dto - The DTO containing hostName and optional gameConfigId
     * @returns {Promise<CreateLobbyResult>} The created lobby, host player, and JWT token
     */
    async execute(dto: CreateLobbyDto): Promise<CreateLobbyResult> {
        let gameConfigId: GameConfigId;

        if (dto.gameConfigId) {
            gameConfigId = new GameConfigId(dto.gameConfigId);
        } else {
            const result = await this.gameGateway.createConfig('BASE');
            gameConfigId = new GameConfigId(result.configId);
        }

        await this.gameGateway.validatePlayerCount(gameConfigId.value, 1);

        const createdHostPlayer = this.playerFactory.create(dto.hostName);
        const createdLobby = this.lobbyFactory.create(createdHostPlayer, gameConfigId);

        this.lobbyRepository.save(createdLobby);
        this.outboxService.publishEvents(createdLobby);

        const token = this.jwtTokenService.encode(createdHostPlayer.id, createdLobby.id);

        return { createdLobby, createdHostPlayer, token };
    }
}

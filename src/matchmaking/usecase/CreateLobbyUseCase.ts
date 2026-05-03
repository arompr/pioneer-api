import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { CreateLobbyDto } from './dto/CreateLobbyDto';

export type CreateLobbyResult = {
    createdLobby: LobbyAggregate;
    createdHostPlayer: Player;
    token: string;
};

export class CreateLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly lobbyConfigFactory: LobbyConfigFactory,
        private readonly lobbyFactory: LobbyFactory,
        private readonly playerFactory: PlayerFactory,
        private readonly outboxService: OutboxService,
        private readonly jwtTokenService: JwtTokenService
    ) {}

    /**
     * Creates a new lobby.
     * If gameConfigId is provided, it associates the lobby with that configuration.
     *
     * @param {CreateLobbyDto} dto - The DTO containing hostName and optional gameConfigId
     * @returns {CreateLobbyResult} The created lobby, host player, and JWT token
     */
    execute(dto: CreateLobbyDto): CreateLobbyResult {
        const gameConfigId = dto.gameConfigId
            ? new GameConfigId(dto.gameConfigId)
            : new GameConfigId('default');
        const lobbyConfig = this.lobbyConfigFactory.createFromGameConfigId(gameConfigId);
        const createdHostPlayer = this.playerFactory.create(dto.hostName);

        const createdLobby = this.lobbyFactory.create(lobbyConfig, createdHostPlayer, gameConfigId);

        this.lobbyRepository.save(createdLobby);
        this.outboxService.publishEvents(createdLobby);

        const token = this.jwtTokenService.encode(createdHostPlayer.id, createdLobby.id);

        return { createdLobby, createdHostPlayer, token };
    }
}

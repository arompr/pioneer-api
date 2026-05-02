import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyConfig } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfig';
import { getLobbySetupForGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigSetup';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { CreateLobbyDto } from './dto/CreateLobbyDto';
import { GameConfigId } from '#game/domain/config/GameConfigId';

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
        private readonly jwtTokenService: JwtTokenService
    ) {}

    /**
     * Creates a new lobby with the provided game mode and optional game config ID.
     *
     * The game config ID allows future integration with the game slice for config management.
     * When provided, it associates the lobby with a specific game configuration.
     *
     * @param {CreateLobbyDto} dto - The DTO containing hostName, gameMode, and optional gameConfigId
     * @returns {CreateLobbyResult} The created lobby, host player, and JWT token
     */
    execute(dto: CreateLobbyDto): CreateLobbyResult {
        const { minPlayers, maxPlayers } = getLobbySetupForGameMode(dto.gameMode);
        const lobbyConfig = new LobbyConfig(dto.gameMode, minPlayers, maxPlayers);
        const createdHostPlayer = this.playerFactory.create(dto.hostName);

        const gameConfigId = dto.gameConfigId ? new GameConfigId(dto.gameConfigId) : undefined;
        const createdLobby = this.lobbyFactory.create(lobbyConfig, createdHostPlayer, gameConfigId);

        this.lobbyRepository.save(createdLobby);
        this.outboxService.publishEvents(createdLobby);

        const token = this.jwtTokenService.encode(createdHostPlayer.id, createdLobby.id);

        return { createdLobby, createdHostPlayer, token };
    }
}

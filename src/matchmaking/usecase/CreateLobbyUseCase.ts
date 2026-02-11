import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { CreateLobbyDto } from './dto/CreateLobbyDto';
import { CreateLobbyResultDto } from './dto/CreateLobbyResultDto';

export class CreateLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly lobbyFactory: LobbyFactory,
        private readonly playerFactory: PlayerFactory,
        private readonly lobbyConfigFactory: LobbyConfigFactory
    ) {}

    execute(dto: CreateLobbyDto): CreateLobbyResultDto {
        const lobbyConfig = this.lobbyConfigFactory.createFromGameMode(dto.gameMode);
        const host = this.playerFactory.create(dto.hostName);
        const lobby = this.lobbyFactory.create(lobbyConfig, host);

        this.lobbyRepository.save(lobby);

        return new CreateLobbyResultDto(lobby.id, host.id);
    }
}

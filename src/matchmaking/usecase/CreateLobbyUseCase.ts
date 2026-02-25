import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { CreateLobbyDto } from './dto/CreateLobbyDto';
import { CreatePlayerDto } from './dto/CreatePlayerDto';

export type CreateLobbyResult = {
    createdLobby: LobbyAggregate;
    createdHostPlayer: CreatePlayerDto;
};

export class CreateLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly lobbyFactory: LobbyFactory,
        private readonly playerFactory: PlayerFactory,
        private readonly lobbyConfigFactory: LobbyConfigFactory,
        private readonly outboxService: OutboxService
    ) {}

    execute(dto: CreateLobbyDto): CreateLobbyResult {
        const lobbyConfig = this.lobbyConfigFactory.createFromGameMode(dto.gameMode);
        const { rawToken, player } = this.playerFactory.create(dto.hostName);
        const createdLobby = this.lobbyFactory.create(lobbyConfig, player);

        this.lobbyRepository.save(createdLobby);
        this.outboxService.publishEvents(createdLobby);

        const createdHostPlayer = CreatePlayerDto.of(player, rawToken);
        return { createdLobby, createdHostPlayer };
    }
}

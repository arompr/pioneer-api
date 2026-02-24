import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { CreateLobbyDto } from './dto/CreateLobbyDto';
import { PlayerTokenFactory } from '#matchmaking/domain/player/token/PlayerTokenFactory';
import { RawPlayerToken } from '#matchmaking/domain/player/token/RawPlayerToken';

export type CreateLobbyResult = {
    createdLobby: LobbyAggregate;
    createdHostPlayer: Player;
    rawToken: RawPlayerToken;
};

export class CreateLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly lobbyFactory: LobbyFactory,
        private readonly playerFactory: PlayerFactory,
        private readonly playerTokenFactory: PlayerTokenFactory,
        private readonly lobbyConfigFactory: LobbyConfigFactory,
        private readonly outboxService: OutboxService
    ) {}

    execute(dto: CreateLobbyDto): CreateLobbyResult {
        const lobbyConfig = this.lobbyConfigFactory.createFromGameMode(dto.gameMode);
        const { rawToken, token } = this.playerTokenFactory.generate();
        const createdHostPlayer = this.playerFactory.create(dto.hostName, token);
        const createdLobby = this.lobbyFactory.create(lobbyConfig, createdHostPlayer);

        this.lobbyRepository.save(createdLobby);
        this.outboxService.publishEvents(createdLobby);

        return { createdLobby, createdHostPlayer, rawToken };
    }
}

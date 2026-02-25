import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { CreatePlayerDto } from './dto/CreatePlayerDto';
import { JoinLobbyDto } from './dto/JoinLobbyDto';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';

export type JoinLobbyResult = {
    lobby: LobbyAggregate;
    createdPlayer: CreatePlayerDto;
};

export class JoinLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly playerFactory: PlayerFactory,
        private readonly outboxService: OutboxService
    ) {}

    execute(dto: JoinLobbyDto): JoinLobbyResult {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        const { rawToken, player } = this.playerFactory.create(dto.playerName);
        lobby.join(player);

        this.lobbyRepository.save(lobby);
        this.outboxService.publishEvents(lobby);

        const createdPlayer = CreatePlayerDto.of(player, rawToken);
        return { lobby, createdPlayer };
    }
}

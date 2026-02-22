import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';
import { MarkReadyDto } from './dto/MarkReadyDto';

export class MarkReadyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly outboxService: OutboxService
    ) {}

    execute(dto: MarkReadyDto): LobbyAggregate {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        lobby.markAsReady(dto.playerId);

        this.lobbyRepository.save(lobby);
        this.outboxService.publishEvents(lobby);

        return lobby;
    }
}

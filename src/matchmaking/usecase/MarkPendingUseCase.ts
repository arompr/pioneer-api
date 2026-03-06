import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';
import { MarkPendingDto } from './dto/MarkPendingDto';

export class MarkPendingUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly outboxService: OutboxService
    ) {}

    execute(dto: MarkPendingDto): LobbyAggregate {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        lobby.markAsPending(dto.playerId);

        this.lobbyRepository.save(lobby);
        this.outboxService.publishEvents(lobby);

        return lobby;
    }
}

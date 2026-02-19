import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { LeaveLobbyDto } from './dto/LeaveLobbyDto';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';

export class LeaveLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly outboxService: OutboxService
    ) {}

    execute(dto: LeaveLobbyDto): void {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        lobby.leave(dto.playerId);

        if (lobby.isEmpty()) {
            this.lobbyRepository.delete(lobby.id);
        } else {
            this.lobbyRepository.save(lobby);
        }

        this.outboxService.publishEvents(lobby);
    }
}

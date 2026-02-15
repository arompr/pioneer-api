import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LeaveLobbyDto } from './dto/LeaveLobbyDto';
import LobbyNotFoundError from './errors/LobbyNotFoundError';
import { EventBus } from './EventBus';

export class LeaveLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly eventBus: EventBus
    ) {}

    execute(dto: LeaveLobbyDto): void {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        lobby.leave(dto.playerId);

        lobby.pullDomainEvents().forEach((event) => this.eventBus.publish(event));

        if (!lobby.isEmpty()) {
            this.lobbyRepository.save(lobby);
        }
    }
}

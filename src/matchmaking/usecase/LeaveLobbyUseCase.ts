import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LeaveLobbyDto } from './dto/LeaveLobbyDto';
import LobbyNotFoundError from './errors/LobbyNotFoundError';

export class LeaveLobbyUseCase {
    constructor(private readonly lobbyRepository: LobbyRepository) {}

    execute(dto: LeaveLobbyDto): void {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        lobby.leave(dto.playerId);

        this.lobbyRepository.save(lobby);
    }
}

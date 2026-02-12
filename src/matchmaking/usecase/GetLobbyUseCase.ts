import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { GetLobbyDto } from './dto/GetLobbyDto';
import LobbyNotFoundError from './errors/LobbyNotFoundError';

export class GetLobbyUseCase {
    constructor(private readonly lobbyRepository: LobbyRepository) {}

    execute(dto: GetLobbyDto): LobbyAggregate {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        return lobby;
    }
}

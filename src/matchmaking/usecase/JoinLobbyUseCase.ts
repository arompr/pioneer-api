import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { JoinLobbyDto } from './dto/JoinLobbyDto';
import LobbyNotFoundError from './errors/LobbyNotFoundError';

export type JoinLobbyResult = {
    lobby: LobbyAggregate;
    joinedPlayer: Player;
};

export class JoinLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly playerFactory: PlayerFactory
    ) {}

    execute(dto: JoinLobbyDto): JoinLobbyResult {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        const joinedPlayer = this.playerFactory.create(dto.playerName);
        lobby.join(joinedPlayer);

        this.lobbyRepository.save(lobby);

        return { lobby, joinedPlayer };
    }
}

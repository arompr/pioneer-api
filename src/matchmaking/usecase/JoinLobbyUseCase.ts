import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { JoinLobbyDto } from './dto/JoinLobbyDto';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';

export type JoinLobbyResult = {
    lobby: LobbyAggregate;
    joinedPlayer: Player;
    token: string;
};

export class JoinLobbyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly playerFactory: PlayerFactory,
        private readonly outboxService: OutboxService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly gameGateway: IGameGateway
    ) {}

    async execute(dto: JoinLobbyDto): Promise<JoinLobbyResult> {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        const projectedPlayerCount = lobby.playerCount + 1;
        await this.gameGateway.validatePlayerCount(lobby.gameConfigId.value, projectedPlayerCount);

        const joinedPlayer = this.playerFactory.create(dto.playerName);
        lobby.join(joinedPlayer);

        this.lobbyRepository.save(lobby);
        this.outboxService.publishEvents(lobby);

        const token = this.jwtTokenService.encode(joinedPlayer.id, lobby.id);

        return { lobby, joinedPlayer, token };
    }
}

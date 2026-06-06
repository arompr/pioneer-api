import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';
import { MarkReadyDto } from './dto/MarkReadyDto';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import { LobbyJoinRules } from '#matchmaking/domain/lobby/LobbyRules';

export class MarkReadyUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly outboxService: OutboxService,
        private readonly gameGateway: IGameGateway
    ) {}

    async execute(dto: MarkReadyDto): Promise<LobbyAggregate> {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        const matchmakingGameConfig = await this.gameGateway.getMatchmakingGameConfig(
            new GameConfigId(lobby.gameConfigId.value)
        );

        const startRules = new LobbyJoinRules(
            matchmakingGameConfig.minPlayers,
            matchmakingGameConfig.maxPlayers
        );

        lobby.markAsReady(dto.playerId, startRules);

        this.lobbyRepository.save(lobby);
        this.outboxService.publishEvents(lobby);

        return lobby;
    }
}

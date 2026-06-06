import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { LobbyNotFoundError } from './errors/LobbyNotFoundError';
import { MarkPendingDto } from './dto/MarkPendingDto';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { GameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';

export class MarkPendingUseCase {
    constructor(
        private readonly lobbyRepository: LobbyRepository,
        private readonly outboxService: OutboxService,
        private readonly gameGateway: IGameGateway
    ) {}

    async execute(dto: MarkPendingDto): Promise<LobbyAggregate> {
        const lobby = this.lobbyRepository.findById(dto.lobbyId);
        if (!lobby) {
            throw new LobbyNotFoundError(dto.lobbyId);
        }

        const config = await this.gameGateway.getMatchmakingGameConfig(
            new GameConfigId(lobby.gameConfigId.value)
        );

        lobby.markAsPending(dto.playerId, config);

        this.lobbyRepository.save(lobby);
        this.outboxService.publishEvents(lobby);

        return lobby;
    }
}

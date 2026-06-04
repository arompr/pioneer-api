import { Provider } from '@nestjs/common';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { LobbyIdFactory } from '#matchmaking/domain/lobby/lobbyId/LobbyIdFactory';
import { PlayerIdFactory } from '#common/domain/player/playerId/PlayerIdFactory';
import { OutboxMessageIdFactory } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageIdFactory';
import { OutboxMessageFactory } from '#matchmaking/domain/outbox/OutboxMessageFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { OUTBOX_REPOSITORY, OutboxRepository } from '#matchmaking/domain/outbox/OutboxRepository';
import { LobbyDomainEventSerializer } from '#matchmaking/infrastructure/serializer/LobbyDomainEventSerializer';
import { GAME_GATEWAY, IGameGateway } from '#matchmaking/domain/gateway/GameGateway';

export const factoryProviders: Provider[] = [
    PlayerIdFactory,
    LobbyIdFactory,
    OutboxMessageIdFactory,
    LobbyDomainEventSerializer,
    {
        provide: PlayerFactory,
        useFactory: (playerIdFactory: PlayerIdFactory) => new PlayerFactory(playerIdFactory),
        inject: [PlayerIdFactory],
    },
    {
        provide: LobbyFactory,
        useFactory: (lobbyIdFactory: LobbyIdFactory, gameGateway: IGameGateway) =>
            new LobbyFactory(lobbyIdFactory, gameGateway),
        inject: [LobbyIdFactory, GAME_GATEWAY],
    },
    {
        provide: OutboxMessageFactory,
        useFactory: (outboxMessageIdFactory: OutboxMessageIdFactory) =>
            new OutboxMessageFactory(outboxMessageIdFactory),
        inject: [OutboxMessageIdFactory],
    },
    {
        provide: OutboxService,
        useFactory: (
            outboxRepository: OutboxRepository,
            outboxMessageFactory: OutboxMessageFactory,
            serializer: LobbyDomainEventSerializer
        ) => new OutboxService(outboxRepository, outboxMessageFactory, serializer),
        inject: [OUTBOX_REPOSITORY, OutboxMessageFactory, LobbyDomainEventSerializer],
    },
];

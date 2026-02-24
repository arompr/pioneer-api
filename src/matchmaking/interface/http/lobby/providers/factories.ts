import { Provider } from '@nestjs/common';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { LobbyIdFactory } from '#matchmaking/domain/lobby/lobbyId/LobbyIdFactory';
import { PlayerIdFactory } from '#common/domain/player/playerId/PlayerIdFactory';
import { PlayerTokenFactory } from '#matchmaking/domain/player/token/PlayerTokenFactory';
import { HASHING_SERVICE } from '#matchmaking/domain/player/token/HashingService';
import { OutboxMessageIdFactory } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageIdFactory';
import { OutboxMessageFactory } from '#matchmaking/domain/outbox/OutboxMessageFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { OUTBOX_REPOSITORY, OutboxRepository } from '#matchmaking/domain/outbox/OutboxRepository';
import type { HashingService } from '#matchmaking/domain/player/token/HashingService';

export const factoryProviders: Provider[] = [
    LobbyConfigFactory,
    PlayerIdFactory,
    LobbyIdFactory,
    OutboxMessageIdFactory,
    {
        provide: PlayerTokenFactory,
        useFactory: (hashingService: HashingService) => new PlayerTokenFactory(hashingService),
        inject: [HASHING_SERVICE],
    },
    {
        provide: PlayerFactory,
        useFactory: (playerIdFactory: PlayerIdFactory, playerTokenFactory: PlayerTokenFactory) =>
            new PlayerFactory(playerIdFactory, playerTokenFactory),
        inject: [PlayerIdFactory, PlayerTokenFactory],
    },
    {
        provide: LobbyFactory,
        useFactory: (lobbyIdFactory: LobbyIdFactory) => new LobbyFactory(lobbyIdFactory),
        inject: [LobbyIdFactory],
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
            outboxMessageFactory: OutboxMessageFactory
        ) => new OutboxService(outboxRepository, outboxMessageFactory),
        inject: [OUTBOX_REPOSITORY, OutboxMessageFactory],
    },
];

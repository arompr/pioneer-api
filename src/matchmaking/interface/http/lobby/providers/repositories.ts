import { Provider } from '@nestjs/common';
import { InMemoryLobbyRepository } from '#matchmaking/infrastructure/db/inMemory/lobby/InMemoryLobbyRepository';
import { LOBBY_REPOSITORY } from '#matchmaking/domain/lobby/LobbyRepository';
import { InMemoryOutboxRepository } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { OUTBOX_REPOSITORY } from '#matchmaking/domain/outbox/OutboxRepository';
import { HASHING_SERVICE } from '#matchmaking/domain/player/token/HashingService';
import { InMemoryHashingServiceImpl } from '#matchmaking/infrastructure/crypto/InMemoryHashingServiceImpl';

export const repositoryProviders: Provider[] = [
    {
        provide: LOBBY_REPOSITORY,
        useClass: InMemoryLobbyRepository,
    },
    {
        provide: OUTBOX_REPOSITORY,
        useClass: InMemoryOutboxRepository,
    },
    {
        provide: HASHING_SERVICE,
        useClass: InMemoryHashingServiceImpl,
    },
];

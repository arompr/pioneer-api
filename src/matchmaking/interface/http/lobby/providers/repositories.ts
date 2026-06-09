import { Provider } from '@nestjs/common';
import { InMemoryLobbyRepository } from '#matchmaking/infrastructure/db/inMemory/lobby/InMemoryLobbyRepository';
import { LOBBY_REPOSITORY } from '#matchmaking/domain/lobby/LobbyRepository';
import { InMemoryOutboxRepository } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { OUTBOX_REPOSITORY } from '#matchmaking/domain/outbox/OutboxRepository';
import { GAME_CONFIG_REPOSITORY } from '#game/domain/config/GameConfigRepository';
import { InMemoryGameConfigRepository } from '#game/infrastructure/db/inMemory/InMemoryGameConfigRepository';

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
        provide: GAME_CONFIG_REPOSITORY,
        useClass: InMemoryGameConfigRepository,
    },
];

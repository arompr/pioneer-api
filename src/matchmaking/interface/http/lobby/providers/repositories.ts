import { Provider } from '@nestjs/common';
import { InMemoryLobbyRepository } from '#matchmaking/infastructure/db/inMemory/lobby/InMemoryLobbyRepository';
import { LOBBY_REPOSITORY } from '#matchmaking/domain/lobby/LobbyRepository';

export const repositoryProviders: Provider[] = [
    {
        provide: LOBBY_REPOSITORY,
        useClass: InMemoryLobbyRepository,
    },
];

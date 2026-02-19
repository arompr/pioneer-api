import { Provider } from '@nestjs/common';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { LOBBY_REPOSITORY, LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';

export const useCaseProviders: Provider[] = [
    {
        provide: GetLobbyUseCase,
        useFactory: (lobbyRepository: LobbyRepository): GetLobbyUseCase => {
            return new GetLobbyUseCase(lobbyRepository);
        },
        inject: [LOBBY_REPOSITORY],
    },

    {
        provide: CreateLobbyUseCase,
        useFactory: (
            lobbyRepository: LobbyRepository,
            lobbyFactory: LobbyFactory,
            playerFactory: PlayerFactory,
            lobbyConfigFactory: LobbyConfigFactory,
            outboxService: OutboxService
        ) =>
            new CreateLobbyUseCase(
                lobbyRepository,
                lobbyFactory,
                playerFactory,
                lobbyConfigFactory,
                outboxService
            ),
        inject: [LOBBY_REPOSITORY, LobbyFactory, PlayerFactory, LobbyConfigFactory, OutboxService],
    },

    {
        provide: JoinLobbyUseCase,
        useFactory: (
            lobbyRepository: LobbyRepository,
            playerFactory: PlayerFactory,
            outboxService: OutboxService
        ) => new JoinLobbyUseCase(lobbyRepository, playerFactory, outboxService),
        inject: [LOBBY_REPOSITORY, PlayerFactory, OutboxService],
    },
    {
        provide: LeaveLobbyUseCase,
        useFactory: (lobbyRepository: LobbyRepository, outboxService: OutboxService) =>
            new LeaveLobbyUseCase(lobbyRepository, outboxService),
        inject: [LOBBY_REPOSITORY, OutboxService],
    },
];

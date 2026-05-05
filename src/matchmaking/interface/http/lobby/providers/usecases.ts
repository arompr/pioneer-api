import { Provider } from '@nestjs/common';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { LOBBY_REPOSITORY, LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { JWT_TOKEN_SERVICE, JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';

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
            outboxService: OutboxService,
            jwtTokenService: JwtTokenService
        ) =>
            new CreateLobbyUseCase(
                lobbyRepository,
                lobbyFactory,
                playerFactory,
                outboxService,
                jwtTokenService
            ),
        inject: [LOBBY_REPOSITORY, LobbyFactory, PlayerFactory, OutboxService, JWT_TOKEN_SERVICE],
    },

    {
        provide: JoinLobbyUseCase,
        useFactory: (
            lobbyRepository: LobbyRepository,
            playerFactory: PlayerFactory,
            outboxService: OutboxService,
            jwtTokenService: JwtTokenService
        ) => new JoinLobbyUseCase(lobbyRepository, playerFactory, outboxService, jwtTokenService),
        inject: [LOBBY_REPOSITORY, PlayerFactory, OutboxService, JWT_TOKEN_SERVICE],
    },
    {
        provide: LeaveLobbyUseCase,
        useFactory: (lobbyRepository: LobbyRepository, outboxService: OutboxService) =>
            new LeaveLobbyUseCase(lobbyRepository, outboxService),
        inject: [LOBBY_REPOSITORY, OutboxService],
    },
    {
        provide: MarkReadyUseCase,
        useFactory: (lobbyRepository: LobbyRepository, outboxService: OutboxService) =>
            new MarkReadyUseCase(lobbyRepository, outboxService),
        inject: [LOBBY_REPOSITORY, OutboxService],
    },
    {
        provide: MarkPendingUseCase,
        useFactory: (lobbyRepository: LobbyRepository, outboxService: OutboxService) =>
            new MarkPendingUseCase(lobbyRepository, outboxService),
        inject: [LOBBY_REPOSITORY, OutboxService],
    },
];

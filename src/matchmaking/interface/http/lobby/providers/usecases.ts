import { Provider } from '@nestjs/common';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { LOBBY_REPOSITORY, LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { JWT_TOKEN_SERVICE, JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';
import { GAME_GATEWAY, IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import {
    GAME_CONFIG_REPOSITORY,
    GameConfigRepository,
} from '#game/domain/config/GameConfigRepository';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';

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
        inject: [
            LOBBY_REPOSITORY,
            LobbyFactory,
            PlayerFactory,
            OutboxService,
            JWT_TOKEN_SERVICE,
            GAME_GATEWAY,
        ],
    },

    {
        provide: JoinLobbyUseCase,
        useFactory: (
            lobbyRepository: LobbyRepository,
            playerFactory: PlayerFactory,
            outboxService: OutboxService,
            jwtTokenService: JwtTokenService,
            gameGateway: IGameGateway
        ) =>
            new JoinLobbyUseCase(
                lobbyRepository,
                playerFactory,
                outboxService,
                jwtTokenService,
                gameGateway
            ),
        inject: [LOBBY_REPOSITORY, PlayerFactory, OutboxService, JWT_TOKEN_SERVICE, GAME_GATEWAY],
    },
    {
        provide: LeaveLobbyUseCase,
        useFactory: (lobbyRepository: LobbyRepository, outboxService: OutboxService) =>
            new LeaveLobbyUseCase(lobbyRepository, outboxService),
        inject: [LOBBY_REPOSITORY, OutboxService],
    },
    {
        provide: MarkReadyUseCase,
        useFactory: (
            lobbyRepository: LobbyRepository,
            outboxService: OutboxService,
            gameGateway: IGameGateway
        ) => new MarkReadyUseCase(lobbyRepository, outboxService, gameGateway),
        inject: [LOBBY_REPOSITORY, OutboxService, GAME_GATEWAY],
    },
    {
        provide: MarkPendingUseCase,
        useFactory: (
            lobbyRepository: LobbyRepository,
            outboxService: OutboxService,
            gameGateway: IGameGateway
        ) => new MarkPendingUseCase(lobbyRepository, outboxService, gameGateway),
        inject: [LOBBY_REPOSITORY, OutboxService, GAME_GATEWAY],
    },
    {
        provide: CreateGameConfigUseCase,
        useFactory: (
            gameConfigFactory: GameConfigFactory,
            gameConfigRepository: GameConfigRepository
        ) => new CreateGameConfigUseCase(gameConfigFactory, gameConfigRepository),
        inject: [GameConfigFactory, GAME_CONFIG_REPOSITORY],
    },
    {
        provide: GetGameConfigUseCase,
        useFactory: (gameConfigRepository: GameConfigRepository) =>
            new GetGameConfigUseCase(gameConfigRepository),
        inject: [GAME_CONFIG_REPOSITORY],
    },
];

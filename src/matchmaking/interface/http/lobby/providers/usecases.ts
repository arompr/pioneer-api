import { Provider } from '@nestjs/common';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { LOBBY_REPOSITORY, LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { EventBus } from '#matchmaking/usecase/EventBus';
import { EVENT_BUS } from './eventBus';

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
            lobbyConfigFactory: LobbyConfigFactory
        ) =>
            new CreateLobbyUseCase(
                lobbyRepository,
                lobbyFactory,
                playerFactory,
                lobbyConfigFactory
            ),
        inject: [LOBBY_REPOSITORY, LobbyFactory, PlayerFactory, LobbyConfigFactory],
    },

    {
        provide: JoinLobbyUseCase,
        useFactory: (lobbyRepository: LobbyRepository, playerFactory: PlayerFactory) =>
            new JoinLobbyUseCase(lobbyRepository, playerFactory),
        inject: [LOBBY_REPOSITORY, PlayerFactory],
    },
    {
        provide: LeaveLobbyUseCase,
        useFactory: (lobbyRepository: LobbyRepository, eventBus: EventBus) =>
            new LeaveLobbyUseCase(lobbyRepository, eventBus),
        inject: [LOBBY_REPOSITORY, EVENT_BUS],
    },
];

import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { InMemoryLobbyRepository } from '#matchmaking/infastructure/db/inMemory/lobby/InMemoryLobbyRepository';
import { LOBBY_REPOSITORY, LobbyRepository } from '#matchmaking/domain/lobby/LobbyRepository';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { PlayerIdFactory } from '#matchmaking/domain/player/playerId/PlayerIdFactory';
import { LobbyIdFactory } from '#matchmaking/domain/lobby/lobbyId/LobbyIdFactory';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';

@Module({
    controllers: [LobbyController],
    providers: [
        LobbyConfigFactory,
        {
            provide: LOBBY_REPOSITORY,
            useClass: InMemoryLobbyRepository,
        },

        // PlayerIdFactory
        PlayerIdFactory,
        LobbyIdFactory,

        // PlayerFactory
        {
            provide: PlayerFactory,
            useFactory: (playerIdFactory: PlayerIdFactory) => new PlayerFactory(playerIdFactory),
            inject: [PlayerIdFactory],
        },
        {
            provide: LobbyFactory,
            useFactory: (lobbyIdFactory: LobbyIdFactory) => new LobbyFactory(lobbyIdFactory),
            inject: [LobbyIdFactory],
        },

        {
            provide: GetLobbyUseCase,
            useFactory: (lobbyRepository: LobbyRepository) => {
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
            useFactory: (lobbyRepository: LobbyRepository) =>
                new LeaveLobbyUseCase(lobbyRepository),
            inject: [LOBBY_REPOSITORY],
        },
    ],
})
export class LobbyModule {}

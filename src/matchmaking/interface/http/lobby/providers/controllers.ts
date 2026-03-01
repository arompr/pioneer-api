import { Provider } from '@nestjs/common';
import { LobbyController } from '../lobby.controller';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';

export const controllerProviders: Provider[] = [
    {
        provide: LobbyController,
        useFactory: (
            createLobby: CreateLobbyUseCase,
            getLobby: GetLobbyUseCase,
            joinLobby: JoinLobbyUseCase,
            leaveLobby: LeaveLobbyUseCase
        ) => new LobbyController(createLobby, getLobby, joinLobby, leaveLobby),
        inject: [CreateLobbyUseCase, GetLobbyUseCase, JoinLobbyUseCase, LeaveLobbyUseCase],
    },
];

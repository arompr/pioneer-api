import { Provider } from '@nestjs/common';
import { LobbyController } from '../lobby.controller';
import { CreateLobbyUseCase } from '#matchmaking/usecase/CreateLobbyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JoinLobbyUseCase } from '#matchmaking/usecase/JoinLobbyUseCase';
import { LeaveLobbyUseCase } from '#matchmaking/usecase/LeaveLobbyUseCase';
import { JWT_TOKEN_SERVICE, JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';

export const controllerProviders: Provider[] = [
    {
        provide: LobbyController,
        useFactory: (
            createLobby: CreateLobbyUseCase,
            getLobby: GetLobbyUseCase,
            joinLobby: JoinLobbyUseCase,
            leaveLobby: LeaveLobbyUseCase,
            jwtTokenService: JwtTokenService
        ) => new LobbyController(createLobby, getLobby, joinLobby, leaveLobby, jwtTokenService),
        inject: [
            CreateLobbyUseCase,
            GetLobbyUseCase,
            JoinLobbyUseCase,
            LeaveLobbyUseCase,
            JWT_TOKEN_SERVICE,
        ],
    },
];

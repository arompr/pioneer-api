import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LobbyModule } from '#matchmaking/interface/http/lobby/lobby.module';
import { LobbyGateway } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { WsCommandDispatcher } from '#matchmaking/interface/ws/command/WsCommandDispatcher';
import { registerWsHandlers } from '#bootstrap/wsCommandhandlers';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { JWT_TOKEN_SERVICE, type JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';

@Module({
    imports: [LobbyModule],
    controllers: [AppController],
    providers: [
        AppService,
        LobbyGateway,
        {
            provide: WsCommandDispatcher,
            useFactory: (
                markReadyUseCase: MarkReadyUseCase,
                getLobbyUseCase: GetLobbyUseCase,
                jwtTokenService: JwtTokenService
            ) => {
                const dispatcher = new WsCommandDispatcher();
                registerWsHandlers(dispatcher, markReadyUseCase, getLobbyUseCase, jwtTokenService);

                return dispatcher;
            },
            inject: [MarkReadyUseCase, GetLobbyUseCase, JWT_TOKEN_SERVICE],
        },
    ],
})
export class AppModule {}

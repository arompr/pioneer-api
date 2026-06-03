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
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';
import { processorProviders } from '#matchmaking/interface/http/lobby/providers/processors';
import { eventBusProviders } from '#matchmaking/interface/http/lobby/providers/eventBus';
import { deserializerProviders } from '#matchmaking/interface/http/lobby/providers/deserializer';

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
                markPendingUseCase: MarkPendingUseCase,
                getLobbyUseCase: GetLobbyUseCase,
                jwtTokenService: JwtTokenService
            ) => {
                const dispatcher = new WsCommandDispatcher();
                registerWsHandlers(
                    dispatcher,
                    markReadyUseCase,
                    markPendingUseCase,
                    getLobbyUseCase,
                    jwtTokenService
                );

                return dispatcher;
            },
            inject: [MarkReadyUseCase, MarkPendingUseCase, GetLobbyUseCase, JWT_TOKEN_SERVICE],
        },
        ...processorProviders,
        ...eventBusProviders,
        ...deserializerProviders,
    ],
})
export class AppModule {}

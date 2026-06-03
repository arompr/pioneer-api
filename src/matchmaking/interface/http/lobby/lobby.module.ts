import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { LobbyController } from './lobby.controller';
import { lobbyProviders } from './providers';
import { GAME_GATEWAY } from '#matchmaking/domain/gateway/GameGateway';
import { GameGatewayImpl } from '#matchmaking/infrastructure/gateway/GameGatewayImpl';

@Module({
    imports: [
        JwtModule.register({
            secret: 'pioneer-secret',
        }),
        HttpModule,
    ],
    controllers: [LobbyController],
    providers: [
        ...lobbyProviders,
        {
            provide: GAME_GATEWAY,
            useClass: GameGatewayImpl,
        },
    ],
    exports: [...lobbyProviders],
})
export class LobbyModule {}

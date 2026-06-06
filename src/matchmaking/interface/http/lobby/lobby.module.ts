import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { LobbyController } from './lobby.controller';
import { lobbyProviders } from './providers';

@Module({
    imports: [
        JwtModule.register({
            secret: 'pioneer-secret',
        }),
        HttpModule,
    ],
    controllers: [LobbyController],
    providers: [...lobbyProviders],
    exports: [...lobbyProviders],
})
export class LobbyModule {}

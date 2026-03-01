import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LobbyController } from './lobby.controller';
import { lobbyProviders } from './providers';

@Module({
    imports: [
        JwtModule.register({
            secret: 'pioneer-secret',
        }),
    ],
    controllers: [LobbyController],
    providers: lobbyProviders,
    exports: [...lobbyProviders],
})
export class LobbyModule {}

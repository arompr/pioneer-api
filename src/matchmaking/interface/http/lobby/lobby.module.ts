import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { lobbyProviders } from './providers';

@Module({
    imports: [
        JwtModule.register({
            secret: 'pioneer-secret',
        }),
    ],
    controllers: [],
    providers: lobbyProviders,
    exports: [...lobbyProviders],
})
export class LobbyModule {}

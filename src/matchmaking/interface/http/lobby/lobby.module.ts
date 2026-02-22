import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { lobbyProviders } from './providers';

@Module({
    controllers: [LobbyController],
    providers: lobbyProviders,
    exports: [...lobbyProviders],
})
export class LobbyModule {}

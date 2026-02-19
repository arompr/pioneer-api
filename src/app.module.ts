import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LobbyModule } from '#matchmaking/interface/http/lobby/lobby.module';
import { LobbyGateway } from '#matchmaking/interface/http/ws/LobbyGatewayWs';

@Module({
    imports: [LobbyModule],
    controllers: [AppController],
    providers: [AppService, LobbyGateway],
})
export class AppModule {}

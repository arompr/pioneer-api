import { Module } from '@nestjs/common';
import { GameConfigController } from './GameConfigController';
import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { GAME_CONFIG_REPOSITORY } from '#game/domain/config/GameConfigRepository';
import { InMemoryGameConfigRepository } from '#game/infrastructure/db/inMemory/InMemoryGameConfigRepository';

@Module({
    controllers: [GameConfigController],
    providers: [
        GameConfigFactory,
        CreateGameConfigUseCase,
        GetGameConfigUseCase,
        {
            provide: GAME_CONFIG_REPOSITORY,
            useClass: InMemoryGameConfigRepository,
        },
    ],
    exports: [CreateGameConfigUseCase, GetGameConfigUseCase, GameConfigFactory],
})
export class GameConfigModule {}

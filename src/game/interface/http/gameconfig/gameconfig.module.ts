import { Module } from '@nestjs/common';
import { GameConfigController } from './GameConfigController';
import { CreateDefaultGameConfigUseCase } from '#game/usecase/CreateDefaultGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { GAME_CONFIG_REPOSITORY } from '#game/domain/config/GameConfigRepository';
import { InMemoryGameConfigRepository } from '#game/infrastructure/db/inMemory/InMemoryGameConfigRepository';

@Module({
    controllers: [GameConfigController],
    providers: [
        GameConfigFactory,
        CreateDefaultGameConfigUseCase,
        GetGameConfigUseCase,
        {
            provide: GAME_CONFIG_REPOSITORY,
            useClass: InMemoryGameConfigRepository,
        },
    ],
    exports: [CreateDefaultGameConfigUseCase, GetGameConfigUseCase, GameConfigFactory],
})
export class GameConfigModule {}

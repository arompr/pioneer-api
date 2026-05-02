import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { gameModeFromString } from '#game/domain/config/GameMode';
import { CreateDefaultGameConfigDto } from './dto/CreateDefaultGameConfigDto';

export type CreateDefaultGameConfigResult = {
    createdConfig: GameConfig;
};

export class CreateDefaultGameConfigUseCase {
    constructor(
        private readonly gameConfigFactory: GameConfigFactory,
        private readonly gameConfigRepository: GameConfigRepository
    ) {}

    execute(dto: CreateDefaultGameConfigDto): CreateDefaultGameConfigResult {
        const gameMode = gameModeFromString(dto.gameMode);
        const createdConfig = this.gameConfigFactory.createFromGameMode(gameMode);
        this.gameConfigRepository.save(createdConfig);

        return { createdConfig };
    }
}

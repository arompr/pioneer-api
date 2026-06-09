import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigFactory } from '#game/domain/config/GameConfigFactory';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { gameModeFromString } from '#game/domain/config/GameMode';
import { CreateGameConfigDto as CreateGameConfigDto } from './dto/CreateGameConfigDto';

export type CreateGameConfigResult = {
    createdConfig: GameConfig;
};

export class CreateGameConfigUseCase {
    constructor(
        private readonly gameConfigFactory: GameConfigFactory,
        private readonly gameConfigRepository: GameConfigRepository
    ) {}

    execute(dto: CreateGameConfigDto): CreateGameConfigResult {
        const gameMode = gameModeFromString(dto.gameMode);
        const createdConfig = this.gameConfigFactory.createFromGameMode(gameMode);
        this.gameConfigRepository.save(createdConfig);

        return { createdConfig };
    }
}

import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { GameConfigNotFoundError } from '#game/domain/config/errors/GameConfigNotFoundError';

export type GetGameConfigResult = {
    foundConfig: GameConfig;
};

export class GetGameConfigUseCase {
    constructor(private readonly gameConfigRepository: GameConfigRepository) {}

    execute(gameConfigId: GameConfigId): GetGameConfigResult {
        const foundConfig = this.gameConfigRepository.findById(gameConfigId);

        if (!foundConfig) {
            throw new GameConfigNotFoundError(gameConfigId);
        }

        return { foundConfig };
    }
}

import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { GameConfigNotFoundError } from '#game/domain/config/errors/GameConfigNotFoundError';

export type GetGameConfigResult = {
    config: GameConfig;
};

export class GetGameConfigUseCase {
    constructor(private readonly gameConfigRepository: GameConfigRepository) {}

    execute(gameConfigId: GameConfigId): GetGameConfigResult {
        const config = this.gameConfigRepository.findById(gameConfigId);

        if (!config) {
            throw new GameConfigNotFoundError(gameConfigId);
        }

        return { config };
    }
}

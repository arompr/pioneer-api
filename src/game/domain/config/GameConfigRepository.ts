import { GameConfig } from './GameConfig';
import { GameConfigId } from './GameConfigId';

export const GAME_CONFIG_REPOSITORY = Symbol('GameConfigRepository');

export interface GameConfigRepository {
    findById(id: GameConfigId): GameConfig | null;
    save(config: GameConfig): void;
    delete(id: GameConfigId): void;
}

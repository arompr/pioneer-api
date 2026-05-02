import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';

export class InMemoryGameConfigRepository implements GameConfigRepository {
    private configs = new Map<string, GameConfig>();

    findById(id: GameConfigId): GameConfig | null {
        const config = this.configs.get(id.value);
        return config || null;
    }

    save(config: GameConfig): void {
        this.configs.set(config.gameConfigId.value, config);
    }

    delete(id: GameConfigId): void {
        this.configs.delete(id.value);
    }
}

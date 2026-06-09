import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { GameConfigRepository } from '#game/domain/config/GameConfigRepository';
import { InMemoryGameConfig } from './InMemoryGameConfig';
import { toGameConfig, toInMemory } from './InMemoryGameConfigMapper';

export class InMemoryGameConfigRepository implements GameConfigRepository {
    private configs = new Map<string, InMemoryGameConfig>();

    findById(id: GameConfigId): GameConfig | null {
        const config = this.configs.get(id.value);
        if (!config) return null;
        return toGameConfig(config);
    }

    save(config: GameConfig): void {
        this.configs.set(config.id.value, toInMemory(config));
    }

    delete(id: GameConfigId): void {
        this.configs.delete(id.value);
    }
}

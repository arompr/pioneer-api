import { DomainError } from '#common/domain/DomainError';
import type { GameConfigId } from '../GameConfigId';

export class GameConfigNotFoundError extends DomainError {
    public readonly gameConfigId: GameConfigId;

    constructor(gameConfigId: GameConfigId) {
        super(`GameConfig with id "${gameConfigId.value}" not found`);
        this.gameConfigId = gameConfigId;
    }
}

import { DomainError } from '@/common/domain/DomainError.ts';

export class InvalidMinPlayersError extends DomainError {
    public readonly min: number;

    constructor(min: number) {
        super(`Minimum players must be at least 1 (given: ${min})`);
        this.min = min;
    }
}

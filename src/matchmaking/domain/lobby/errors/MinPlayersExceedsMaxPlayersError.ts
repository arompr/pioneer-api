import DomainError from '#common/domain/DomainError';

export default class MinPlayersExceedsMaxPlayersError extends DomainError {
    public readonly min: number;
    public readonly max: number;

    constructor(min: number, max: number) {
        super(`Minimum players (${min}) cannot be greater than maximum players (${max})`);
        this.min = min;
        this.max = max;
    }
}

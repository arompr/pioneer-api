import DomainError from '#common/domain/DomainError';

export default class NegativeDistanceError extends DomainError {
    public readonly hexes: number;

    constructor(hexes: number) {
        super(`Distance cannot be negative: ${hexes}`);
        this.hexes = hexes;
    }
}

import { DomainError } from '#common/domain/DomainError.ts';

export class NegativeDistanceError extends DomainError {
    public readonly hexes: number;

    constructor(hexes: number) {
        super(`Distance cannot be negative: ${hexes}`);
        this.hexes = hexes;
    }
}

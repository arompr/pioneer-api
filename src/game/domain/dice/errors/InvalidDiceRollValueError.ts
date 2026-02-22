import { DomainError } from '#common/domain/DomainError';

/**
 * Error thrown when a dice roll value is invalid.
 */
export class InvalidDiceRollValueError extends DomainError {
    public readonly index: number;
    public readonly value: number;

    constructor(index: number, value: number) {
        super(`Dice roll at index ${index} is invalid: ${value}`);
        this.index = index;
        this.value = value;
    }
}

import { DomainError } from '#common/domain/DomainError';

/**
 * Error thrown when attempting to create a DiceRoll with an empty rolls array.
 */
export class EmptyDiceRollError extends DomainError {
    constructor() {
        super('DiceRoll rolls array must not be empty');
    }
}

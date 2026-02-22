import { DomainError } from '#common/domain/DomainError';

/**
 * Error thrown when attempting to create a Dices collection with no dice.
 */
export class EmptyDiceSetError extends DomainError {
    constructor() {
        super(`Dices must contain at least one dice`);
    }
}

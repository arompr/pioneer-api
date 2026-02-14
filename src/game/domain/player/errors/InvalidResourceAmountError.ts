import { DomainError } from '#common/domain/DomainError';

/**
 * Error thrown when an invalid resource amount is provided.
 */
export class InvalidResourceAmountError extends DomainError {
    public readonly amount: number;

    constructor(amount: number) {
        super(`Resource amount must be non-negative (given: ${amount})`);
        this.amount = amount;
    }
}

import { DomainError } from '#common/domain/DomainError';

/**
 * Error thrown when an invalid resource quantity is provided.
 */
export class InvalidResourceQuantityError extends DomainError {
    public readonly quantity: number;

    constructor(quantity: number) {
        super(`Resource quantity must be non-negative (given: ${quantity})`);
        this.quantity = quantity;
    }
}

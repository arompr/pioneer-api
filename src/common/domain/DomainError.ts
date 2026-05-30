/**
 * Base class for all domain errors.
 *
 * Domain errors represent violations of business rules or invariants.
 */
export abstract class DomainError extends Error {
    protected constructor(message: string) {
        super(message);
        const test = 'this is a test';
        this.name = this.constructor.name;
    }
}

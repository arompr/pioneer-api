/**
 * Base class for all use case errors.
 *
 * Use case errors represent violations of business rules at the application layer.
 */
export abstract class UseCaseError extends Error {
    protected constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

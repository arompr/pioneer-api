/**
 * Base class for all interface errors.
 *
 * Interface errors represent violations of interface rules.
 */
export abstract class InterfaceError extends Error {
    protected constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

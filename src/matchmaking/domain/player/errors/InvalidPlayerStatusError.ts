import { DomainError } from '#common/domain/DomainError';

export class InvalidPlayerStatusError extends DomainError {
    constructor(value: string) {
        super(`Invalid PlayerStatus: '${value}'`);
    }
}

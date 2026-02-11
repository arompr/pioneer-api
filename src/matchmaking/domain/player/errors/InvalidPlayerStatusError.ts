import { DomainError } from '#common/domain/DomainError';

export class InvalidPlayerStatusError extends DomainError {
    public readonly value: string;

    constructor(value: string) {
        super(`Invalid PlayerStatus: '${value}'`);
        this.value = value;
    }
}

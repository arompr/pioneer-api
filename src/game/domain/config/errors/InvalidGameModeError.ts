import { DomainError } from '#common/domain/DomainError';

export class InvalidGameModeError extends DomainError {
    public readonly value: string;

    constructor(value: string) {
        super(`Invalid GameMode: '${value}'`);
        this.value = value;
    }
}

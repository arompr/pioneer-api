import { DomainError } from '#common/domain/DomainError';

/**
 * Thrown when a presented player token fails verification.
 */
export class InvalidPlayerTokenError extends DomainError {
    public readonly playerToken: string;

    constructor(playerToken: string) {
        super(`Invalid player token: '${playerToken}'`);
        this.playerToken = playerToken;
    }
}

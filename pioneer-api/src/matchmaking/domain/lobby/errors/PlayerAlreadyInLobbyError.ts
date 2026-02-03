import { DomainError } from '#common/domain/DomainError';

export class PlayerAlreadyInLobbyError extends DomainError {
    constructor() {
        super(`Player is already in the lobby`);
    }
}

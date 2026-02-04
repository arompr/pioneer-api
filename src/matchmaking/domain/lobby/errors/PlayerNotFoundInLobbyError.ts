import { DomainError } from '#common/domain/DomainError';

export class PlayerNotFoundInLobbyError extends DomainError {
    constructor() {
        super(`Player was not found in the lobby`);
    }
}

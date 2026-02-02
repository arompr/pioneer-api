import { DomainError } from '#common/domain/DomainError.ts';

export class PlayerNotFoundInLobbyError extends DomainError {
    constructor() {
        super(`Player was not found in the lobby`);
    }
}

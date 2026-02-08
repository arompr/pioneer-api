import DomainError from '#common/domain/DomainError';

export default class PlayerNotFoundInLobbyError extends DomainError {
    constructor() {
        super(`Player was not found in the lobby`);
    }
}

import DomainError from '#common/domain/DomainError';

export default class PlayerAlreadyInLobbyError extends DomainError {
    constructor() {
        super(`Player is already in the lobby`);
    }
}

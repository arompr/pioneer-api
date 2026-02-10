import { DomainError } from '#common/domain/DomainError';

export class InvalidLobbyStateError extends DomainError {
    constructor(value: string) {
        super(`Invalid LobbyStateType: '${value}'`);
    }
}

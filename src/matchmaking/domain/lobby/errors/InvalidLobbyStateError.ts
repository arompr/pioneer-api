import { DomainError } from '#common/domain/DomainError';

export class InvalidLobbyStateError extends DomainError {
    public readonly stateType: string;

    constructor(value: string) {
        super(`Invalid LobbyStateType: '${value}'`);
        this.stateType = value;
    }
}

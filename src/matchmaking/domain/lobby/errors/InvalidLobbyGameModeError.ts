import { DomainError } from '#common/domain/DomainError';

export class InvalidLobbyGameModeError extends DomainError {
    public readonly value: string;

    constructor(value: string) {
        super(`Invalid LobbyGameMode: '${value}'`);
        this.value = value;
    }
}

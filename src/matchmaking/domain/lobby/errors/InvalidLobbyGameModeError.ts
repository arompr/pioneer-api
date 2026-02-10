import { DomainError } from '#common/domain/DomainError';

export class InvalidLobbyGameModeError extends DomainError {
    constructor(value: string) {
        super(`Invalid LobbyGameMode: '${value}'`);
    }
}

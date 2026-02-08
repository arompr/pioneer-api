import DomainError from '#common/domain/DomainError';

export default class UnsupportedGameModeError extends DomainError {
    public readonly mode: string;

    constructor(mode: string) {
        super(`The game mode "${mode}" is not supported`);
        this.mode = mode;
    }
}

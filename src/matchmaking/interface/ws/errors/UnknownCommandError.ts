import { InterfaceError } from '#common/interface/errors/InterfaceError';

export class UnknownCommandError extends InterfaceError {
    public readonly value: string;

    constructor(value: string) {
        super(`Unknown command: '${value}'`);
        this.value = value;
    }
}

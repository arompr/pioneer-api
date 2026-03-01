import { WsError } from './WsError';

export class UnknownCommandError extends WsError {
    public readonly value: string;

    constructor(value: string) {
        super(`Unknown command: '${value}'`);
        this.value = value;
    }
}

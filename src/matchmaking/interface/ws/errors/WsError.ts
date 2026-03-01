import { InterfaceError } from '#common/interface/errors/InterfaceError';

export abstract class WsError extends InterfaceError {
    constructor(
        message: string,
        public readonly shouldDisconnect: boolean = false
    ) {
        super(message);
    }
}

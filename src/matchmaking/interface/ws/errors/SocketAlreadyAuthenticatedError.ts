import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { WsError } from './WsError';

export class SocketAlreadyAuthenticatedError extends WsError {
    public readonly playerId?: PlayerId;

    constructor(playerId?: PlayerId) {
        super(`Socket already authenticated`, true);

        this.playerId = playerId;
    }
}

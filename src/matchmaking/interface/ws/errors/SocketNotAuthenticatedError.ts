import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { WsLobbyCommandType } from '../command/WsLobbyCommandType';
import { WsError } from './WsError';

export class SocketNotAuthenticatedError extends WsError {
    public readonly playerId?: PlayerId;

    constructor(playerId?: PlayerId) {
        super(
            `Connection not authenticated. Please use the '${WsLobbyCommandType.SYNC_PLAYER}' command to authenticate.`
        );

        this.playerId = playerId;
    }
}

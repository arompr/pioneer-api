import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsLobbyCommandType } from './WsLobbyCommandType';

export type SyncPlayerCommandPayload = {
    secretKey: string;
    lobbyId: string;
};

export class SyncPlayerCommand implements WsCommand {
    readonly type = WsLobbyCommandType.SYNC_PLAYER;

    constructor(public readonly payload: SyncPlayerCommandPayload) {
        this.payload = payload;
    }
}

import { WsCommand } from './WsCommand';
import { WsCommandType } from './WsCommandType';

export type SyncPlayerCommandPayload = {
    secretKey: string;
    lobbyId: string;
};

export class SyncPlayerCommand implements WsCommand {
    readonly type = WsCommandType.SYNC_PLAYER;

    constructor(public readonly payload: SyncPlayerCommandPayload) {
        this.payload = payload;
    }
}

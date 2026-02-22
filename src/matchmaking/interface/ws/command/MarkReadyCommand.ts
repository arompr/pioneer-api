import { WsCommand } from './WsCommand';
import { WsCommandType } from './WsCommandType';

export type MarkReadyCommandPayload = {
    playerId: string;
    lobbyId: string;
};

export class MarkReadyCommand implements WsCommand {
    readonly type = WsCommandType.MARK_READY;

    constructor(public readonly payload: MarkReadyCommandPayload) {
        this.payload = payload;
    }
}

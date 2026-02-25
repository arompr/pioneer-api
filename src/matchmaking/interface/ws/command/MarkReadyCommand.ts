import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsLobbyCommandType } from './WsLobbyCommandType';

export type MarkReadyCommandPayload = Record<string, never>;

export class MarkReadyCommand implements WsCommand {
    readonly type = WsLobbyCommandType.MARK_READY;
    public readonly payload: MarkReadyCommandPayload = {};

    constructor() {}
}

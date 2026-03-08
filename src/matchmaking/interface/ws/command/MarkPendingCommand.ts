import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsLobbyCommandType } from './WsLobbyCommandType';

export type MarkPendingCommandPayload = Record<string, never>;

export class MarkPendingCommand implements WsCommand {
    readonly type = WsLobbyCommandType.MARK_PENDING;
    public readonly payload: MarkPendingCommandPayload = {};

    constructor() {}
}

import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsLobbyCommandType } from './WsLobbyCommandType';

/** @publish */
export type MarkPendingCommandPayload = Record<string, never>;

/** @publish */
export class MarkPendingCommand implements WsCommand {
    readonly type = WsLobbyCommandType.MARK_PENDING;
    public readonly payload: MarkPendingCommandPayload = {};

    constructor() {}
}

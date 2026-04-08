import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { IsNotEmpty, IsString } from 'class-validator';
import { WsLobbyCommandType } from './WsLobbyCommandType';

/** @publish */
export class SyncPlayerCommandPayload {
    @IsString()
    @IsNotEmpty()
    token: string;
}

/** @publish */
export class SyncPlayerCommand implements WsCommand {
    readonly type = WsLobbyCommandType.SYNC_PLAYER;

    constructor(public readonly payload: SyncPlayerCommandPayload) {
        this.payload = payload;
    }
}

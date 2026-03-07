import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { IsNotEmpty, IsString } from 'class-validator';
import { WsLobbyCommandType } from './WsLobbyCommandType';

export class SyncPlayerCommandPayload {
    @IsString()
    @IsNotEmpty()
    token!: string;
}

export class SyncPlayerCommand implements WsCommand {
    readonly type = WsLobbyCommandType.SYNC_PLAYER;

    constructor(public readonly payload: SyncPlayerCommandPayload) {
        this.payload = payload;
    }
}

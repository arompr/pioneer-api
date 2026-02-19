import { CommandPayload } from './WsCommand';
import { WsCommandType } from './WsCommandType';
import { Socket } from 'socket.io';

export interface WsCommandHandler<TPayload extends CommandPayload> {
    readonly type: WsCommandType;
    execute(payload: TPayload, client: Socket): Promise<void>;
}

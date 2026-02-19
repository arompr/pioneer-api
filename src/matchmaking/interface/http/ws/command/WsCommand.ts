import { WsCommandType } from './WsCommandType';

export type CommandPayload = Record<string, unknown>;

export interface WsCommand<TPayload extends CommandPayload = CommandPayload> {
    readonly type: WsCommandType;
    readonly payload: TPayload;
}

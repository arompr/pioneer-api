import { WsCommandType } from './WsCommandType';

export type CommandPayload = Record<string, unknown>;

export interface WsCommand<TPayload extends object = object> {
    readonly type: WsCommandType;
    readonly payload: TPayload;
}

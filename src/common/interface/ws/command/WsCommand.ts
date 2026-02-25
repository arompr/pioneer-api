export type CommandPayload = Record<string, unknown>;

export interface WsCommand<TPayload extends object = object> {
    readonly type: string;
    readonly payload: TPayload;
}

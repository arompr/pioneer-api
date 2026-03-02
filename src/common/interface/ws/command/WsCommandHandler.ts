import { LobbySocket } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { ClassConstructor } from 'class-transformer';
import { WsCommand } from './WsCommand';
import { Server } from 'socket.io';

export interface WsCommandHandler<TCommand extends WsCommand> {
    payloadValidationClass?: ClassConstructor<TCommand['payload']>;
    handle(command: TCommand, server: Server, client: LobbySocket): Promise<void> | void;
}

import { LobbySocket } from '../LobbyGatewayWs';
import { WsCommand } from './WsCommand';
import { Server } from 'socket.io';

export interface WsCommandHandler<TCommand extends WsCommand> {
    handle(command: TCommand, server: Server, client: LobbySocket): Promise<void> | void;
}

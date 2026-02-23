import { Server } from 'socket.io';
import { WsCommand } from './WsCommand';
import { WsCommandHandler } from './WsCommandHandler';
import { LobbySocket } from '../LobbyGatewayWs';
import { UnknownCommandError } from '../errors/UnknownCommandError';
import { WsCommandType } from './WsCommandType';

export class WsCommandDispatcher {
    private handlers = new Map<WsCommandType, WsCommandHandler<WsCommand>>();

    async dispatch(command: WsCommand, client: LobbySocket, server: Server): Promise<void> {
        const handler = this.handlers.get(command.type);

        if (!handler) {
            throw new UnknownCommandError(command.type);
        }

        await handler.handle(command, server, client);
    }

    register<T extends WsCommand>(type: WsCommandType, handler: WsCommandHandler<T>): void {
        this.handlers.set(type, handler);
    }
}

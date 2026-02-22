import { Server } from 'socket.io';
import { WsCommand } from './WsCommand';
import { WsCommandHandler } from './WsCommandHandler';
import { WsEvents } from '../WsEventsType';
import { LobbySocket } from '../LobbyGatewayWs';

export class WsCommandDispatcher {
    private handlers = new Map<string, WsCommandHandler<WsCommand>>();

    async dispatch(command: WsCommand, client: LobbySocket, server: Server): Promise<void> {
        const handler = this.handlers.get(command.type);

        if (!handler) {
            client.emit(WsEvents.ERROR, { message: `Unknown command: ${command.type}` });
            return;
        }

        await handler.handle(command, server, client);
    }

    register<T extends WsCommand>(type: string, handler: WsCommandHandler<T>): void {
        this.handlers.set(type, handler);
    }
}

import { Server } from 'socket.io';
import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { LobbySocket } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { UnknownCommandError } from '#matchmaking/interface/ws/errors/UnknownCommandError';
import { CommandValidator } from './CommandValidator';

export class WsCommandDispatcher {
    private handlers = new Map<string, WsCommandHandler<WsCommand>>();

    async dispatch(command: WsCommand, client: LobbySocket, server: Server): Promise<void> {
        const handler = this.handlers.get(command.type);

        if (!handler) {
            throw new UnknownCommandError(command.type);
        }

        await CommandValidator.validate(handler, command);
        await handler.handle(command, server, client);
    }

    register<T extends WsCommand>(type: string, handler: WsCommandHandler<T>): void {
        this.handlers.set(type, handler);
    }
}

import type { LobbySocket } from '../LobbyGatewayWs';
import type { Server } from 'socket.io';
import type { WsCommand } from '#common/interface/ws/command/WsCommand';
import { SocketNotAuthenticatedError } from '../errors/SocketNotAuthenticatedError';

export function RequiresAuth(): MethodDecorator {
    return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value as (
            command: WsCommand,
            server: Server,
            client: LobbySocket
        ) => unknown;

        descriptor.value = function (
            this: unknown,
            command: WsCommand,
            server: Server,
            client: LobbySocket
        ) {
            if (!client?.data?.lobbyId || !client?.data?.playerId) {
                throw new SocketNotAuthenticatedError();
            }

            return originalMethod.call(this, command, server, client);
        };

        return descriptor;
    };
}

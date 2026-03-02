import { Server } from 'socket.io';
import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { LobbySocket } from '#matchmaking/interface/ws/LobbyGatewayWs';
import { UnknownCommandError } from '#matchmaking/interface/ws/errors/UnknownCommandError';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { WsValidationError } from '../errors/WsValidationError';
import { formatValidationErrors } from '../errors/validation-error.util';

export interface ValidationErrorFormatted {
    property: string;
    constraints?: Record<string, string>;
}

export class WsCommandDispatcher {
    private handlers = new Map<string, WsCommandHandler<WsCommand>>();

    async dispatch(command: WsCommand, client: LobbySocket, server: Server): Promise<void> {
        const handler = this.handlers.get(command.type);

        if (!handler) {
            throw new UnknownCommandError(command.type);
        }

        if (handler.payloadValidationClass) {
            const payload = plainToInstance(handler.payloadValidationClass, command.payload);
            const errors = await validate(payload);

            if (errors.length > 0) {
                throw new WsValidationError(formatValidationErrors(errors));
            }
        }

        await handler.handle(command, server, client);
    }

    register<T extends WsCommand>(type: string, handler: WsCommandHandler<T>): void {
        this.handlers.set(type, handler);
    }
}

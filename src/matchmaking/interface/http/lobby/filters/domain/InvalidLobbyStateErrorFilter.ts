import { InvalidLobbyStateError } from '#matchmaking/domain/lobby/errors/InvalidLobbyStateError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InvalidLobbyStateError)
export class InvalidLobbyStateErrorFilter implements ExceptionFilter<InvalidLobbyStateError> {
    readonly statusCode = 400;
    readonly code: string = 'INVALID_LOBBY_STATE';

    catch(exception: InvalidLobbyStateError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Invalid lobby state: ${exception.stateType}`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

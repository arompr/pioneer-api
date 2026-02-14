import { LobbyClosedError } from '#matchmaking/domain/lobby/errors/LobbyClosedError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(LobbyClosedError)
export class LobbyClosedErrorFilter implements ExceptionFilter<LobbyClosedError> {
    readonly statusCode = 400;
    readonly code: string = 'LOBBY_CLOSED';

    catch(exception: LobbyClosedError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Lobby is closed and cannot accept this action`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

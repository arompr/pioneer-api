import { LobbyFullError } from '#matchmaking/domain/lobby/errors/LobbyFullError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(LobbyFullError)
export class LobbyFullErrorFilter implements ExceptionFilter<LobbyFullError> {
    readonly statusCode = 400;
    readonly code: string = 'LOBBY_FULL';

    catch(exception: LobbyFullError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Lobby has reached its capacity`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

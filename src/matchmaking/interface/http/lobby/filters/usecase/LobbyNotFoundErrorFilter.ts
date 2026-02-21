import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(LobbyNotFoundError)
export class LobbyNotFoundErrorFilter implements ExceptionFilter<LobbyNotFoundError> {
    readonly statusCode = 404;
    readonly code: string = 'LOBBY_NOT_FOUND';

    catch(exception: LobbyNotFoundError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

import { LobbyNotReadyToStartError } from '#matchmaking/domain/lobby/errors/LobbyNotReadyToStartError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(LobbyNotReadyToStartError)
export class LobbyNotReadyToStartErrorFilter implements ExceptionFilter<LobbyNotReadyToStartError> {
    readonly statusCode = 400;
    readonly code: string = 'LOBBY_NOT_READY_TO_START';

    catch(exception: LobbyNotReadyToStartError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Lobby is not ready to start. Check player count and ready status`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

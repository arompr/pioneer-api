import { LobbyAlreadyInGameError } from '#matchmaking/domain/lobby/errors/LobbyAlreadyInGameError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(LobbyAlreadyInGameError)
export class LobbyAlreadyInGameErrorFilter implements ExceptionFilter<LobbyAlreadyInGameError> {
    readonly statusCode = 400;
    readonly code: string = 'LOBBY_ALREADY_IN_GAME';

    catch(exception: LobbyAlreadyInGameError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Lobby is already in game`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

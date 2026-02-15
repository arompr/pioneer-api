import { PlayerAlreadyInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerAlreadyInLobbyError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(PlayerAlreadyInLobbyError)
export class PlayerAlreadyInLobbyErrorFilter implements ExceptionFilter<PlayerAlreadyInLobbyError> {
    readonly statusCode = 400;
    readonly code: string = 'PLAYER_ALREADY_IN_LOBBY';

    catch(exception: PlayerAlreadyInLobbyError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Player is already in the lobby`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

import { PlayerNotFoundInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerNotFoundInLobbyError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(PlayerNotFoundInLobbyError)
export class PlayerNotFoundInLobbyErrorFilter implements ExceptionFilter<PlayerNotFoundInLobbyError> {
    readonly statusCode = 404;
    readonly code: string = 'PLAYER_NOT_FOUND_IN_LOBBY';

    catch(exception: PlayerNotFoundInLobbyError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Player was not found in the lobby`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

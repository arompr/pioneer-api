import { PlayerIsNotHostError } from '#matchmaking/domain/lobby/errors/PlayerIsNotHostError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(PlayerIsNotHostError)
export class PlayerIsNotHostErrorFilter implements ExceptionFilter<PlayerIsNotHostError> {
    readonly statusCode = 403;
    readonly code: string = 'PLAYER_IS_NOT_HOST';

    catch(exception: PlayerIsNotHostError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Player is not the host of the lobby and cannot perform this action`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

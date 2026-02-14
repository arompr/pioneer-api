import { MinPlayersExceedsMaxPlayersError } from '#matchmaking/domain/lobby/errors/MinPlayersExceedsMaxPlayersError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(MinPlayersExceedsMaxPlayersError)
export class MinPlayersExceedsMaxPlayersErrorFilter implements ExceptionFilter<MinPlayersExceedsMaxPlayersError> {
    readonly statusCode = 400;
    readonly code: string = 'MIN_PLAYERS_EXCEEDS_MAX_PLAYERS';

    catch(exception: MinPlayersExceedsMaxPlayersError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Minimum players (${exception.min}) cannot be greater than maximum players (${exception.max})`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

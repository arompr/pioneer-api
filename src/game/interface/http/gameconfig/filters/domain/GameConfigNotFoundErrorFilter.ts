import { GameConfigNotFoundError } from '#game/domain/config/errors/GameConfigNotFoundError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(GameConfigNotFoundError)
export class GameConfigNotFoundErrorFilter implements ExceptionFilter<GameConfigNotFoundError> {
    readonly statusCode = 404;
    readonly code: string = 'GAME_CONFIG_NOT_FOUND';

    catch(exception: GameConfigNotFoundError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: 'Game config not found',
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

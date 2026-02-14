import { UnsupportedGameModeError } from '#matchmaking/domain/lobby/errors/UnsupportedGameModeError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnsupportedGameModeError)
export class UnsupportedGameModeErrorFilter implements ExceptionFilter<UnsupportedGameModeError> {
    readonly statusCode = 400;
    readonly code: string = 'UNSUPPORTED_GAME_MODE';

    catch(exception: UnsupportedGameModeError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `The following game mode is not supported: ${exception.mode}`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

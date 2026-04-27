import { InvalidGameModeError } from '#game/domain/config/errors/InvalidGameModeError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InvalidGameModeError)
export class InvalidLobbyGameModeErrorFilter implements ExceptionFilter<InvalidGameModeError> {
    readonly statusCode = 400;
    readonly code: string = 'INVALID_LOBBY_GAME_MODE';

    catch(exception: InvalidGameModeError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Invalid game mode: ${exception.value}`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

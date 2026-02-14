import { InvalidMinPlayersError } from '#matchmaking/domain/lobby/errors/InvalidMinPlayersError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InvalidMinPlayersError)
export class InvalidMinPlayersErrorFilter implements ExceptionFilter<InvalidMinPlayersError> {
    readonly statusCode = 400;
    readonly code: string = 'INVALID_MIN_PLAYERS';

    catch(exception: InvalidMinPlayersError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Minimum players must be at least 1 (given: ${exception.min})`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

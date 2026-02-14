import { InvalidPlayerStatusError } from '#matchmaking/domain/player/errors/InvalidPlayerStatusError';
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InvalidPlayerStatusError)
export class InvalidPlayerStatusErrorFilter implements ExceptionFilter<InvalidPlayerStatusError> {
    readonly statusCode = 400;
    readonly code: string = 'INVALID_PLAYER_STATUS';

    catch(exception: InvalidPlayerStatusError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Invalid player status: ${exception.value}`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

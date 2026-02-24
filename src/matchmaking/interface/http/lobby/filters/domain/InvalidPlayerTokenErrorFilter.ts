import { InvalidPlayerTokenError } from '#matchmaking/domain/player/errors/InvalidPlayerTokenError';
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(InvalidPlayerTokenError)
export class InvalidPlayerTokenErrorFilter implements ExceptionFilter<InvalidPlayerTokenError> {
    readonly statusCode = HttpStatus.UNAUTHORIZED;
    readonly code: string = 'INVALID_PLAYER_TOKEN';

    catch(exception: InvalidPlayerTokenError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(this.statusCode).json({
            statusCode: this.statusCode,
            code: this.code,
            message: `Invalid player token`,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
        });
    }
}

import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';
import { WsValidationError } from '../../errors/WsValidationError';

@Catch(WsValidationError)
export class WsValidationErrorFilter implements WsExceptionFilter<WsValidationError> {
    readonly code: string = 'VALIDATION_ERROR';

    catch(exception: WsValidationError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            details: exception.details,
            timestamp: new Date().toISOString(),
        });

        if (exception.shouldDisconnect) {
            client.disconnect(true);
        }
    }
}

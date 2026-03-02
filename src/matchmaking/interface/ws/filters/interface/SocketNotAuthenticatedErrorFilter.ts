import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';
import { SocketNotAuthenticatedError } from '../../errors/SocketNotAuthenticatedError';

@Catch(SocketNotAuthenticatedError)
export class SocketNotAuthenticatedErrorFilter implements WsExceptionFilter<SocketNotAuthenticatedError> {
    readonly code: string = 'SOCKET_NOT_AUTHENTICATED';

    catch(exception: SocketNotAuthenticatedError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });

        if (exception.shouldDisconnect) {
            client.disconnect(true);
        }
    }
}

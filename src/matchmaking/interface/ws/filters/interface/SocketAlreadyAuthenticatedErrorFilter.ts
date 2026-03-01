import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';
import { SocketAlreadyAuthenticatedError } from '../../errors/SocketAlreadyAuthenticatedError';

@Catch(SocketAlreadyAuthenticatedError)
export class SocketAlreadyAuthenticatedErrorFilter implements WsExceptionFilter<SocketAlreadyAuthenticatedError> {
    readonly code: string = 'SOCKET_ALREADY_AUTHENTICATED';

    catch(exception: SocketAlreadyAuthenticatedError, host: ArgumentsHost): void {
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

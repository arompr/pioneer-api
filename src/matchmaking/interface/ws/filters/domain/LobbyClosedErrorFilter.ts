import { LobbyClosedError } from '#matchmaking/domain/lobby/errors/LobbyClosedError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(LobbyClosedError)
export class LobbyClosedErrorFilter implements WsExceptionFilter<LobbyClosedError> {
    readonly code: string = 'LOBBY_CLOSED';

    catch(exception: LobbyClosedError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

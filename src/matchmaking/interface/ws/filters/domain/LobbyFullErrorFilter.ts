import { LobbyFullError } from '#matchmaking/domain/lobby/errors/LobbyFullError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(LobbyFullError)
export class LobbyFullErrorFilter implements WsExceptionFilter<LobbyFullError> {
    readonly code: string = 'LOBBY_FULL';

    catch(exception: LobbyFullError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

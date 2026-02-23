import { InvalidMinPlayersError } from '#matchmaking/domain/lobby/errors/InvalidMinPlayersError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(InvalidMinPlayersError)
export class InvalidMinPlayersErrorFilter implements WsExceptionFilter<InvalidMinPlayersError> {
    readonly code: string = 'INVALID_MIN_PLAYERS';

    catch(exception: InvalidMinPlayersError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

import { InvalidLobbyStateError } from '#matchmaking/domain/lobby/errors/InvalidLobbyStateError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { WsEvents } from '../../WsEventsType';
import { LobbySocket } from '../../LobbyGatewayWs';

@Catch(InvalidLobbyStateError)
export class InvalidLobbyStateErrorFilter implements WsExceptionFilter<InvalidLobbyStateError> {
    readonly code: string = 'INVALID_LOBBY_STATE';

    catch(exception: InvalidLobbyStateError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

import { LobbyNotFoundError } from '#matchmaking/usecase/errors/LobbyNotFoundError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(LobbyNotFoundError)
export class LobbyNotFoundWsErrorFilter implements WsExceptionFilter<LobbyNotFoundError> {
    readonly code: string = 'LOBBY_NOT_FOUND';

    catch(exception: LobbyNotFoundError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

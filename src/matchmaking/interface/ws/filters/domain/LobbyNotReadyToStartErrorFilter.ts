import { LobbyNotReadyToStartError } from '#matchmaking/domain/lobby/errors/LobbyNotReadyToStartError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(LobbyNotReadyToStartError)
export class LobbyNotReadyToStartErrorFilter implements WsExceptionFilter<LobbyNotReadyToStartError> {
    readonly code: string = 'LOBBY_NOT_READY_TO_START';

    catch(exception: LobbyNotReadyToStartError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

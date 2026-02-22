import { LobbyAlreadyInGameError } from '#matchmaking/domain/lobby/errors/LobbyAlreadyInGameError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(LobbyAlreadyInGameError)
export class LobbyAlreadyInGameErrorFilter implements WsExceptionFilter<LobbyAlreadyInGameError> {
    readonly code: string = 'LOBBY_ALREADY_IN_GAME';

    catch(exception: LobbyAlreadyInGameError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

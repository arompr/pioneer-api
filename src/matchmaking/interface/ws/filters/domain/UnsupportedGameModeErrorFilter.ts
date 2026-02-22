import { UnsupportedGameModeError } from '#matchmaking/domain/lobby/errors/UnsupportedGameModeError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(UnsupportedGameModeError)
export class UnsupportedGameModeErrorFilter implements WsExceptionFilter<UnsupportedGameModeError> {
    readonly code: string = 'UNSUPPORTED_GAME_MODE';

    catch(exception: UnsupportedGameModeError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

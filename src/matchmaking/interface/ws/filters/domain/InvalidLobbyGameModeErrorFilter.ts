import { InvalidGameModeError } from '#game/domain/config/errors/InvalidGameModeError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { WsEvents } from '../../WsEventsType';
import { LobbySocket } from '../../LobbyGatewayWs';

@Catch(InvalidGameModeError)
export class InvalidLobbyGameModeErrorFilter implements WsExceptionFilter<InvalidGameModeError> {
    readonly code: string = 'INVALID_LOBBY_GAME_MODE';

    catch(exception: InvalidGameModeError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

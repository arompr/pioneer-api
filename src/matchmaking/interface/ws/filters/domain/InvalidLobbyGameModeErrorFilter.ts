import { InvalidLobbyGameModeError } from '#matchmaking/domain/lobby/errors/InvalidLobbyGameModeError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { WsEvents } from '../../WsEventsType';
import { LobbySocket } from '../../LobbyGatewayWs';

@Catch(InvalidLobbyGameModeError)
export class InvalidLobbyGameModeErrorFilter implements WsExceptionFilter<InvalidLobbyGameModeError> {
    readonly code: string = 'INVALID_LOBBY_GAME_MODE';

    catch(exception: InvalidLobbyGameModeError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

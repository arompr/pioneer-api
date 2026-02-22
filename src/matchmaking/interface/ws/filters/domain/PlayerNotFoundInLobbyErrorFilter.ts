import { PlayerNotFoundInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerNotFoundInLobbyError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(PlayerNotFoundInLobbyError)
export class PlayerNotFoundInLobbyErrorFilter implements WsExceptionFilter<PlayerNotFoundInLobbyError> {
    readonly code: string = 'PLAYER_NOT_FOUND_IN_LOBBY';

    catch(exception: PlayerNotFoundInLobbyError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

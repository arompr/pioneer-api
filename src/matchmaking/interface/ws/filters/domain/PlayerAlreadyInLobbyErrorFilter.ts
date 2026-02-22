import { PlayerAlreadyInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerAlreadyInLobbyError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(PlayerAlreadyInLobbyError)
export class PlayerAlreadyInLobbyErrorFilter implements WsExceptionFilter<PlayerAlreadyInLobbyError> {
    readonly code: string = 'PLAYER_ALREADY_IN_LOBBY';

    catch(exception: PlayerAlreadyInLobbyError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}

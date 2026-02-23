import { PlayerIsNotHostError } from '#matchmaking/domain/lobby/errors/PlayerIsNotHostError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(PlayerIsNotHostError)
export class PlayerIsNotHostErrorFilter implements WsExceptionFilter<PlayerIsNotHostError> {
    readonly code: string = 'PLAYER_IS_NOT_HOST';

    catch(exception: PlayerIsNotHostError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}
